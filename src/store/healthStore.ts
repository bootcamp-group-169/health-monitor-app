import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Symptom {
  id: string;
  date: Date;
  type: string;
  severity: number;
  notes: string;
}

interface Meal {
  id: string;
  date: Date;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface HealthPlan {
  id: string;
  type: 'diet' | 'fitness';
  title: string;
  description: string;
  items: string[];
  duration: string;
}

interface HealthState {
  symptoms: Symptom[];
  meals: Meal[];
  chatMessages: ChatMessage[];
  healthPlans: HealthPlan[];
  userProfile: {
    height?: number;
    weight?: number;
    age?: number;
    hasIntestinalDisease?: boolean;
    intestinalDiseaseType?: string;
    isProfileComplete: boolean;
  };
  addSymptom: (symptom: Omit<Symptom, 'id'>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  generateHealthPlan: (type: 'diet' | 'fitness', preferences: string) => Promise<void>;
  updateUserProfile: (profile: Partial<HealthState['userProfile']>) => void;
  clearAllData: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      symptoms: [],
      meals: [],
      chatMessages: [],
      healthPlans: [],
      userProfile: {
        isProfileComplete: false,
      },
      addSymptom: (symptom) => {
        const newSymptom = { ...symptom, id: Date.now().toString() };
        set((state) => ({ symptoms: [...state.symptoms, newSymptom] }));
      },
      addMeal: (meal) => {
        const newMeal = { ...meal, id: Date.now().toString() };
        set((state) => ({ meals: [...state.meals, newMeal] }));
      },
      addChatMessage: (message) => {
        const newMessage = { ...message, id: Date.now().toString() };
        set((state) => ({ chatMessages: [...state.chatMessages, newMessage] }));
      },
      generateHealthPlan: async (type, preferences) => {
        const newPlan: HealthPlan = {
          id: Date.now().toString(),
          type,
          title: type === 'diet' ? '7-Day Nutrition Plan' : '4-Week Fitness Program',
          description: `Personalized ${type} plan based on your preferences: ${preferences}`,
          items: type === 'diet' 
            ? [
                'High-protein breakfast with eggs and avocado',
                'Lean protein lunch with quinoa and vegetables',
                'Healthy snacks: nuts, fruits, and Greek yogurt',
                'Balanced dinner with fish or chicken',
                'Stay hydrated with 8+ glasses of water daily'
              ]
            : [
                'Warm-up: 10 minutes of light cardio',
                'Strength training: 3 sets of compound exercises',
                'Core workout: planks and crunches',
                'Cool-down: stretching and flexibility',
                '30-45 minutes total workout time'
              ],
          duration: type === 'diet' ? '7 days' : '4 weeks'
        };
        
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        set((state) => ({ healthPlans: [...state.healthPlans, newPlan] }));
      },
      updateUserProfile: (profile) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile }
        }));
      },
      clearAllData: () => {
        set({
          symptoms: [],
          meals: [],
          chatMessages: [],
          healthPlans: [],
          userProfile: { isProfileComplete: false },
        });
      },
    }),
    {
      name: 'health-storage',
    }
  )
);