'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Search,
  CheckSquare,
  Square,
  Palette,
  ExternalLink,
  Tag,
  Archive,
  RefreshCw
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  color: string;
  checklist?: { id: string; text: string; completed: boolean }[];
  updatedAt: string;
}

const NOTE_COLORS = [
  { name: 'Default', bg: 'bg-zinc-900 border-white/10' },
  { name: 'Coral', bg: 'bg-rose-950/70 border-rose-800/40 text-rose-100' },
  { name: 'Peach', bg: 'bg-amber-950/70 border-amber-800/40 text-amber-100' },
  { name: 'Sand', bg: 'bg-yellow-950/70 border-yellow-800/40 text-yellow-100' },
  { name: 'Mint', bg: 'bg-emerald-950/70 border-emerald-800/40 text-emerald-100' },
  { name: 'Sage', bg: 'bg-teal-950/70 border-teal-800/40 text-teal-100' },
  { name: 'Fog', bg: 'bg-sky-950/70 border-sky-800/40 text-sky-100' },
  { name: 'Storm', bg: 'bg-indigo-950/70 border-indigo-800/40 text-indigo-100' },
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: '1',
    title: 'ArcOS Workspace Integration',
    content: 'All Google services (Drive, Gmail, Meet, Keep) are unified into the desktop runtime.',
    isPinned: true,
    color: 'bg-yellow-950/70 border-yellow-800/40 text-yellow-100',
    updatedAt: 'Today',
  },
  {
    id: '2',
    title: 'Math & AI Formulas',
    content: 'Midpoint Formula: ((x1+x2)/2, (y1+y2)/2)\nDistance Formula: sqrt((x2-x1)^2 + (y2-y1)^2)',
    isPinned: false,
    color: 'bg-emerald-950/70 border-emerald-800/40 text-emerald-100',
    updatedAt: 'Yesterday',
  },
];

export default function GoogleKeep() {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arcos_google_keep_notes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_NOTES;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState(NOTE_COLORS[0].bg);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpandingNew, setIsExpandingNew] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('arcos_google_keep_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleCreateNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) {
      setIsExpandingNew(false);
      return;
    }

    const note: NoteItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      isPinned: false,
      color: newColor,
      updatedAt: 'Just now',
    };

    setNotes([note, ...notes]);
    setNewTitle('');
    setNewContent('');
    setNewColor(NOTE_COLORS[0].bg);
    setIsExpandingNew(false);
  };

  const togglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const changeColor = (id: string, color: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, color } : n)));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-white flex items-center space-x-1.5">
              <span>Google Keep</span>
              <span className="text-[10px] text-amber-400 font-mono">Notes</span>
            </h2>
            <p className="text-[10px] text-zinc-400">Capture ideas, checklists & notes</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="https://keep.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-zinc-200 transition-colors"
          >
            <span>keep.google.com</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-5 flex items-center rounded-2xl bg-zinc-900 border border-white/10 px-3.5 py-2 shadow-md">
          <Search size={15} className="text-zinc-500 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your notes..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder-zinc-500"
          />
        </div>

        {/* Create Note Input Card */}
        <div className="max-w-xl mx-auto mb-6">
          <div className={`rounded-2xl border p-3.5 shadow-xl transition-all ${newColor}`}>
            {isExpandingNew && (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent text-xs font-semibold text-white outline-none mb-2 placeholder-zinc-400"
              />
            )}
            <textarea
              rows={isExpandingNew ? 3 : 1}
              value={newContent}
              onFocus={() => setIsExpandingNew(true)}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Take a note..."
              className="w-full bg-transparent text-xs text-zinc-200 outline-none resize-none placeholder-zinc-500"
            />
            {isExpandingNew && (
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                {/* Color choices */}
                <div className="flex items-center space-x-1">
                  {NOTE_COLORS.slice(0, 6).map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewColor(c.bg)}
                      className={`w-4 h-4 rounded-full border border-white/20 hover:scale-120 transition-transform ${c.bg}`}
                      title={c.name}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpandingNew(false);
                      setNewTitle('');
                      setNewContent('');
                    }}
                    className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateNote()}
                    className="px-4 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-zinc-950 shadow active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Notes Grid */}
        {pinnedNotes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 px-1">
              Pinned Notes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`group relative rounded-2xl border p-3.5 shadow-md flex flex-col justify-between transition-all hover:shadow-xl ${note.color}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-xs font-semibold tracking-tight leading-snug">
                      {note.title || '(Untitled)'}
                    </h5>
                    <button
                      onClick={() => togglePin(note.id)}
                      className="p-1 rounded-full text-amber-400 hover:bg-white/10"
                      title="Unpin Note"
                    >
                      <Pin size={13} className="fill-current" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap flex-1 mb-3">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-zinc-400">{note.updatedAt}</span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Notes Grid */}
        <div>
          {pinnedNotes.length > 0 && (
            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 px-1">
              Others
            </h4>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {otherNotes.map((note) => (
              <div
                key={note.id}
                className={`group relative rounded-2xl border p-3.5 shadow-md flex flex-col justify-between transition-all hover:shadow-xl ${note.color}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-xs font-semibold tracking-tight leading-snug">
                    {note.title || '(Untitled)'}
                  </h5>
                  <button
                    onClick={() => togglePin(note.id)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
                    title="Pin Note"
                  >
                    <Pin size={13} />
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap flex-1 mb-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-zinc-400">{note.updatedAt}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
