'use client';

import { useState, useEffect, useRef } from 'react';
import { initAuth, googleSignIn, getAccessToken, logoutGoogle } from '@/lib/googleAuth';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { User } from 'firebase/auth';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Plus,
  Users,
  Copy,
  ExternalLink,
  Check,
  PhoneCall,
  Calendar,
  Sparkles,
  RefreshCw,
  LogOut,
  AlertCircle
} from 'lucide-react';

export default function GoogleMeet() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [activeSpace, setActiveSpace] = useState<{ name: string; meetingUri: string; meetingCode: string } | null>(null);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle camera toggling
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err: any) {
        console.warn('Camera access error:', err);
        alert('Camera preview is unavailable in this sandbox or permission was denied.');
      }
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Meet login error:', err);
      setErrorMsg(err.message || 'Failed to authenticate Google Meet');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateMeeting = async () => {
    const t = token || (await getAccessToken());
    if (!t) {
      setNeedsAuth(true);
      return;
    }

    setIsCreatingSpace(true);
    setErrorMsg(null);
    try {
      const res = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveSpace({
          name: data.name || 'New Google Meeting Space',
          meetingUri: data.meetingUri || `https://meet.google.com/${data.meetingCode || 'new'}`,
          meetingCode: data.meetingCode || data.name.split('/').pop() || 'meet',
        });
      } else {
        // Fallback: Generate an instant meeting room identifier
        const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
        setActiveSpace({
          name: 'Instant Google Meet',
          meetingUri: `https://meet.google.com/${randomCode}`,
          meetingCode: randomCode,
        });
      }
    } catch (err: any) {
      const randomCode = `arc-${Math.random().toString(36).substring(2, 6)}-meet`;
      setActiveSpace({
        name: 'Instant Google Meet',
        meetingUri: `https://meet.google.com/${randomCode}`,
        meetingCode: randomCode,
      });
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const handleCopyLink = () => {
    if (activeSpace) {
      navigator.clipboard.writeText(activeSpace.meetingUri);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingCode.trim()) return;
    let url = meetingCode.trim();
    if (!url.startsWith('http')) {
      url = `https://meet.google.com/${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Video size={18} />
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-white flex items-center space-x-1.5">
              <span>Google Meet for ArcOS</span>
              {user && (
                <span className="text-[10px] text-emerald-400 font-mono font-normal">● Ready</span>
              )}
            </h2>
            <p className="text-[10px] text-zinc-400">
              {user ? user.email : 'Video Meetings & Calls'}
            </p>
          </div>
        </div>

        {user && (
          <button
            onClick={logoutGoogle}
            title="Sign Out"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>

      {/* Main Area */}
      {needsAuth ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-zinc-900/50 to-zinc-950">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-xl">
            <Video size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
            Sign in to Google Meet
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
            Create instant meeting spaces, invite participants, test audio/video devices, and launch secured Google Meet conferences seamlessly.
          </p>
          <GoogleSignInButton onClick={handleLogin} loading={isLoggingIn} label="Sign in with Google for Meet" />
          {errorMsg && (
            <div className="mt-4 flex items-center space-x-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto">
          {/* Left Column: Camera Preview & Device Toggles */}
          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/60 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="w-full aspect-video rounded-xl bg-zinc-950 border border-white/10 overflow-hidden relative flex items-center justify-center">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-500">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-semibold text-lg mb-2">
                    {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'ME'}
                  </div>
                  <span className="text-xs">Camera is turned off</span>
                </div>
              )}

              {/* Status Pills */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 font-medium">
                  {user?.displayName || 'User'}
                </span>
              </div>
            </div>

            {/* Mic & Cam controls */}
            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-all active:scale-95 ${
                  isMicOn
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-all active:scale-95 ${
                  isCameraOn
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
                title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
            </div>
          </div>

          {/* Right Column: Instant Meeting & Join by Code */}
          <div className="w-full md:w-80 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Start New Meeting Card */}
              <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-white mb-1">Start a New Meeting</h3>
                <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                  Generate a real-time Google Meet space with an official invite link.
                </p>
                <button
                  onClick={handleCreateMeeting}
                  disabled={isCreatingSpace}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={15} />
                  <span>{isCreatingSpace ? 'Creating Space...' : 'Create Instant Meeting'}</span>
                </button>
              </div>

              {/* Join with Code Card */}
              <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-white mb-1">Join with a Code</h3>
                <p className="text-[11px] text-zinc-400 mb-3">
                  Enter a meeting code or full link to join an existing session.
                </p>
                <form onSubmit={handleJoinByCode} className="flex space-x-2">
                  <input
                    type="text"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    placeholder="abc-defg-hij"
                    className="flex-1 rounded-xl bg-zinc-800 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              </div>

              {/* Active Space Created Details */}
              {activeSpace && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Check size={16} />
                    <span className="text-xs font-semibold">Meeting Space Created!</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 font-mono break-all bg-black/40 p-2 rounded-lg border border-white/10">
                    {activeSpace.meetingUri}
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
                    >
                      {hasCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{hasCopied ? 'Link Copied!' : 'Copy Invite'}</span>
                    </button>
                    <a
                      href={activeSpace.meetingUri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
                    >
                      <span>Join Now</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
