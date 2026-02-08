import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore, GAME_STATE } from '../../stores/gameStore';
import { useTutorialStore } from '../../stores/tutorialStore';
import { SaveSystem } from '../../systems/SaveSystem';
import { changeLanguage, getCurrentLanguage, LANGUAGES } from '../../i18n';
import AchievementGallery from './AchievementGallery';
import './MainMenu.css';

export default function MainMenu() {
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const gameState = useGameStore((state) => state.gameState);
  const startGame = useGameStore((state) => state.startGame);
  const isNewPlayer = useTutorialStore((state) => state.isNewPlayer);
  const startTutorial = useTutorialStore((state) => state.startTutorial);
  const resetTutorial = useTutorialStore((state) => state.resetTutorial);
  
  useEffect(() => {
    setHasSave(SaveSystem.hasSaveData());
  }, []);
  
  if (gameState !== GAME_STATE.MENU) return null;
  
  const handleContinue = () => {
    if (SaveSystem.loadGame()) {
      startGame();
    }
  };
  
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setCurrentLang(lang);
    setShowLanguage(false);
  };
   
   return (
     <div className="main-menu">
       <div className="menu-background" />
       
       <div className="menu-content">
         <div className="game-title">
           <div className="title-icon">🌲</div>
           <h1>{t('game.title').split(' ').slice(0, -2).join(' ')}</h1>
           <h2>{t('game.title').split(' ').slice(-2).join(' ')}</h2>
         </div>
         
         <div className="menu-buttons">
           {hasSave && (
             <button className="menu-btn primary" onClick={handleContinue}>
               <span className="btn-icon">▶</span>
               {t('menu.continue')}
             </button>
           )}
            <button className="menu-btn primary" onClick={() => {
              startGame();
              if (isNewPlayer()) {
                startTutorial();
              }
            }}>
              <span className="btn-icon">▶</span>
              {t('menu.start')}
            </button>
             <button className="menu-btn" onClick={() => {
               resetTutorial();
               startGame();
               startTutorial();
             }}>
               <span className="btn-icon">📖</span>
               {t('menu.tutorial')}
             </button>
             <button className="menu-btn" onClick={() => setShowAchievements(true)}>
               <span className="btn-icon">🏆</span>
               {t('menu.achievements')}
             </button>
             <button className="menu-btn" onClick={() => setShowLanguage(true)}>
               <span className="btn-icon">🌐</span>
               {t('menu.language')}
             </button>
             <button className="menu-btn" onClick={() => setShowHelp(true)}>
               <span className="btn-icon">?</span>
               {t('menu.settings')}
             </button>
         </div>
        
        <div className="menu-footer">
          <p>{currentLang === 'ko' ? '99일 동안 생존하고 숲의 수호자를 물리쳐라!' : 'Survive 99 days and defeat the Forest Guardian!'}</p>
        </div>
      </div>
      
      {showLanguage && (
        <div className="help-overlay">
          <div className="help-modal language-modal">
            <h2>{t('menu.language')}</h2>
            <div className="language-list">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-btn ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name}</span>
                  {currentLang === lang.code && <span className="lang-check">✓</span>}
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowLanguage(false)}>
              {currentLang === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}
      
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">
            <h2>{currentLang === 'ko' ? '조작법' : 'Controls'}</h2>
            <div className="help-content">
              <div className="help-section">
                <h3>{currentLang === 'ko' ? '이동' : 'Movement'}</h3>
                <div className="key-list">
                  <div className="key-item"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> {currentLang === 'ko' ? '이동' : 'Move'}</div>
                  <div className="key-item"><kbd>Shift</kbd> {currentLang === 'ko' ? '달리기' : 'Run'}</div>
                  <div className="key-item"><kbd>Space</kbd> {currentLang === 'ko' ? '점프' : 'Jump'}</div>
                  <div className="key-item"><kbd>{currentLang === 'ko' ? '마우스' : 'Mouse'}</kbd> {currentLang === 'ko' ? '시점 회전' : 'Look around'}</div>
                </div>
              </div>
              <div className="help-section">
                <h3>{currentLang === 'ko' ? '전투 & 상호작용' : 'Combat & Interaction'}</h3>
                <div className="key-list">
                  <div className="key-item"><kbd>{currentLang === 'ko' ? '클릭' : 'Click'}</kbd> {currentLang === 'ko' ? '공격' : 'Attack'}</div>
                  <div className="key-item"><kbd>E</kbd> {currentLang === 'ko' ? '자원 수집' : 'Gather'}</div>
                  <div className="key-item"><kbd>I</kbd> {currentLang === 'ko' ? '인벤토리' : 'Inventory'}</div>
                  <div className="key-item"><kbd>C</kbd> {currentLang === 'ko' ? '크래프팅' : 'Crafting'}</div>
                </div>
              </div>
              <div className="help-section">
                <h3>{currentLang === 'ko' ? '생존 팁' : 'Survival Tips'}</h3>
                <ul>
                  <li>{currentLang === 'ko' ? '베이스캠프 근처에서 정신력 회복' : 'Sanity recovers near base camp'}</li>
                  <li>{currentLang === 'ko' ? '밤에는 강력한 몬스터 출현' : 'Stronger monsters at night'}</li>
                  <li>{currentLang === 'ko' ? '자원을 모아 무기를 제작하세요' : 'Gather resources to craft weapons'}</li>
                  <li>{currentLang === 'ko' ? '99일차에 보스가 등장합니다!' : 'Boss appears on day 99!'}</li>
                </ul>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowHelp(false)}>
              {currentLang === 'ko' ? '닫기' : 'Close'}
            </button>
           </div>
         </div>
       )}
       
       <AchievementGallery 
         isOpen={showAchievements} 
         onClose={() => setShowAchievements(false)} 
       />
     </div>
   );
}
