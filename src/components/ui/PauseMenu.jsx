import { useEffect, useState } from 'react';
import { useGameStore, GAME_STATE } from '../../stores/gameStore';
import { SaveSystem } from '../../systems/SaveSystem';
import VolumeControl from './VolumeControl';
import './PauseMenu.css';

export default function PauseMenu() {
  const [showHelp, setShowHelp] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const gameState = useGameStore((state) => state.gameState);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const reset = useGameStore((state) => state.reset);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.BOSS_FIGHT) {
          pauseGame();
        } else if (gameState === GAME_STATE.PAUSED) {
          resumeGame();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pauseGame, resumeGame]);
  
  if (gameState !== GAME_STATE.PAUSED) return null;
  
  const handleQuit = () => {
    reset();
  };
  
  const handleSave = () => {
    const success = SaveSystem.saveGame();
    setSaveMessage(success ? '저장 완료!' : '저장 실패');
    setTimeout(() => setSaveMessage(''), 2000);
  };
  
  return (
    <div className="pause-menu">
      <div className="pause-overlay" onClick={resumeGame} />
      
      <div className="pause-content">
        <div className="pause-header">
          <h1>일시정지</h1>
          <button className="pause-close-btn" onClick={resumeGame} title="닫기">✕</button>
        </div>
        
          <div className="pause-buttons">
            <button className="pause-btn primary" onClick={resumeGame}>
              <span className="btn-icon">▶</span>
              계속하기
            </button>
            <button className="pause-btn" onClick={handleSave}>
              <span className="btn-icon">💾</span>
              저장하기
            </button>
            <button className="pause-btn" onClick={() => setShowHelp(true)}>
              <span className="btn-icon">?</span>
              도움말
            </button>
            <button className="pause-btn danger" onClick={handleQuit}>
              <span className="btn-icon">✕</span>
              메인 메뉴
            </button>
          </div>
          {saveMessage && <p className="save-message">{saveMessage}</p>}
         
         <VolumeControl />
         
         <p className="pause-hint">ESC를 눌러 계속하기</p>
      </div>
      
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">
            <h2>조작법</h2>
            <div className="help-content">
              <div className="help-section">
                <h3>이동</h3>
                <div className="key-list">
                  <div className="key-item"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 이동</div>
                  <div className="key-item"><kbd>Shift</kbd> 달리기</div>
                  <div className="key-item"><kbd>Space</kbd> 점프</div>
                  <div className="key-item"><kbd>마우스</kbd> 시점 회전</div>
                </div>
              </div>
              <div className="help-section">
                <h3>전투 & 상호작용</h3>
                <div className="key-list">
                  <div className="key-item"><kbd>클릭</kbd> 공격</div>
                  <div className="key-item"><kbd>E</kbd> 자원 수집</div>
                  <div className="key-item"><kbd>I</kbd> 인벤토리</div>
                  <div className="key-item"><kbd>C</kbd> 크래프팅</div>
                  <div className="key-item"><kbd>ESC</kbd> 일시정지</div>
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowHelp(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
