import { useState, useEffect } from 'react';
import './OfflineIndicator.css';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator && !isOffline) return null;

  return (
    <div className={`offline-indicator ${isOffline ? 'offline' : 'online'}`}>
      <span className="offline-icon">{isOffline ? '📡' : '✅'}</span>
      <span className="offline-text">
        {isOffline ? '오프라인 모드 - 게임 진행 가능' : '온라인 연결됨'}
      </span>
    </div>
  );
}
