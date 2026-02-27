/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Search, Settings, Music, CloudRain, Clock, 
  User, Edit2, Repeat, Shuffle, ChevronLeft, ChevronRight,
  Lock, Moon, Flame, Waves, Wind, MoonStar,
  TreePine, AudioLines, Coffee, BookOpen, Youtube, Brain,
  Piano, X, Activity
} from 'lucide-react';

type View = 'home' | 'music' | 'focus' | 'settings';

export type Track = {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  cover: string;
  videoUrl?: string;
};

const defaultTrack: Track = {
  id: '1',
  title: 'Sunset Serenade - Piano & Waves',
  artist: 'Smooth Piano Trio',
  category: 'Chill',
  duration: '22:36',
  cover: 'https://picsum.photos/seed/piano/100/100'
};

const BG_VIDEO_URL = "https://pub-9240560f200a43d8a64bb9102acd49e9.r2.dev/pianocafe2.mp4";
const BG_FALLBACK_IMAGE_URL = "https://i.imgur.com/o9yXFgS.png";

export type Scene = {
  id: string;
  name: string;
  tag: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
};

export const SCENES: Scene[] = [
  { id: 'cozy_loft', name: 'Cozy Loft', tag: 'Warm', type: 'video', url: BG_VIDEO_URL, thumbnail: BG_FALLBACK_IMAGE_URL },
  { id: 'rainy_window', name: 'Rainy Window', tag: 'Rain', type: 'image', url: 'https://picsum.photos/seed/rain/1920/1080', thumbnail: 'https://picsum.photos/seed/rain/400/225' },
  { id: 'night_city', name: 'Night City', tag: 'Night', type: 'image', url: 'https://picsum.photos/seed/city/1920/1080', thumbnail: 'https://picsum.photos/seed/city/400/225' },
  { id: 'ocean_view', name: 'Ocean View', tag: 'Ocean', type: 'image', url: 'https://picsum.photos/seed/ocean/1920/1080', thumbnail: 'https://picsum.photos/seed/ocean/400/225' },
];

function BackgroundLayer() {
  const [videoError, setVideoError] = useState(false);

  const style: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: -1,
    pointerEvents: 'none'
  };

  if (videoError) {
    return (
      <img 
        src={BG_FALLBACK_IMAGE_URL} 
        alt="Background Fallback" 
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        style={style}
      />
    );
  }

  return (
    <video 
      src={BG_VIDEO_URL} 
      autoPlay 
      loop 
      muted 
      playsInline
      preload="auto"
      poster={BG_FALLBACK_IMAGE_URL}
      onError={() => setVideoError(true)}
      style={style}
    />
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrack);
  const [activeSceneId, setActiveSceneId] = useState<string>('cozy_loft');
  const [showPracticePanel, setShowPracticePanel] = useState(false);

  const activeScene = SCENES.find(s => s.id === activeSceneId) || SCENES[0];

  return (
    <div className="min-h-screen flex flex-col items-center relative text-[#3a352f]">
      <BackgroundLayer />
      
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0"></div>
      
      <TopNav activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-32 pb-32 z-10 relative">
        {activeView === 'home' && <HeroOverlay />}
        {activeView === 'music' && (
          <MusicTab 
            currentTrack={currentTrack} 
            setCurrentTrack={setCurrentTrack} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} 
          />
        )}
        {activeView === 'focus' && (
          <FocusTab 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            activeSceneId={activeSceneId}
            setActiveSceneId={setActiveSceneId}
          />
        )}
        {activeView === 'settings' && <SettingsTab />}
      </main>

      {showPracticePanel && (
        <PracticePanel onClose={() => setShowPracticePanel(false)} />
      )}
      
      <BottomPlayer 
        currentTrack={currentTrack}
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        showPracticePanel={showPracticePanel}
        setShowPracticePanel={setShowPracticePanel}
      />
    </div>
  );
}

function PracticePanel({ onClose }: { onClose: () => void }) {
  // 88 keys: A0 to C8
  // White keys: 52, Black keys: 36
  const whiteKeys = [
    'A0', 'B0',
    'C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1',
    'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
    'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
    'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
    'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6',
    'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
    'C8'
  ];

  const isBlackKey = (note: string) => note.includes('#') || note.includes('b');
  
  // Helper to check if a white key has a black key to its right (except E and B)
  const hasBlackRight = (note: string) => {
    const name = note.charAt(0);
    return name !== 'E' && name !== 'B';
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 h-[40vh] z-40 animate-in slide-in-from-bottom duration-500">
      <div className="w-full h-full bg-[rgba(235,225,215,0.9)] backdrop-blur-2xl border-t border-white/30 flex flex-col rounded-t-[40px] shadow-2xl overflow-hidden">
        
        {/* 1) Staff Section (50% height) */}
        <div className="h-[50%] relative flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#ebe1d7] via-transparent to-[#ebe1d7] z-10 opacity-60"></div>
          
          {/* Staff Lines */}
          <div className="flex flex-col gap-[6px] px-4 opacity-20">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-[1px] w-full bg-[#3a352f]"></div>)}
            <div className="h-8"></div>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-[1px] w-full bg-[#3a352f]"></div>)}
          </div>

          {/* Playhead */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#c5a880] z-20 shadow-[0_0_10px_rgba(197,168,128,0.5)]"></div>
          
          {/* Placeholder Notes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex gap-12 translate-x-20 opacity-40">
              <div className="w-4 h-3 bg-[#3a352f] rounded-full rotate-[-20deg]"></div>
              <div className="w-4 h-3 bg-[#3a352f] rounded-full rotate-[-20deg] translate-y-4"></div>
              <div className="w-4 h-3 bg-[#3a352f] rounded-full rotate-[-20deg] -translate-y-2"></div>
              <div className="w-4 h-3 bg-[#c5a880] rounded-full rotate-[-20deg] translate-y-2 shadow-[0_0_8px_rgba(197,168,128,0.8)]"></div>
              <div className="w-4 h-3 bg-[#3a352f] rounded-full rotate-[-20deg] translate-y-6"></div>
            </div>
          </div>
        </div>

        {/* 2) 88-Key Piano Keyboard (40% height) */}
        <div className="h-[40%] px-2 pb-1 flex relative select-none">
          <div className="flex w-full h-full relative">
            {whiteKeys.map((note, i) => {
              const isC = note.startsWith('C');
              return (
                <div 
                  key={note} 
                  className={`flex-1 border-r border-black/5 last:border-0 relative flex flex-col justify-end items-center pb-1 transition-colors hover:bg-white/40 ${note === 'C4' ? 'bg-[#c5a880]/10' : 'bg-white/60'}`}
                  style={{ borderRadius: '0 0 2px 2px' }}
                >
                  {isC && (
                    <span className="text-[8px] font-bold text-[#3a352f]/40 mb-1">{note}</span>
                  )}
                  
                  {/* Black Key Positioning */}
                  {hasBlackRight(note) && note !== 'C8' && (
                    <div 
                      className="absolute top-0 right-0 w-[65%] h-[60%] bg-[#2a2622] rounded-b-sm z-30 translate-x-1/2 shadow-md border-x border-b border-white/5 hover:bg-[#3a352f] transition-colors"
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3) Control Strip (10% height) */}
        <div className="h-[10%] min-h-[40px] border-t border-black/5 flex items-center justify-between px-10 bg-black/5">
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 text-[#3a352f]/60 hover:text-[#3a352f] transition-colors">
              <Repeat className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Loop</span>
            </button>
            <div className="flex items-center gap-1 bg-black/5 p-0.5 rounded-lg">
              {[0.5, 0.75, 1].map(s => (
                <button key={s} className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${s === 1 ? 'bg-white text-[#3a352f] shadow-sm' : 'text-[#3a352f]/40 hover:text-[#3a352f]/60'}`}>
                  {s}x
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-[#3a352f]/60 hover:text-[#3a352f] transition-colors">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Metronome</span>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3a352f]/10 text-[#3a352f] hover:bg-[#3a352f]/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroOverlay() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-700 min-h-[60vh] text-center">
      {/* Clean background with no centered overlay text */}
    </div>
  );
}

function TopNav({ activeView, setActiveView }: { activeView: View, setActiveView: (v: View) => void }) {
  const tabs: { id: View, label: string, icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Music className="w-4 h-4" /> },
    { id: 'music', label: 'Music' },
    { id: 'focus', label: 'Focus' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between gap-4 max-w-6xl w-full">
        
        {/* Empty div to balance the flex layout since brand is gone */}
        <div className="w-8 hidden md:block"></div>

        <nav className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto custom-scrollbar flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-5 md:px-6 py-2 rounded-full transition-all duration-300 font-medium whitespace-nowrap flex items-center gap-2 ${
                activeView === tab.id 
                  ? 'glass-panel-active text-[#3a352f] shadow-lg' 
                  : 'text-[#3a352f]/70 hover:text-[#3a352f] hover:bg-black/5'
              }`}
            >
              {tab.icon && tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3a352f]/50" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-black/5 border border-black/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-48 focus:outline-none focus:bg-black/10 transition-colors text-[#3a352f] placeholder-[#3a352f]/50"
            />
          </div>
          <button className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors shrink-0">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function BottomPlayer({ 
  currentTrack,
  isPlaying, 
  setIsPlaying,
  showPracticePanel,
  setShowPracticePanel
}: { 
  currentTrack: Track,
  isPlaying: boolean, 
  setIsPlaying: (v: boolean) => void,
  showPracticePanel: boolean,
  setShowPracticePanel: (v: boolean) => void
}) {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="player-bar p-4 flex items-center gap-6 w-full px-6 md:px-12 h-24">
        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
          <img 
            src={currentTrack.cover} 
            alt="Album Art" 
            className="w-14 h-14 rounded-lg object-cover shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-[#3a352f] truncate">{currentTrack.title}</span>
            <span className="text-sm text-[#3a352f]/60 truncate">{currentTrack.artist}</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-[#3a352f]/60 hover:text-[#3a352f] transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="text-[#3a352f]/80 hover:text-[#3a352f] transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#3a352f]/10 flex items-center justify-center hover:bg-[#3a352f]/20 transition-colors text-[#3a352f]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button className="text-[#3a352f]/80 hover:text-[#3a352f] transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button className="text-[#3a352f]/60 hover:text-[#3a352f] transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full max-w-2xl flex items-center gap-3 text-xs text-[#3a352f]/60 font-mono">
            <span>0:11</span>
            <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden cursor-pointer group">
              <div className="h-full bg-[#3a352f]/60 w-1/3 group-hover:bg-[#3a352f] transition-colors relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3a352f] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>
        
        <div className="w-1/4 min-w-[200px] flex items-center justify-end gap-5">
          <button 
            onClick={() => setShowPracticePanel(!showPracticePanel)}
            className={`flex flex-col items-center gap-1 transition-all ${showPracticePanel ? 'text-[#3a352f] scale-110' : 'text-[#3a352f]/60 hover:text-[#3a352f]'}`}
            title="Practice Mode"
          >
            <Piano className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tighter font-medium">Practice</span>
          </button>

          <button 
            onClick={() => currentTrack.videoUrl && window.open(currentTrack.videoUrl, '_blank')}
            disabled={!currentTrack.videoUrl}
            className={`flex flex-col items-center gap-1 transition-colors ${currentTrack.videoUrl ? 'text-[#3a352f]/60 hover:text-[#3a352f]' : 'text-[#3a352f]/20 cursor-not-allowed'}`}
            title={currentTrack.videoUrl ? "Watch Video" : "Video not available"}
          >
            <Youtube className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tighter font-medium">Video</span>
          </button>

          <button 
            onClick={() => window.open('https://www.musicnotes.com/sheetmusic/piano', '_blank')}
            className="text-[#3a352f]/60 hover:text-[#3a352f] transition-colors flex flex-col items-center gap-1"
            title="Sheet Music"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tighter font-medium">Sheet</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="text-[#3a352f]/60 hover:text-[#3a352f] transition-colors flex flex-col items-center gap-1 min-w-[40px]"
              title="Playback Speed"
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-medium">{playbackSpeed}x</span>
            </button>
            
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-4 right-0 glass-panel p-2 flex flex-col gap-1 min-w-[80px] animate-in slide-in-from-bottom-2 duration-200">
                {speeds.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setPlaybackSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg text-left transition-colors ${playbackSpeed === s ? 'bg-[#3a352f]/10 text-[#3a352f]' : 'text-[#3a352f]/60 hover:bg-[#3a352f]/5'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#3a352f]/60" />
            <div className="w-20 h-1 bg-black/10 rounded-full overflow-hidden cursor-pointer group">
              <div className="h-full bg-[#3a352f]/60 w-2/3 group-hover:bg-[#3a352f] transition-colors"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MusicTab({ 
  currentTrack, 
  setCurrentTrack, 
  isPlaying, 
  setIsPlaying 
}: { 
  currentTrack: Track, 
  setCurrentTrack: (t: Track) => void,
  isPlaying: boolean,
  setIsPlaying: (v: boolean) => void
}) {
  const [musicView, setMusicView] = useState<'artists' | 'songs' | 'artist_detail'>('artists');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [sortBy, setSortBy] = useState<'recently_played' | 'a_z' | 'duration'>('recently_played');

  const [artistSearchQuery, setArtistSearchQuery] = useState('');
  const [selectedArtistCategories, setSelectedArtistCategories] = useState<string[]>(['All']);
  const [artistSortBy, setArtistSortBy] = useState<'a_z' | 'z_a' | 'most_songs'>('a_z');

  const categories = ['All', 'K-pop', 'C-pop', 'Anime', 'Chill', 'Study', 'Romantic', 'Night', 'Favorites'];
  const artistCategoriesList = ['All', 'Male', 'Female', 'Group', 'Solo', 'US', 'Korea', 'Japan', 'China', 'Global'];

  const artistDetails: Record<string, { region: string, gender: string, type: string }> = {
    'Smooth Piano Trio': { region: 'US', gender: 'Mixed', type: 'Group' },
    'Lofi Beats': { region: 'Global', gender: 'Mixed', type: 'Group' },
    'K-Acoustic': { region: 'Korea', gender: 'Female', type: 'Solo' },
    'Evening Lounge': { region: 'China', gender: 'Female', type: 'Solo' },
    'Piano Cover': { region: 'Japan', gender: 'Male', type: 'Solo' },
    'Synthwave': { region: 'US', gender: 'Male', type: 'Solo' },
    'City Pop': { region: 'Korea', gender: 'Female', type: 'Group' },
    'Ambient Sounds': { region: 'Global', gender: 'Mixed', type: 'Group' },
    'Piano Collection': { region: 'Global', gender: 'Mixed', type: 'Group' },
  };

  const tracks: Track[] = [
    { id: '1', title: 'Sunset Serenade - Piano & Waves', artist: 'Smooth Piano Trio', category: 'Chill', duration: '22:36', cover: 'https://picsum.photos/seed/piano/100/100', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '2', title: 'Tokyo Night Walk', artist: 'Lofi Beats', category: 'Anime', duration: '03:45', cover: 'https://picsum.photos/seed/tokyo/100/100', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '3', title: 'Spring Day Acoustic', artist: 'K-Acoustic', category: 'K-pop', duration: '04:12', cover: 'https://picsum.photos/seed/spring/100/100', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '4', title: 'Shanghai Jazz', artist: 'Evening Lounge', category: 'C-pop', duration: '05:30', cover: 'https://picsum.photos/seed/shanghai/100/100' },
    { id: '5', title: 'Spirited Away Theme', artist: 'Piano Cover', category: 'Anime', duration: '04:55', cover: 'https://picsum.photos/seed/spirit/100/100', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '6', title: 'Midnight Drive', artist: 'Synthwave', category: 'Night', duration: '06:10', cover: 'https://picsum.photos/seed/midnight/100/100' },
    { id: '7', title: 'Seoul Lights', artist: 'City Pop', category: 'K-pop', duration: '03:50', cover: 'https://picsum.photos/seed/seoul/100/100', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '8', title: 'Rainy Cafe', artist: 'Ambient Sounds', category: 'Study', duration: '45:00', cover: 'https://picsum.photos/seed/cafe/100/100' },
    { id: '9', title: 'Ocean Melodies', artist: 'Piano Collection', category: 'Romantic', duration: '12:00', cover: 'https://picsum.photos/seed/ocean/100/100', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '10', title: 'Cozy Evening Jazz', artist: 'Smooth Piano Trio', category: 'Chill', duration: '08:45', cover: 'https://picsum.photos/seed/jazz/100/100' },
  ];

  const artistsMap = new Map<string, { name: string, songCount: number, cover: string }>();
  tracks.forEach(t => {
    if (!artistsMap.has(t.artist)) {
      artistsMap.set(t.artist, { name: t.artist, songCount: 1, cover: t.cover });
    } else {
      artistsMap.get(t.artist)!.songCount++;
    }
  });
  const artists = Array.from(artistsMap.values());

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setSelectedCategories(['All']);
    } else {
      let newCats = selectedCategories.filter(c => c !== 'All');
      if (newCats.includes(cat)) {
        newCats = newCats.filter(c => c !== cat);
        if (newCats.length === 0) newCats = ['All'];
      } else {
        newCats.push(cat);
      }
      setSelectedCategories(newCats);
    }
  };

  const toggleArtistCategory = (cat: string) => {
    if (cat === 'All') {
      setSelectedArtistCategories(['All']);
    } else {
      let newCats = selectedArtistCategories.filter(c => c !== 'All');
      if (newCats.includes(cat)) {
        newCats = newCats.filter(c => c !== cat);
        if (newCats.length === 0) newCats = ['All'];
      } else {
        newCats.push(cat);
      }
      setSelectedArtistCategories(newCats);
    }
  };

  const renderArtists = () => {
    let filteredArtists = artists.filter(a => {
      const info = artistDetails[a.name] || { region: 'Global', gender: 'Mixed', type: 'Group' };
      const matchesSearch = a.name.toLowerCase().includes(artistSearchQuery.toLowerCase());
      
      const matchesCategory = selectedArtistCategories.includes('All') || 
        selectedArtistCategories.includes(info.gender) ||
        selectedArtistCategories.includes(info.type) ||
        selectedArtistCategories.includes(info.region);

      return matchesSearch && matchesCategory;
    });

    if (artistSortBy === 'a_z') {
      filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
    } else if (artistSortBy === 'z_a') {
      filteredArtists.sort((a, b) => b.name.localeCompare(a.name));
    } else if (artistSortBy === 'most_songs') {
      filteredArtists.sort((a, b) => b.songCount - a.songCount);
    }

    return (
      <div className="flex flex-col animate-in fade-in duration-500">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-medium tracking-wide">Artists</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#3a352f]/50" />
                <input 
                  type="text" 
                  placeholder="Search artists..." 
                  value={artistSearchQuery}
                  onChange={(e) => setArtistSearchQuery(e.target.value)}
                  className="glass-panel rounded-full pl-12 pr-6 py-2.5 text-sm w-64 focus:outline-none focus:bg-black/5 transition-colors text-[#3a352f] placeholder-[#3a352f]/50"
                />
              </div>
              <select 
                value={artistSortBy} 
                onChange={(e) => setArtistSortBy(e.target.value as any)}
                className="glass-panel rounded-full px-4 py-2.5 text-sm focus:outline-none focus:bg-black/5 transition-colors text-[#3a352f] appearance-none cursor-pointer"
              >
                <option value="a_z" className="bg-[#ebe1d7]">A–Z</option>
                <option value="z_a" className="bg-[#ebe1d7]">Z–A</option>
                <option value="most_songs" className="bg-[#ebe1d7]">Most Songs</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {artistCategoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => toggleArtistCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                  selectedArtistCategories.includes(cat) 
                    ? 'bg-black/10 border-black/10 text-[#3a352f]' 
                    : 'bg-black/5 border-black/5 text-[#3a352f]/70 hover:bg-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtists.map(artist => (
            <div 
              key={artist.name}
              onClick={() => {
                setSelectedArtist(artist.name);
                setMusicView('artist_detail');
                setSelectedCategories(['All']);
                setSearchQuery('');
              }}
              className="glass-panel p-6 rounded-3xl cursor-pointer hover:bg-black/5 transition-colors flex flex-col items-center text-center gap-4 group"
            >
              <img 
                src={artist.cover} 
                alt={artist.name} 
                className="w-32 h-32 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-medium text-lg text-[#3a352f]">{artist.name}</span>
                <span className="text-sm text-[#3a352f]/60">{artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSongsList = (artistFilter: string | null) => {
    let filteredTracks = tracks.filter(t => {
      if (artistFilter && t.artist !== artistFilter) return false;

      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(t.category);

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'a_z') {
      filteredTracks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration') {
      filteredTracks.sort((a, b) => {
        const timeA = a.duration.split(':').map(Number);
        const timeB = b.duration.split(':').map(Number);
        const secA = timeA[0] * 60 + timeA[1];
        const secB = timeB[0] * 60 + timeB[1];
        return secA - secB;
      });
    }

    return (
      <div className="flex flex-col animate-in fade-in duration-500">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            {artistFilter ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMusicView('artists')}
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors text-[#3a352f]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-medium tracking-wide">{artistFilter}</h2>
              </div>
            ) : (
              <h2 className="text-3xl font-medium tracking-wide">All Songs</h2>
            )}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#3a352f]/50" />
                <input 
                  type="text" 
                  placeholder="Search songs, artists, or tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-panel rounded-full pl-12 pr-6 py-2.5 text-sm w-64 focus:outline-none focus:bg-black/5 transition-colors text-[#3a352f] placeholder-[#3a352f]/50"
                />
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="glass-panel rounded-full px-4 py-2.5 text-sm focus:outline-none focus:bg-black/5 transition-colors text-[#3a352f] appearance-none cursor-pointer"
              >
                <option value="recently_played" className="bg-[#ebe1d7]">Recently Played</option>
                <option value="a_z" className="bg-[#ebe1d7]">A–Z</option>
                <option value="duration" className="bg-[#ebe1d7]">Duration</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                  selectedCategories.includes(cat) 
                    ? 'bg-black/10 border-black/10 text-[#3a352f]' 
                    : 'bg-black/5 border-black/5 text-[#3a352f]/70 hover:bg-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[32px] overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-black/5 text-sm font-medium text-[#3a352f]/60 uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2 text-right">Duration</div>
          </div>
          
          <div className="flex flex-col overflow-y-auto max-h-[50vh] custom-scrollbar">
            {filteredTracks.map((track, index) => {
              const isActive = currentTrack.id === track.id;
              return (
                <div 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(track);
                    setIsPlaying(true);
                  }}
                  className={`grid grid-cols-12 gap-4 px-8 py-4 items-center cursor-pointer transition-colors border-b border-black/5 last:border-0 hover:bg-black/5 ${isActive ? 'bg-black/10' : ''}`}
                >
                  <div className="col-span-1 text-center text-[#3a352f]/50">
                    {isActive && isPlaying ? (
                      <div className="flex items-center justify-center gap-1 h-4">
                        <div className="w-1 h-3 bg-[#3a352f]/40 rounded-sm animate-pulse"></div>
                        <div className="w-1 h-4 bg-[#3a352f]/40 rounded-sm animate-pulse delay-75"></div>
                        <div className="w-1 h-2 bg-[#3a352f]/40 rounded-sm animate-pulse delay-150"></div>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="col-span-6 flex items-center gap-4">
                    <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-md object-cover shadow-sm" referrerPolicy="no-referrer" />
                    <div className="flex flex-col overflow-hidden">
                      <span className={`font-medium truncate ${isActive ? 'text-[#3a352f] underline decoration-amber-600/30 underline-offset-4' : 'text-[#3a352f]'}`}>{track.title}</span>
                      <span className="text-xs text-[#3a352f]/60 truncate">{track.artist}</span>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="px-3 py-1 rounded-full bg-black/5 text-xs text-[#3a352f]/80 border border-black/5">
                      {track.category}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-[#3a352f]/60 text-sm font-mono">
                    {track.duration}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-500">
      {musicView !== 'artist_detail' && (
        <div className="flex justify-center mb-8">
          <div className="glass-panel rounded-full p-1 flex items-center">
            <button
              onClick={() => setMusicView('artists')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${musicView === 'artists' ? 'bg-black/10 text-[#3a352f] shadow-sm' : 'text-[#3a352f]/60 hover:text-[#3a352f]'}`}
            >
              Artists
            </button>
            <button
              onClick={() => setMusicView('songs')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${musicView === 'songs' ? 'bg-black/10 text-[#3a352f] shadow-sm' : 'text-[#3a352f]/60 hover:text-[#3a352f]'}`}
            >
              Songs
            </button>
          </div>
        </div>
      )}

      {musicView === 'artists' && renderArtists()}
      {musicView === 'songs' && renderSongsList(null)}
      {musicView === 'artist_detail' && renderSongsList(selectedArtist)}
    </div>
  );
}

function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/scroller">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/scroller:opacity-100 transition-opacity hover:bg-black/60 -ml-5"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1"
      >
        {children}
      </div>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/scroller:opacity-100 transition-opacity hover:bg-black/60 -mr-5"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

function FocusTab({ 
  currentTrack, 
  isPlaying, 
  setIsPlaying,
  activeSceneId,
  setActiveSceneId
}: { 
  currentTrack: Track, 
  isPlaying: boolean, 
  setIsPlaying: (v: boolean) => void,
  activeSceneId: string,
  setActiveSceneId: (id: string) => void
}) {
  const [sessionMode, setSessionMode] = useState<'timer' | 'pomodoro'>('timer');
  const [activeAmbiences, setActiveAmbiences] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({ rain: 50, fire: 50, waves: 50, nature: 50, night: 50, noise: 50, cafe: 50, library: 50 });
  
  // Timer state
  const [timerPreset, setTimerPreset] = useState<number | null>(null);
  const [customTimer, setCustomTimer] = useState('');
  
  // Pomodoro state
  const [pomoPreset, setPomoPreset] = useState<'25/5' | '50/10' | 'custom'>('25/5');
  const [pomoFocus, setPomoFocus] = useState('25');
  const [pomoBreak, setPomoBreak] = useState('5');
  const [pomoCycles, setPomoCycles] = useState('4');

  // Shared Session state
  const [fadeOut, setFadeOut] = useState('Off');
  const [endBehavior, setEndBehavior] = useState('Stop');

  const isPremium = false; // UI only

  const ambienceGroups = [
    {
      title: 'Nature',
      items: [
        { id: 'rain', name: 'Rain', icon: CloudRain },
        { id: 'waves', name: 'Waves', icon: Waves },
        { id: 'nature', name: 'Nature', icon: TreePine },
      ]
    },
    {
      title: 'Indoor',
      items: [
        { id: 'fire', name: 'Fireplace', icon: Flame },
        { id: 'cafe', name: 'Cafe', icon: Coffee },
        { id: 'library', name: 'Library', icon: BookOpen },
      ]
    },
    {
      title: 'Ambient',
      items: [
        { id: 'night', name: 'Night Ambience', icon: MoonStar },
        { id: 'noise', name: 'White Noise', icon: AudioLines },
      ]
    }
  ];

  const toggleAmbience = (id: string) => {
    if (activeAmbiences.includes(id)) {
      setActiveAmbiences(activeAmbiences.filter(a => a !== id));
    } else {
      if (!isPremium && activeAmbiences.length >= 1) {
        // Free users can only have 1 active. Replace the active one.
        setActiveAmbiences([id]);
      } else if (isPremium && activeAmbiences.length >= 3) {
        // Premium users can have up to 3 active
        setActiveAmbiences([...activeAmbiences.slice(1), id]);
      } else {
        setActiveAmbiences([...activeAmbiences, id]);
      }
    }
  };

  const focusPresets = [
    { id: 'deep', name: 'Deep Work', icon: Brain, ambience: ['noise'], volume: 40 },
    { id: 'read', name: 'Reading', icon: BookOpen, ambience: ['library'], volume: 30 },
    { id: 'relax', name: 'Relaxation', icon: Coffee, ambience: ['rain', 'fire'], volume: 50 },
    { id: 'nature', name: 'Nature Walk', icon: TreePine, ambience: ['nature', 'waves'], volume: 45 },
  ];

  const applyPreset = (preset: typeof focusPresets[0]) => {
    setActiveAmbiences(preset.ambience);
    const newVolumes = { ...volumes };
    preset.ambience.forEach(id => {
      newVolumes[id] = preset.volume;
    });
    setVolumes(newVolumes);
  };

  const ambientItems = ambienceGroups.flatMap(g => g.items);

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="bg-black/20 backdrop-blur-sm p-8 rounded-[40px] flex flex-col gap-10">
        
        {/* 1) THEME STRIP */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium text-white ml-1">Theme</h3>
          <HorizontalScroller>
            {SCENES.map(scene => (
              <div 
                key={scene.id}
                onClick={() => setActiveSceneId(scene.id)}
                className={`relative w-56 h-32 rounded-2xl overflow-hidden shrink-0 cursor-pointer group transition-all ${activeSceneId === scene.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black/40' : 'hover:ring-1 hover:ring-white/50'}`}
              >
                <img src={scene.thumbnail} alt={scene.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex flex-col">
                  <span className="text-white text-sm font-medium">{scene.name}</span>
                  <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full w-fit mt-1 backdrop-blur-md">{scene.tag}</span>
                </div>
              </div>
            ))}
          </HorizontalScroller>
        </div>

        {/* 2) AMBIENT STRIP */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium text-white ml-1">Ambient</h3>
          <HorizontalScroller>
            {ambientItems.map(amb => {
              const Icon = amb.icon;
              const isActive = activeAmbiences.includes(amb.id);
              return (
                <div 
                  key={amb.id}
                  onClick={() => toggleAmbience(amb.id)}
                  className={`relative w-56 h-32 rounded-2xl overflow-hidden shrink-0 cursor-pointer group transition-all ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-black/40' : 'hover:ring-1 hover:ring-white/50'}`}
                >
                  <img 
                    src={`https://picsum.photos/seed/${amb.id}/400/225`} 
                    alt={amb.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-[#3a352f]/20' : 'bg-black/40 group-hover:bg-black/20'}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Icon className={`w-8 h-8 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'text-white/80 group-hover:scale-110'}`} />
                    <span className="text-white text-sm font-medium tracking-wide">{amb.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-3 left-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 animate-in slide-in-from-bottom-2 duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3 h-3 text-white" />
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={volumes[amb.id]} 
                          onChange={(e) => setVolumes({...volumes, [amb.id]: parseInt(e.target.value)})}
                          className="w-full h-1 rounded-full appearance-none bg-white/30 outline-none accent-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </HorizontalScroller>
        </div>

        {/* 3) SESSION STRIP */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium text-white ml-1">Session</h3>
          <div className="bg-[rgba(224,214,202,0.85)] backdrop-blur-md border border-white/20 rounded-2xl p-2 flex items-center gap-6 shadow-sm">
            {/* Mode Toggle */}
            <div className="flex bg-black/5 rounded-xl p-0.5 shrink-0">
              <button 
                onClick={() => setSessionMode('timer')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${sessionMode === 'timer' ? 'bg-white/80 text-[#3a352f] shadow-sm' : 'text-[#3a352f]/40 hover:text-[#3a352f]/80'}`}
              >
                Timer
              </button>
              <button 
                onClick={() => setSessionMode('pomodoro')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${sessionMode === 'pomodoro' ? 'bg-white/80 text-[#3a352f] shadow-sm' : 'text-[#3a352f]/40 hover:text-[#3a352f]/80'}`}
              >
                Pomo
              </button>
            </div>

            <div className="h-6 w-px bg-[#3a352f]/10 shrink-0"></div>

            {sessionMode === 'timer' ? (
              <div className="flex items-center gap-6 flex-1 animate-in fade-in duration-300">
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map(t => (
                    <button 
                      key={t}
                      onClick={() => { setTimerPreset(t); setCustomTimer(''); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${timerPreset === t ? 'bg-[#3a352f]/10 text-[#3a352f] border border-[#3a352f]/10' : 'bg-black/5 text-[#3a352f]/40 hover:bg-black/10'}`}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#3a352f]/40 font-bold uppercase">Custom</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={customTimer}
                    onChange={(e) => {
                      setCustomTimer(e.target.value);
                      setTimerPreset(null);
                    }}
                    className="w-20 bg-black/5 border border-transparent rounded-lg px-3 py-1.5 text-xs text-[#3a352f] placeholder-[#3a352f]/30 focus:outline-none focus:bg-black/10"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6 flex-1 animate-in fade-in duration-300">
                <div className="flex gap-2">
                  {['25/5', '50/10'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setPomoPreset(p as any)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${pomoPreset === p ? 'bg-[#3a352f]/10 text-[#3a352f] border border-[#3a352f]/10' : 'bg-black/5 text-[#3a352f]/40 hover:bg-black/10'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={pomoPreset === 'custom' ? pomoFocus : (pomoPreset === '25/5' ? '25' : '50')}
                    onChange={(e) => { setPomoPreset('custom'); setPomoFocus(e.target.value); }}
                    className="w-12 bg-black/5 rounded-lg px-2 py-1.5 text-xs text-[#3a352f] text-center focus:outline-none"
                  />
                  <span className="text-[10px] text-[#3a352f]/30">/</span>
                  <input 
                    type="number" 
                    value={pomoPreset === 'custom' ? pomoBreak : (pomoPreset === '25/5' ? '5' : '10')}
                    onChange={(e) => { setPomoPreset('custom'); setPomoBreak(e.target.value); }}
                    className="w-12 bg-black/5 rounded-lg px-2 py-1.5 text-xs text-[#3a352f] text-center focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider text-[#3a352f]/40 font-bold">Fadeout</span>
                <select 
                  value={fadeOut}
                  onChange={(e) => setFadeOut(e.target.value)}
                  className="bg-transparent text-xs text-[#3a352f]/60 focus:outline-none cursor-pointer font-medium"
                >
                  <option value="Off">Off</option>
                  <option value="1m">1m</option>
                  <option value="3m">3m</option>
                </select>
              </div>
              <button className="matte-button px-6 py-2 rounded-xl text-xs font-semibold shadow-sm ml-2">
                Start Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-500">
      <h2 className="text-3xl font-medium mb-8 tracking-wide text-[#3a352f]">User Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account */}
        <div className="glass-panel p-6 rounded-[32px] flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-[#3a352f]/80">Account</h3>
            <span className="px-2.5 py-1 rounded-full bg-[#3a352f]/10 text-[10px] font-bold uppercase tracking-wider text-[#3a352f]/60">Free Member</span>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-sm text-[#3a352f]/50">Username</span>
                <span className="text-base">AlexChenMusic</span>
              </div>
              <Edit2 className="w-4 h-4 text-[#3a352f]/30 group-hover:text-[#3a352f]/80 cursor-pointer transition-colors" />
            </div>
            
            <div className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-sm text-[#3a352f]/50">Email</span>
                <span className="text-base">alex.chen@example.com</span>
              </div>
              <span className="text-xs text-amber-700/80 cursor-pointer hover:text-amber-700">change</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-[#3a352f]/50">Member Since</span>
                <span className="text-base">2024</span>
              </div>
            </div>
          </div>
          
          <button className="mt-auto w-full py-3 rounded-xl matte-button text-sm font-medium">
            Change Password
          </button>
        </div>
        
        {/* Studio Membership */}
        <div className="glass-panel p-6 rounded-[32px] flex flex-col gap-6 border-amber-600/10 bg-gradient-to-br from-[rgba(224,214,202,0.75)] to-[rgba(215,191,167,0.4)]">
          <h3 className="text-lg font-medium text-[#3a352f]/80">Studio Membership</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#3a352f]/50">Current Plan</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/5 text-xs font-medium text-[#3a352f]">Free</span>
              </div>
            </div>
            
            <div className="h-px w-full bg-black/5 my-1"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#3a352f]/80">Premium Benefits</span>
              <Lock className="w-3.5 h-3.5 text-[#3a352f]/30" />
            </div>
            
            <ul className="flex flex-col gap-3">
              {[
                'Access All Focus Environments',
                'Multi-Track Ambient Mixer',
                'Extended Session Timer (up to 3 hours)',
                'Early Access to New Piano Releases'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#3a352f]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3a352f]/40"></div>
                  </div>
                  <span className="text-sm text-[#3a352f]/70">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button className="mt-auto w-full py-3 rounded-xl matte-button text-sm font-medium shadow-md border-amber-600/20">
            Upgrade to Premium
          </button>
        </div>
        
        {/* Language & Links */}
        <div className="glass-panel p-6 rounded-[32px] flex flex-col gap-6">
          <h3 className="text-lg font-medium text-[#3a352f]/80">Language & Links</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#3a352f]/50">Language</span>
              <div className="flex bg-black/5 rounded-xl p-1">
                {['English', '中文', '한국어'].map((lang) => (
                  <button 
                    key={lang}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${lang === 'English' ? 'bg-black/10 text-[#3a352f] shadow-sm' : 'text-[#3a352f]/50 hover:text-[#3a352f]/80'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-px w-full bg-black/5 my-1"></div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.open('https://www.youtube.com/@TheVelvetLounge', '_blank')}
                className="w-full py-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all text-sm font-medium text-[#3a352f] flex items-center justify-center gap-2 border border-black/5 shadow-sm"
              >
                <Youtube className="w-4 h-4" />
                YouTube Channel
              </button>
              <button 
                onClick={() => window.open('https://www.mymusicsheet.com', '_blank')}
                className="w-full py-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all text-sm font-medium text-[#3a352f] flex items-center justify-center gap-2 border border-black/5 shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Buy Sheet Music
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#3a352f]/80">Dark Mode</span>
              <div className="w-10 h-5 rounded-full bg-black/5 p-0.5 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-[#3a352f]/60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
