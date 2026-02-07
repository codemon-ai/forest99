import { useAudioStore } from '../../stores/audioStore';
import './VolumeControl.css';

export default function VolumeControl() {
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const sfxVolume = useAudioStore((state) => state.sfxVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);
  const muted = useAudioStore((state) => state.muted);
  
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const setSfxVolume = useAudioStore((state) => state.setSfxVolume);
  const setMusicVolume = useAudioStore((state) => state.setMusicVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);

  return (
    <div className="volume-control">
      <div className="volume-header">
        <h3>음량 설정</h3>
        <button 
          className={`mute-btn ${muted ? 'muted' : ''}`}
          onClick={toggleMute}
          title={muted ? '음소거 해제' : '음소거'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="volume-sliders">
        <div className="slider-group">
          <label htmlFor="master-volume">마스터</label>
          <div className="slider-container">
            <input
              id="master-volume"
              type="range"
              min="0"
              max="100"
              value={Math.round(masterVolume * 100)}
              onChange={(e) => setMasterVolume(parseInt(e.target.value) / 100)}
              className="volume-slider"
              disabled={muted}
            />
            <span className="volume-value">{Math.round(masterVolume * 100)}%</span>
          </div>
        </div>

        <div className="slider-group">
          <label htmlFor="sfx-volume">효과음</label>
          <div className="slider-container">
            <input
              id="sfx-volume"
              type="range"
              min="0"
              max="100"
              value={Math.round(sfxVolume * 100)}
              onChange={(e) => setSfxVolume(parseInt(e.target.value) / 100)}
              className="volume-slider"
              disabled={muted}
            />
            <span className="volume-value">{Math.round(sfxVolume * 100)}%</span>
          </div>
        </div>

        <div className="slider-group">
          <label htmlFor="music-volume">음악</label>
          <div className="slider-container">
            <input
              id="music-volume"
              type="range"
              min="0"
              max="100"
              value={Math.round(musicVolume * 100)}
              onChange={(e) => setMusicVolume(parseInt(e.target.value) / 100)}
              className="volume-slider"
              disabled={muted}
            />
            <span className="volume-value">{Math.round(musicVolume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
