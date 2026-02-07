import { useEffect, useRef } from 'react';
import { useTouchStore } from '../stores/touchStore';

export function useControls() {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
    interact: false,
  });

  const joystickInput = useTouchStore((state) => state.joystickInput);
  const touchButtons = useTouchStore((state) => state.touchButtons);
  const JOYSTICK_THRESHOLD = 0.3;

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'Space':
          keys.current.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.run = true;
          break;
        case 'KeyE':
          keys.current.interact = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'Space':
          keys.current.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.run = false;
          break;
        case 'KeyE':
          keys.current.interact = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    current: {
      forward: keys.current.forward || joystickInput.y < -JOYSTICK_THRESHOLD,
      backward: keys.current.backward || joystickInput.y > JOYSTICK_THRESHOLD,
      left: keys.current.left || joystickInput.x < -JOYSTICK_THRESHOLD,
      right: keys.current.right || joystickInput.x > JOYSTICK_THRESHOLD,
      jump: keys.current.jump || touchButtons.jump,
      run: keys.current.run,
      interact: keys.current.interact || touchButtons.interact,
    },
    touchButtons,
  };
}
