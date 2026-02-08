import { useEffect } from 'react';
import { useAchievementStore } from '../../stores/achievementStore';
import './AchievementNotification.css';

export default function AchievementNotification() {
  const pendingNotifications = useAchievementStore((state) => state.pendingNotifications);
  const dismissNotification = useAchievementStore((state) => state.dismissNotification);
  
  const currentNotification = pendingNotifications[0];
  
  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentNotification, dismissNotification]);
  
  if (!currentNotification) return null;
  
  return (
    <div className="achievement-notification">
      <div className="achievement-icon">{currentNotification.icon}</div>
      <div className="achievement-content">
        <div className="achievement-label">업적 해금!</div>
        <div className="achievement-name">{currentNotification.name}</div>
      </div>
    </div>
  );
}
