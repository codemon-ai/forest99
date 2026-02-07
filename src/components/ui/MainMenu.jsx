import { useState, useEffect } from 'react';
import { useGameStore, GAME_STATE } from '../../stores/gameStore';
import { SaveSystem } from '../../systems/SaveSystem';
import './MainMenu.css';

export default function MainMenu() {
  const [showHelp, setShowHelp] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const gameState = useGameStore((state) => state.gameState);
  const startGame = useGameStore((state) => state.startGame);
  
  useEffect(() => {
    setHasSave(SaveSystem.hasSaveData());
  }, []);
  
  if (gameState !== GAME_STATE.MENU) return null;
  
  const handleContinue = () => {
    if (SaveSystem.loadGame()) {
      startGame();
    }
  };
   
   return (
     <div className="main-menu">
       <div className="menu-background" />
       
       <div className="menu-content">
         <div className="game-title">
           <div className="title-icon">🌲</div>
           <h1>숲에서 보낸</h1>
           <h2>99일 밤</h2>
         </div>
         
         <div className="menu-buttons">
           {hasSave && (
             <button className="menu-btn primary" onClick={handleContinue}>
               <span className="btn-icon">▶</span>
               이어하기
             </button>
           )}
           <button className="menu-btn primary" onClick={startGame}>
             <span className="btn-icon">▶</span>
             게임 시작
           </button>
           <button className="menu-btn" onClick={() => setShowHelp(true)}>
             <span className="btn-icon">?</span>
             도움말
           </button>
         </div>
        
        <div className="menu-footer">
          <p>99일 동안 생존하고 숲의 수호자를 물리쳐라!</p>
        </div>
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
                </div>
              </div>
              <div className="help-section">
                <h3>생존 팁</h3>
                <ul>
                  <li>베이스캠프 근처에서 정신력 회복</li>
                  <li>밤에는 강력한 몬스터 출현</li>
                  <li>자원을 모아 무기를 제작하세요</li>
                  <li>99일차에 보스가 등장합니다!</li>
                </ul>
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
