'use client';

import { useState } from 'react';
import { History, Hand, Settings2 } from 'lucide-react';

const SKIN_TONES = ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'];

interface HistoryItem {
  id: string;
  input: string;
  output: string;
}

export default function EOSLTranslator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [skinToneIndex, setSkinToneIndex] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isShortening, setIsShortening] = useState(true);

  const translate = () => {
    if (!input.trim()) return;

    // Mock translation logic for EOSL
    let translated = input.toUpperCase();
    
    if (isShortening) {
      // Basic phrase shortening mock
      translated = translated
        .replace(/HOW ARE YOU/g, 'HOW YOU')
        .replace(/WHAT IS YOUR NAME/g, 'YOUR NAME WHAT')
        .replace(/I AM/g, 'ME')
        .replace(/DO YOU WANT TO/g, 'YOU WANT');
    }

    // Add skin tone modifier to some words (mock visual representation)
    const words = translated.split(' ');
    const visualTranslation = words.map(w => `${w} ${SKIN_TONES[skinToneIndex]}`).join(' ');

    setOutput(visualTranslation);

    const newHistory = [{ id: Date.now().toString(), input, output: visualTranslation }, ...history].slice(0, 10);
    setHistory(newHistory);
  };

  return (
    <div className="flex h-full bg-zinc-900 text-zinc-100">
      {/* Main Translation Area */}
      <div className="flex-1 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Hand className="text-blue-400" /> EOSL Translator Pro
          </h2>
          <div className="flex items-center space-x-4 bg-zinc-800 p-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-400">Skin Tone:</span>
              <div className="flex space-x-1">
                {SKIN_TONES.map((tone, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSkinToneIndex(idx)}
                    className={`text-xl p-1 rounded hover:bg-zinc-700 ${skinToneIndex === idx ? 'bg-zinc-700 ring-1 ring-blue-500' : ''}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-6 bg-zinc-700"></div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isShortening}
                onChange={(e) => setIsShortening(e.target.checked)}
                className="rounded border-zinc-600 text-blue-500 focus:ring-blue-500 bg-zinc-700"
              />
              <span className="text-sm text-zinc-400">Phrase Shortening</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-zinc-400">English Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-lg resize-none focus:outline-none focus:border-blue-500"
              placeholder="Type English phrase here..."
            />
            <button
              onClick={translate}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Translate to EOSL
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-zinc-400">EOSL Output</label>
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-lg overflow-auto">
              {output || <span className="text-zinc-600 italic">Translation will appear here...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
          <History size={18} className="text-zinc-400" />
          <span className="font-medium">History (Last 10)</span>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-zinc-600 text-sm text-center mt-4">No history yet</div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">English</div>
                <div className="text-sm mb-2 truncate">{item.input}</div>
                <div className="text-xs text-zinc-500 mb-1">EOSL</div>
                <div className="text-sm font-medium truncate">{item.output}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
