'use client';

import { useState } from 'react';
import {
  FileText,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Share2,
  CheckCircle2,
  Download,
  Printer,
  Undo,
  Redo,
  Sparkles,
  Cloud,
} from 'lucide-react';

export default function GoogleDocs({ appProps }: { appProps?: any }) {
  const [docTitle, setDocTitle] = useState(appProps?.title || 'Untitled Document');
  const [content, setContent] = useState(
    appProps?.content ||
      'Welcome to Google Docs in ArcOS.\n\nYou can compose, edit, format, and save your cloud documents directly inside ArcOS without leaving the operating system.\n\nKey features:\n• Real-time formatting\n• Native Google Drive sync\n• Clean distraction-free document canvas'
  );
  const [isSaved, setIsSaved] = useState(true);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 1000);
  };

  return (
    <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <FileText size={20} />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-sm font-semibold bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -ml-1 text-zinc-900 dark:text-white"
            />
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
              {isSaved ? (
                <>
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  <span>Saved to Google Drive</span>
                </>
              ) : (
                <>
                  <Cloud size={11} className="animate-bounce text-blue-500" />
                  <span>Saving changes...</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([content], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = `${docTitle}.txt`;
              document.body.appendChild(element);
              element.click();
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium transition-colors"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <button className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors">
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-1.5 flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 overflow-x-auto shrink-0">
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500" title="Undo">
          <Undo size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500" title="Redo">
          <Redo size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500" title="Print">
          <Printer size={14} />
        </button>
        <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <select className="bg-transparent text-xs font-medium border border-zinc-300 dark:border-zinc-700 rounded px-2 py-0.5 outline-none">
          <option>Normal text</option>
          <option>Title</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
        </select>

        <select className="bg-transparent text-xs font-medium border border-zinc-300 dark:border-zinc-700 rounded px-2 py-0.5 outline-none">
          <option>Arial</option>
          <option>Roboto</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
        </select>

        <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Bold">
          <Bold size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Italic">
          <Italic size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Underline">
          <Underline size={14} />
        </button>

        <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Align Left">
          <AlignLeft size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Align Center">
          <AlignCenter size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Align Right">
          <AlignRight size={14} />
        </button>

        <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Bullet List">
          <List size={14} />
        </button>
        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded" title="Numbered List">
          <ListOrdered size={14} />
        </button>
      </div>

      {/* Document Page Canvas */}
      <div className="flex-1 bg-zinc-200 dark:bg-zinc-950 p-6 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl min-h-[600px] bg-white text-zinc-900 rounded-xl shadow-xl p-10 border border-zinc-300 dark:border-zinc-800 flex flex-col">
          <textarea
            value={content}
            onChange={handleTextChange}
            placeholder="Start typing your document..."
            className="w-full h-full flex-1 border-none outline-none resize-none font-sans text-sm leading-relaxed text-zinc-900 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
