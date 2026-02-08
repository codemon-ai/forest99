import { useRef, useState } from 'react';
import { useTouchStore } from '../../stores/touchStore';
import { useTutorialStore } from '../../stores/tutorialStore';
import './VirtualJoystick.css';

export default function VirtualJoystick() {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseRef = useRef(null);
  
  const setJoystickInput = useTouchStore((state) => state.setJoystickInput);
  const resetJoystick = useTouchStore((state) => state.resetJoystick);
  
  const highlightTarget = useTutorialStore((state) => {
    const step = state.getCurrentStep?.();
    return step?.highlight?.mobile;
  });
  
  const handleTouchStart = (e) => {
    e.preventDefault();
    setActive(true);
  };
  
  const handleTouchMove = (e) => {
    if (!active || !baseRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const maxDistance = rect.width / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }
    
    setPosition({ x: dx, y: dy });
    setJoystickInput(dx / maxDistance, dy / maxDistance);
  };
  
  const handleTouchEnd = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    resetJoystick();
  };
  
  return (
    <div 
      ref={baseRef}
      className={`joystick-base ${highlightTarget === 'joystick' ? 'tutorial-highlight' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="joystick-knob"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: active ? 1 : 0.6
        }}
      />
    </div>
  );
}
