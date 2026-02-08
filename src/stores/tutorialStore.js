import { create } from 'zustand';
import { TUTORIAL_STEPS } from '../data/tutorial';

export const useTutorialStore = create((set, get) => ({
  isActive: false,
  currentStepIndex: 0,
  completedConditions: [],

  getCurrentStep: () => TUTORIAL_STEPS[get().currentStepIndex],

  startTutorial: () =>
    set({
      isActive: true,
      currentStepIndex: 0,
      completedConditions: [],
    }),

  skipTutorial: () => {
    localStorage.setItem('tutorialCompleted', 'true');
    set({ isActive: false });
  },

  nextStep: () =>
    set((state) => ({
      currentStepIndex: Math.min(
        state.currentStepIndex + 1,
        TUTORIAL_STEPS.length - 1
      ),
      completedConditions: [],
    })),

  completeCondition: (condition) =>
    set((state) => {
      const conditions = [...state.completedConditions, condition];
      const currentStep = TUTORIAL_STEPS[state.currentStepIndex];

      // Check if all conditions for current step are met
      if (
        currentStep.conditions &&
        currentStep.conditions.every((c) => conditions.includes(c))
      ) {
        // Auto-advance to next step
        return {
          completedConditions: [],
          currentStepIndex: Math.min(
            state.currentStepIndex + 1,
            TUTORIAL_STEPS.length - 1
          ),
        };
      }

      return { completedConditions: conditions };
    }),

  completeTutorial: () => {
    localStorage.setItem('tutorialCompleted', 'true');
    set({ isActive: false, currentStepIndex: 0, completedConditions: [] });
  },

  isNewPlayer: () => !localStorage.getItem('tutorialCompleted'),

  resetTutorial: () => {
    localStorage.removeItem('tutorialCompleted');
    set({
      isActive: false,
      currentStepIndex: 0,
      completedConditions: [],
    });
  },
}));
