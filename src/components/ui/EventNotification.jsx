import { useEventStore } from '../../stores/eventStore';
import './EventNotification.css';

export default function EventNotification() {
  const notification = useEventStore((state) => state.notification);
  const currentEvent = useEventStore((state) => state.currentEvent);
  const eventTimeRemaining = useEventStore((state) => state.eventTimeRemaining);
  
  return (
    <>
      {notification && (
        <div className={`event-notification ${notification.type}`}>
          <div className="event-icon">{notification.event.icon}</div>
          <div className="event-content">
            <div className="event-title">
              {notification.type === 'start' ? notification.event.name : `${notification.event.name} 종료`}
            </div>
            <div className="event-desc">
              {notification.type === 'start' 
                ? notification.event.description 
                : '상황이 정상으로 돌아왔습니다.'}
            </div>
          </div>
        </div>
      )}
      
      {currentEvent && !notification && (
        <div className="event-status">
          <div className="event-status-icon">{currentEvent.icon}</div>
          <div className="event-status-info">
            <div className="event-status-name">{currentEvent.name}</div>
            <div className="event-status-time">{Math.ceil(eventTimeRemaining)}s</div>
          </div>
          <div className="event-status-bar">
            <div 
              className="event-status-fill"
              style={{ width: `${(eventTimeRemaining / currentEvent.duration) * 100}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
