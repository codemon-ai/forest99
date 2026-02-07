import { useEffect } from 'react';
import { useGameStore, GAME_STATE } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import './GameOverlay.css';

export default function GameOverlay() {
  const gameState = useGameStore((state) => state.gameState);
  const day = useGameStore((state) => state.day);
  const reset = useGameStore((state) => state.reset);
  const setGameOver = useGameStore((state) => state.setGameOver);
  
  const health = usePlayerStore((state) => state.health);
  
  useEffect(() => {
    if (health <= 0 && gameState !== GAME_STATE.GAME_OVER && gameState !== GAME_STATE.VICTORY) {
      setGameOver();
    }
  }, [health, gameState, setGameOver]);
  
  const handleRestart = () => {
    window.location.reload();
  };
  
  if (gameState === GAME_STATE.VICTORY) {
    return (
      <div className="game-overlay victory">
        <div className="overlay-content">
          <div className="victory-icon">🏆</div>
          <h1>생존 성공!</h1>
          <p className="subtitle">숲의 수호자를 물리쳤습니다</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">생존 일수</span>
              <span className="stat-value">{day}일</span>
            </div>
          </div>
          <p className="victory-message">
            당신은 99일 밤의 시련을 견디고<br/>
            숲의 진정한 주인이 되었습니다.
          </p>
          <button className="restart-btn" onClick={handleRestart}>
            다시 시작
          </button>
        </div>
      </div>
    );
  }
  
  if (gameState === GAME_STATE.GAME_OVER) {
    return (
      <div className="game-overlay game-over">
        <div className="overlay-content">
          <div className="gameover-icon">💀</div>
          <h1>게임 오버</h1>
          <p className="subtitle">숲에서 생존하지 못했습니다</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">생존 일수</span>
              <span className="stat-value">{day}일</span>
            </div>
          </div>
          <button className="restart-btn" onClick={handleRestart}>
            다시 시작
          </button>
        </div>
      </div>
    );
  }
  
  return null;
}
