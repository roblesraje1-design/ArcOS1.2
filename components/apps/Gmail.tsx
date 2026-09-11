'use client';

import { useState, useEffect } from 'react';
import { initAuth, googleSignIn, getAccessToken, logoutGoogle } from '@/lib/googleAuth';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { User } from 'firebase/auth';
import {
  Mail,
  Inbox,
  Send,
  Trash2,
  Edit3,
  Search,
  RefreshCw,
  LogOut,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  User as UserIcon,
  X
} from 'lucide-react';

interface GmailMessage {
  id: string;
  threadId: string;
  snippet?: string;
  from?: string;
  subject?: string;
  date?: string;
}

export default function Gmail() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compose state
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        setNeedsAuth(false);
        fetchMessages(t);
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
        fetchMessages(res.accessToken);
      }
    } catch (err: any) {
      console.error('Gmail login error:', err);
      setErrorMsg(err.message || 'Failed to sign in to Gmail');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchMessages = async (accessToken?: string) => {
    const t = accessToken || token || (await getAccessToken());
    if (!t) {
      setNeedsAuth(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15',
        {
          headers: { Authorization: `Bearer ${t}` },
        }
      );

      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }

      const data = await res.json();
      if (!data.messages || data.messages.length === 0) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // Fetch headers for messages in parallel
      const detailedMessages = await Promise.all(
        data.messages.slice(0, 10).map(async (msg: { id: string }) => {
          try {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
              {
                headers: { Authorization: `Bearer ${t}` },
              }
            );
            const detail = await detailRes.json();
            const headers = detail.payload?.headers || [];
            const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject');
            const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from');
            const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date');

            return {
              id: detail.id,
              threadId: detail.threadId,
              snippet: detail.snippet,
              subject: subjectHeader ? subjectHeader.value : '(No Subject)',
              from: fromHeader ? fromHeader.value : 'Unknown Sender',
              date: dateHeader ? new Date(dateHeader.value).toLocaleDateString() : '',
            };
          } catch {
            return { id: msg.id, threadId: '', subject: 'Mail item' };
          }
        })
      );

      setMessages(detailedMessages);
    } catch (err: any) {
      console.error('Gmail fetch error:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // User confirmation for destructive operations (strictly mandatory per workspace-integration skill)
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim()) {
      alert('Please specify a recipient');
      return;
    }

    const confirmed = window.confirm(
      `Send email to "${composeTo}" with subject "${composeSubject || '(No Subject)'}"?`
    );
    if (!confirmed) return;

    const t = token || (await getAccessToken());
    if (!t) return;

    setIsSending(true);
    try {
      const emailContent = [
        `To: ${composeTo}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${composeSubject}`,
        '',
        composeBody,
      ].join('\r\n');

      // Base64url encode
      const base64Encoded = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${t}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: base64Encoded }),
        }
      );

      if (res.ok) {
        setIsComposing(false);
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        alert('Email sent successfully!');
        fetchMessages(t);
      } else {
        const data = await res.json();
        alert(`Failed to send: ${data.error?.message || 'Error occurred'}`);
      }
    } catch (err: any) {
      alert(`Send error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // User confirmation for destructive delete
  const handleDeleteMessage = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this email? It will be moved to Trash.'
    );
    if (!confirmed) return;

    const t = token || (await getAccessToken());
    if (!t) return;

    try {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${t}` },
        }
      );
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      (m.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.from || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.snippet || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <Mail size={18} />
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-white flex items-center space-x-1.5">
              <span>Gmail for ArcOS</span>
              {user && (
                <span className="text-[10px] text-emerald-400 font-mono font-normal">● Online</span>
              )}
            </h2>
            <p className="text-[10px] text-zinc-400">
              {user ? user.email : 'Google Mailbox'}
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsComposing(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-medium text-white shadow-sm transition-colors cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Compose</span>
            </button>
            <button
              onClick={() => fetchMessages()}
              disabled={isLoading}
              title="Refresh Inbox"
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

      {/* Main Container */}
      {needsAuth ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-zinc-900/50 to-zinc-950">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 shadow-xl">
            <Mail size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
            Connect your Gmail
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
            Read, search, and compose emails securely inside ArcOS using real-time Google Workspace authentication and permissions.
          </p>
          <GoogleSignInButton onClick={handleLogin} loading={isLoggingIn} label="Sign in with Google for Gmail" />
          {errorMsg && (
            <div className="mt-4 flex items-center space-x-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Email List Column */}
          <div className="w-80 sm:w-96 border-r border-white/10 flex flex-col bg-zinc-900/40">
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center rounded-xl bg-zinc-800/80 border border-white/10 px-2.5 py-1.5">
                <Search size={13} className="text-zinc-400 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails..."
                  className="w-full bg-transparent text-xs text-zinc-200 outline-none placeholder-zinc-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
              {isLoading && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs">
                  <RefreshCw size={20} className="animate-spin mb-2 text-red-400" />
                  <span>Loading inbox...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-xs">
                  <Inbox size={24} className="mb-2 opacity-50" />
                  <span>No emails found</span>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedMessage?.id === msg.id
                        ? 'bg-red-600/15 border-l-2 border-red-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-200 truncate max-w-[190px]">
                        {msg.from}
                      </span>
                      <span className="text-[10px] text-zinc-500 shrink-0">{msg.date}</span>
                    </div>
                    <div className="text-xs font-medium text-white truncate mb-1">
                      {msg.subject}
                    </div>
                    <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reading Pane Column */}
          <div className="flex-1 flex flex-col bg-zinc-950 p-5 overflow-y-auto">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-zinc-400">
                      <span>From:</span>
                      <span className="text-zinc-200 font-medium">{selectedMessage.from}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-zinc-500">{selectedMessage.date}</span>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors"
                      title="Move to Trash"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  {selectedMessage.snippet}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-xs">
                <Mail size={32} className="mb-2 opacity-30" />
                <span>Select an email to read</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSendEmail}
            className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/15 p-5 shadow-2xl flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-semibold text-white">New Email</h4>
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400">To:</label>
              <input
                type="email"
                required
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                placeholder="recipient@example.com"
                className="mt-1 w-full rounded-xl bg-zinc-800 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400">Subject:</label>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Subject line"
                className="mt-1 w-full rounded-xl bg-zinc-800 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400">Message:</label>
              <textarea
                rows={6}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your email here..."
                className="mt-1 w-full rounded-xl bg-zinc-800 border border-white/10 p-3 text-xs text-white outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="px-4 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-md active:scale-95 disabled:opacity-50"
              >
                <Send size={13} />
                <span>{isSending ? 'Sending...' : 'Send Email'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
