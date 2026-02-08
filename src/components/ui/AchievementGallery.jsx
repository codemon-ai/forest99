import { useAchievementStore } from '../../stores/achievementStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import './AchievementGallery.css';

export default function AchievementGallery({ isOpen, onClose }) {
  const unlocked = useAchievementStore((state) => state.unlocked);
  const getUnlockedCount = useAchievementStore((state) => state.getUnlockedCount);
  const getTotalCount = useAchievementStore((state) => state.getTotalCount);
  
  if (!isOpen) return null;
  
  return (
    <div className="achievement-gallery-overlay" onClick={onClose}>
      <div className="achievement-gallery-modal" onClick={(e) => e.stopPropagation()}>
        <div className="achievement-gallery-header">
          <h2>업적</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="achievement-progress">
          {getUnlockedCount()} / {getTotalCount()} 해금
        </div>
        
        <div className="achievement-gallery">
          {Object.values(ACHIEVEMENTS).map((achievement) => {
            const isUnlocked = unlocked.includes(achievement.id);
            
            return (
              <div 
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-card-icon">{achievement.icon}</div>
                <div className="achievement-card-name">{achievement.name}</div>
                <div className="achievement-card-desc">
                  {isUnlocked ? achievement.description : '???'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
