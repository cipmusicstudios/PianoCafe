/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Search, Settings, Music, CloudRain, Clock, 
  User, Edit2, Repeat, Shuffle, ChevronLeft,
  Lock, Moon, Flame, Waves, Wind, MoonStar,
  TreePine, AudioLines, Coffee, BookOpen
} from 'lucide-react';

type View = 'home' | 'music' | 'focus' | 'settings';

export type Track = {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  cover: string;
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

  const activeScene = SCENES.find(s => s.id === activeSceneId) || SCENES[0];

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      <BackgroundLayer />
      
      <div className="fixed inset-0 bg-white/5 pointer-events-none z-0"></div>
      
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
      
      <BottomPlayer 
        currentTrack={currentTrack}
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
      />
    </div>
  );
}

function HeroOverlay() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500 min-h-[50vh]">
      {/* Empty container for future animation layer */}
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
      <div className="frosted glass-panel rounded-full px-6 py-3 flex items-center justify-between gap-4 max-w-6xl w-full">
        
        {/* Empty div to balance the flex layout since brand is gone */}
        <div className="w-8 hidden md:block"></div>

        <nav className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto custom-scrollbar flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-5 md:px-6 py-2 rounded-full transition-all duration-300 font-medium whitespace-nowrap flex items-center gap-2 ${
                activeView === tab.id 
                  ? 'frosted glass-panel-active text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon && tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white/10 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-48 focus:outline-none focus:bg-white/20 transition-colors text-white placeholder-white/50"
            />
          </div>
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0">
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
  setIsPlaying 
}: { 
  currentTrack: Track,
  isPlaying: boolean, 
  setIsPlaying: (v: boolean) => void 
}) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="frosted glass-panel rounded-none border-x-0 border-b-0 p-4 flex items-center gap-6 w-full px-6 md:px-12">
        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
          <img 
            src={currentTrack.cover} 
            alt="Album Art" 
            className="w-14 h-14 rounded-lg object-cover shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium text-white truncate">{currentTrack.title}</span>
            <span className="text-sm text-white/60 truncate">{currentTrack.artist}</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-white/60 hover:text-white transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-white"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full max-w-2xl flex items-center gap-3 text-xs text-white/60 font-mono">
            <span>0:11</span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
              <div className="h-full bg-white/80 w-1/3 group-hover:bg-white transition-colors relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>
        
        <div className="w-1/4 min-w-[150px] flex items-center justify-end gap-3">
          <Volume2 className="w-5 h-5 text-white/80" />
          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
            <div className="h-full bg-white/80 w-2/3 group-hover:bg-white transition-colors"></div>
          </div>
          <div className="frosted glass-panel px-2 py-1 rounded-md text-xs font-medium ml-2">
            1.0x
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
    { id: '1', title: 'Sunset Serenade - Piano & Waves', artist: 'Smooth Piano Trio', category: 'Chill', duration: '22:36', cover: 'https://picsum.photos/seed/piano/100/100' },
    { id: '2', title: 'Tokyo Night Walk', artist: 'Lofi Beats', category: 'Anime', duration: '03:45', cover: 'https://picsum.photos/seed/tokyo/100/100' },
    { id: '3', title: 'Spring Day Acoustic', artist: 'K-Acoustic', category: 'K-pop', duration: '04:12', cover: 'https://picsum.photos/seed/spring/100/100' },
    { id: '4', title: 'Shanghai Jazz', artist: 'Evening Lounge', category: 'C-pop', duration: '05:30', cover: 'https://picsum.photos/seed/shanghai/100/100' },
    { id: '5', title: 'Spirited Away Theme', artist: 'Piano Cover', category: 'Anime', duration: '04:55', cover: 'https://picsum.photos/seed/spirit/100/100' },
    { id: '6', title: 'Midnight Drive', artist: 'Synthwave', category: 'Night', duration: '06:10', cover: 'https://picsum.photos/seed/midnight/100/100' },
    { id: '7', title: 'Seoul Lights', artist: 'City Pop', category: 'K-pop', duration: '03:50', cover: 'https://picsum.photos/seed/seoul/100/100' },
    { id: '8', title: 'Rainy Cafe', artist: 'Ambient Sounds', category: 'Study', duration: '45:00', cover: 'https://picsum.photos/seed/cafe/100/100' },
    { id: '9', title: 'Ocean Melodies', artist: 'Piano Collection', category: 'Romantic', duration: '12:00', cover: 'https://picsum.photos/seed/ocean/100/100' },
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
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Search artists..." 
                  value={artistSearchQuery}
                  onChange={(e) => setArtistSearchQuery(e.target.value)}
                  className="frosted glass-panel rounded-full pl-12 pr-6 py-2.5 text-sm w-64 focus:outline-none focus:bg-white/20 transition-colors text-white placeholder-white/50"
                />
              </div>
              <select 
                value={artistSortBy} 
                onChange={(e) => setArtistSortBy(e.target.value as any)}
                className="frosted glass-panel rounded-full px-4 py-2.5 text-sm focus:outline-none focus:bg-white/20 transition-colors text-white appearance-none cursor-pointer"
              >
                <option value="a_z" className="bg-neutral-800">A–Z</option>
                <option value="z_a" className="bg-neutral-800">Z–A</option>
                <option value="most_songs" className="bg-neutral-800">Most Songs</option>
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
                    ? 'bg-white/20 border-white/30 text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
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
              className="frosted glass-panel p-6 rounded-3xl cursor-pointer hover:bg-white/10 transition-colors flex flex-col items-center text-center gap-4 group"
            >
              <img 
                src={artist.cover} 
                alt={artist.name} 
                className="w-32 h-32 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-medium text-lg text-white">{artist.name}</span>
                <span className="text-sm text-white/60">{artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}</span>
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
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
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
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Search songs, artists, or tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="frosted glass-panel rounded-full pl-12 pr-6 py-2.5 text-sm w-64 focus:outline-none focus:bg-white/20 transition-colors text-white placeholder-white/50"
                />
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="frosted glass-panel rounded-full px-4 py-2.5 text-sm focus:outline-none focus:bg-white/20 transition-colors text-white appearance-none cursor-pointer"
              >
                <option value="recently_played" className="bg-neutral-800">Recently Played</option>
                <option value="a_z" className="bg-neutral-800">A–Z</option>
                <option value="duration" className="bg-neutral-800">Duration</option>
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
                    ? 'bg-white/20 border-white/30 text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="frosted glass-panel rounded-[32px] overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/10 text-sm font-medium text-white/60 uppercase tracking-wider">
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
                  className={`grid grid-cols-12 gap-4 px-8 py-4 items-center cursor-pointer transition-colors border-b border-white/5 last:border-0 hover:bg-white/10 ${isActive ? 'bg-white/15' : ''}`}
                >
                  <div className="col-span-1 text-center text-white/50">
                    {isActive && isPlaying ? (
                      <div className="flex items-center justify-center gap-1 h-4">
                        <div className="w-1 h-3 bg-amber-200 rounded-sm animate-pulse"></div>
                        <div className="w-1 h-4 bg-amber-200 rounded-sm animate-pulse delay-75"></div>
                        <div className="w-1 h-2 bg-amber-200 rounded-sm animate-pulse delay-150"></div>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="col-span-6 flex items-center gap-4">
                    <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-md object-cover shadow-sm" referrerPolicy="no-referrer" />
                    <div className="flex flex-col overflow-hidden">
                      <span className={`font-medium truncate ${isActive ? 'text-amber-200' : 'text-white'}`}>{track.title}</span>
                      <span className="text-xs text-white/60 truncate">{track.artist}</span>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 border border-white/10">
                      {track.category}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-white/60 text-sm font-mono">
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
          <div className="frosted glass-panel rounded-full p-1 flex items-center">
            <button
              onClick={() => setMusicView('artists')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${musicView === 'artists' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
            >
              Artists
            </button>
            <button
              onClick={() => setMusicView('songs')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${musicView === 'songs' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
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

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-500 gap-12 pb-12">
      
      {/* 1) SCENE SECTION */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-medium text-white/90">Scene</h3>
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {SCENES.map(scene => (
            <div 
              key={scene.id}
              onClick={() => setActiveSceneId(scene.id)}
              className={`relative w-64 h-36 rounded-2xl overflow-hidden shrink-0 cursor-pointer group transition-all ${activeSceneId === scene.id ? 'ring-2 ring-amber-200 ring-offset-2 ring-offset-black/50' : 'opacity-70 hover:opacity-100'}`}
            >
              <img src={scene.thumbnail} alt={scene.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex flex-col">
                <span className="text-white font-medium">{scene.name}</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full w-fit mt-1 backdrop-blur-md">{scene.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2) AMBIENCE MIXER SECTION */}
        <div className="frosted glass-panel p-6 rounded-3xl flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-white/90">Ambience Mixer</h3>
            <span className="text-xs text-amber-200/80 bg-amber-200/10 px-3 py-1 rounded-full font-medium">Free: 1 Active</span>
          </div>
          
          <div className="flex flex-col gap-8">
            {ambienceGroups.map(group => (
              <div key={group.title} className="flex flex-col gap-4">
                <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{group.title}</span>
                <div className="flex flex-col gap-2">
                  {group.items.map(amb => {
                    const Icon = amb.icon;
                    const isActive = activeAmbiences.includes(amb.id);
                    return (
                      <div key={amb.id} className={`flex flex-col gap-3 p-3 rounded-2xl transition-colors ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-amber-200' : 'text-white/40'}`} />
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>{amb.name}</span>
                          </div>
                          <button 
                            onClick={() => toggleAmbience(amb.id)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-amber-200/50' : 'bg-white/20'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                        {isActive && (
                          <div className="flex items-center gap-3 pl-8 pr-2 animate-in slide-in-from-top-2 fade-in duration-200">
                            <Volume2 className="w-4 h-4 text-white/60" />
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={volumes[amb.id]} 
                              onChange={(e) => setVolumes({...volumes, [amb.id]: parseInt(e.target.value)})}
                              className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none accent-amber-200"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3) SESSION SECTION */}
        <div className="flex flex-col gap-8">
          <div className="frosted glass-panel p-6 rounded-3xl flex flex-col gap-6">
            <h3 className="text-xl font-medium text-white/90">Session Timer</h3>
            
            <div className="flex bg-white/5 rounded-xl p-1">
              <button 
                onClick={() => setSessionMode('timer')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${sessionMode === 'timer' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
              >
                Timer
              </button>
              <button 
                onClick={() => setSessionMode('pomodoro')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${sessionMode === 'pomodoro' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
              >
                Pomodoro
              </button>
            </div>

            {sessionMode === 'timer' ? (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map(t => (
                    <button 
                      key={t}
                      onClick={() => { setTimerPreset(t); setCustomTimer(''); }}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${timerPreset === t ? 'bg-amber-200/20 text-amber-100 border border-amber-200/30' : 'bg-white/5 text-white/60 border border-transparent hover:bg-white/10'}`}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60 w-20">Custom:</span>
                  <input 
                    type="number" 
                    placeholder="Minutes" 
                    value={customTimer}
                    onChange={(e) => {
                      setCustomTimer(e.target.value);
                      setTimerPreset(null);
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setPomoPreset('25/5')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${pomoPreset === '25/5' ? 'bg-amber-200/20 text-amber-100 border border-amber-200/30' : 'bg-white/5 text-white/60 border border-transparent hover:bg-white/10'}`}
                  >
                    25 / 5
                  </button>
                  <button 
                    onClick={() => setPomoPreset('50/10')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${pomoPreset === '50/10' ? 'bg-amber-200/20 text-amber-100 border border-amber-200/30' : 'bg-white/5 text-white/60 border border-transparent hover:bg-white/10'}`}
                  >
                    50 / 10
                  </button>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60 w-20">Focus:</span>
                    <input 
                      type="number" 
                      value={pomoPreset === 'custom' ? pomoFocus : (pomoPreset === '25/5' ? '25' : '50')}
                      onChange={(e) => { setPomoPreset('custom'); setPomoFocus(e.target.value); }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:bg-white/10"
                    />
                    <span className="text-sm text-white/40">min</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60 w-20">Break:</span>
                    <input 
                      type="number" 
                      value={pomoPreset === 'custom' ? pomoBreak : (pomoPreset === '25/5' ? '5' : '10')}
                      onChange={(e) => { setPomoPreset('custom'); setPomoBreak(e.target.value); }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:bg-white/10"
                    />
                    <span className="text-sm text-white/40">min</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60 w-20">Cycles:</span>
                    <input 
                      type="number" 
                      value={pomoCycles}
                      onChange={(e) => setPomoCycles(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:bg-white/10"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="h-px w-full bg-white/10 my-2"></div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Fadeout</span>
                <select 
                  value={fadeOut}
                  onChange={(e) => setFadeOut(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:bg-white/10 appearance-none cursor-pointer"
                >
                  <option value="Off" className="bg-neutral-800">Off</option>
                  <option value="10s" className="bg-neutral-800">10s</option>
                  <option value="30s" className="bg-neutral-800">30s</option>
                  <option value="60s" className="bg-neutral-800">60s</option>
                  <option value="3m" className="bg-neutral-800">3 min</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">End Behavior</span>
                <select 
                  value={endBehavior}
                  onChange={(e) => setEndBehavior(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:bg-white/10 appearance-none cursor-pointer"
                >
                  <option value="Stop" className="bg-neutral-800">Stop</option>
                  <option value="Next Track" className="bg-neutral-800">Next Track</option>
                  <option value="Loop Current" className="bg-neutral-800">Loop Current</option>
                </select>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-amber-200/20 hover:bg-amber-200/30 transition-colors text-amber-100 font-medium mt-2">
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-500">
      <h2 className="text-3xl font-medium mb-8 tracking-wide">User Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account */}
        <div className="frosted glass-panel p-6 rounded-[32px] flex flex-col gap-6">
          <h3 className="text-lg font-medium text-white/80">Account</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-sm text-white/50">Username</span>
                <span className="text-base">AlexChenMusic</span>
              </div>
              <Edit2 className="w-4 h-4 text-white/30 group-hover:text-white/80 cursor-pointer transition-colors" />
            </div>
            
            <div className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-sm text-white/50">Email</span>
                <span className="text-base">alex.chen@example.com</span>
              </div>
              <span className="text-xs text-amber-200/80 cursor-pointer hover:text-amber-200">change</span>
            </div>
          </div>
          
          <button className="mt-auto w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
            Change Password
          </button>
        </div>
        
        {/* Subscription */}
        <div className="frosted glass-panel p-6 rounded-[32px] flex flex-col gap-6">
          <h3 className="text-lg font-medium text-white/80">Subscription</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Current Plan</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white">Free</span>
            </div>
            
            <div className="h-px w-full bg-white/10 my-1"></div>
            
            <span className="text-sm font-medium text-white/80">Premium Benefits</span>
            
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-200/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
                </div>
                <span className="text-sm text-white/70">Lossless (FLAC) audio quality</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-200/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
                </div>
                <span className="text-sm text-white/70">Ad-free listening experience</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-200/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
                </div>
                <span className="text-sm text-white/70">Advanced practice tools</span>
              </li>
            </ul>
          </div>
          
          <button className="mt-auto w-full py-3 rounded-xl bg-amber-200/20 hover:bg-amber-200/30 text-amber-100 transition-colors text-sm font-medium">
            Upgrade to Premium
          </button>
        </div>
        
        {/* Theme Preferences */}
        <div className="frosted glass-panel p-6 rounded-[32px] flex flex-col gap-6">
          <h3 className="text-lg font-medium text-white/80">Theme Preferences</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <img src="https://picsum.photos/seed/cabin/150/100" alt="Theme" className="rounded-lg object-cover h-16 w-full border-2 border-amber-200/50" referrerPolicy="no-referrer" />
              <span className="text-xs text-center text-white/80">Cozy Cabin</span>
            </div>
            <div className="flex flex-col gap-2">
              <img src="https://picsum.photos/seed/forest/150/100" alt="Theme" className="rounded-lg object-cover h-16 w-full border-2 border-transparent opacity-60 hover:opacity-100 transition-opacity cursor-pointer" referrerPolicy="no-referrer" />
              <span className="text-xs text-center text-white/60">Forest Rain</span>
            </div>
            <div className="flex flex-col gap-2">
              <img src="https://picsum.photos/seed/ocean/150/100" alt="Theme" className="rounded-lg object-cover h-16 w-full border-2 border-transparent opacity-60 hover:opacity-100 transition-opacity cursor-pointer" referrerPolicy="no-referrer" />
              <span className="text-xs text-center text-white/60">Ocean Waves</span>
            </div>
            <div className="flex flex-col gap-2">
              <img src="https://picsum.photos/seed/stars/150/100" alt="Theme" className="rounded-lg object-cover h-16 w-full border-2 border-transparent opacity-60 hover:opacity-100 transition-opacity cursor-pointer" referrerPolicy="no-referrer" />
              <span className="text-xs text-center text-white/60">Starry Night</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-white/80">Dark Mode</span>
            <div className="w-10 h-5 rounded-full bg-white/10 p-0.5 cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white/60"></div>
            </div>
          </div>
          
          <div className="mt-2">
            <span className="text-sm text-white/80 block mb-3">Accent Color</span>
            <div className="flex gap-2">
              {['bg-amber-600', 'bg-orange-500', 'bg-amber-400', 'bg-rose-400', 'bg-pink-300', 'bg-purple-300'].map((color, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${color} cursor-pointer ${i === 2 ? 'ring-2 ring-white ring-offset-2 ring-offset-black/20' : ''}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
