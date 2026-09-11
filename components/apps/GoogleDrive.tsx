'use client';

import { useState, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { initAuth, googleSignIn, getAccessToken, logoutGoogle } from '@/lib/googleAuth';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { User } from 'firebase/auth';
import {
  Cloud,
  Folder,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Film,
  Plus,
  Trash2,
  Download,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  HardDrive,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export default function GoogleDrive() {
  const openApp = useOSStore((s) => s.openApp);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        setNeedsAuth(false);
        fetchFiles(t);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setNeedsAuth(false);
        fetchFiles(res.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Google Sign-In failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const openDriveFileInOS = (file: DriveFile) => {
    const url = file.webViewLink || `https://drive.google.com/file/d/${file.id}/preview`;
    openApp('browser', file.name, { url });
  };

  const fetchFiles = async (accessToken?: string) => {
    const t = accessToken || token || (await getAccessToken());
    if (!t) {
      setNeedsAuth(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=30&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)',
        {
          headers: { Authorization: `Bearer ${t}` },
        }
      );

      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message || 'Error loading Google Drive');
      }

      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Drive fetch error:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const t = token || (await getAccessToken());
    if (!t) return;

    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          mimeType: 'application/vnd.google-apps.folder',
        }),
      });
      if (res.ok) {
        setNewFolderName('');
        setIsCreatingFolder(false);
        fetchFiles(t);
      }
    } catch (err) {
      console.error('Folder creation failed:', err);
    }
  };

  // User confirmation for destructive operations (strictly mandatory per workspace-integration skill)
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}" from your Google Drive? This action cannot be undone.`
    );
    if (!confirmed) return;

    const t = token || (await getAccessToken());
    if (!t) return;

    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok || res.status === 204) {
        setFiles(files.filter((f) => f.id !== fileId));
      } else {
        const data = await res.json();
        alert(`Delete failed: ${data.error?.message || 'Permission denied'}`);
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="text-amber-400" size={18} />;
    if (mimeType.includes('image')) return <ImageIcon className="text-purple-400" size={18} />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="text-emerald-400" size={18} />;
    if (mimeType.includes('video')) return <Film className="text-rose-400" size={18} />;
    return <FileText className="text-blue-400" size={18} />;
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Cloud size={18} />
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-white flex items-center space-x-1.5">
              <span>Google Drive</span>
              {user && (
                <span className="text-[10px] text-emerald-400 font-mono font-normal">● Connected</span>
              )}
            </h2>
            <p className="text-[10px] text-zinc-400">
              {user ? user.email : 'Personal Cloud Storage'}
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingFolder(!isCreatingFolder)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-zinc-200 transition-colors"
            >
              <Plus size={14} />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => fetchFiles()}
              disabled={isLoading}
              title="Refresh Files"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={logoutGoogle}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Area */}
      {needsAuth ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-zinc-900/50 to-zinc-950">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
            <Cloud size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
            Connect your Google Drive
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
            Access, view, organize, and manage your Google Drive files, documents, and spreadsheets natively inside ArcOS with official Google Workspace security.
          </p>
          <GoogleSignInButton onClick={handleLogin} loading={isLoggingIn} label="Sign in with Google to Access Drive" />
          {errorMsg && (
            <div className="mt-4 flex items-center space-x-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {/* Create Folder Bar */}
          {isCreatingFolder && (
            <form onSubmit={handleCreateFolder} className="mb-3 flex items-center space-x-2 bg-zinc-900 border border-white/15 p-2 rounded-xl">
              <Folder size={16} className="text-amber-400 ml-1" />
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="flex-1 bg-transparent text-xs text-white outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingFolder(false)}
                className="px-2 py-1 text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Search bar */}
          <div className="mb-3 flex items-center rounded-xl bg-zinc-900 border border-white/10 px-3 py-1.5">
            <Search size={14} className="text-zinc-500 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files in Google Drive..."
              className="w-full bg-transparent text-xs text-zinc-200 outline-none placeholder-zinc-500"
            />
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {isLoading && files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs">
                <RefreshCw size={20} className="animate-spin mb-2 text-emerald-400" />
                <span>Loading Google Drive items...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs">
                <HardDrive size={24} className="mb-2 opacity-50" />
                <span>No files found in Drive</span>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => openDriveFileInOS(file)}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-zinc-200 truncate group-hover:text-white">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate">
                        {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive item'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDriveFileInOS(file);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-blue-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      title="Open in ArcOS Window"
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id, file.name);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      title="Delete File"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
