import { useTutorialStore } from '../../stores/tutorialStore';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { TUTORIAL_STEPS } from '../../data/tutorial';
import './TutorialOverlay.css';

export default function TutorialOverlay() {
  const isActive = useTutorialStore((state) => state.isActive);
  const getCurrentStep = useTutorialStore((state) => state.getCurrentStep);
  const currentStepIndex = useTutorialStore((state) => state.currentStepIndex);
  const nextStep = useTutorialStore((state) => state.nextStep);
  const skipTutorial = useTutorialStore((state) => state.skipTutorial);
  const { isTouchDevice } = useDeviceDetect();
  
  if (!isActive) return null;
  
  const step = getCurrentStep();
  if (!step) return null;
  
  const description = typeof step.description === 'object'
    ? (isTouchDevice ? step.description.mobile : step.description.desktop)
    : step.description;
  
  const showNextButton = step.requireConfirm || !step.completeCondition;
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h3 className="tutorial-title">{step.title}</h3>
        <p className="tutorial-description">{description}</p>
        <div className="tutorial-buttons">
          {showNextButton && (
            <button className="tutorial-btn tutorial-next" onClick={nextStep}>
              {step.id === 'complete' ? '시작하기' : '다음'}
            </button>
          )}
          {step.id !== 'complete' && (
            <button className="tutorial-btn tutorial-skip" onClick={skipTutorial}>
              건너뛰기
            </button>
          )}
        </div>
        <div className="tutorial-progress">
          {TUTORIAL_STEPS.map((s, i) => (
            <div 
              key={s.id}
              className={`progress-dot ${i <= currentStepIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
