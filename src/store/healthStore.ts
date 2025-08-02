import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  height?: number;
  weight?: number;
  age?: number;
  disease?: string;
  dietaryRestrictions?: string[];
  activityLevel?: string;
}

export interface Symptom {
  id: string;
  type: string;
  severity: number;
  date: Date;
  notes: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foods: string[];
  amount: string;
}

export interface HealthPlan {
  id: string;
  type: "diet" | "fitness";
  title: string;
  description: string;
  duration: string;
  created: Date;
}

export interface NutritionPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  meals: {
    meal: string;
    foods: string[];
    calories: number;
    notes: string;
  }[];
  recommendations: string[];
  created: Date;
}

export interface FitnessPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    duration: string;
    notes: string;
  }[];
  recommendations: string[];
  created: Date;
}

export interface MealTolerance {
  id: string;
  foodName: string;
  tolerated: boolean;
  symptoms: string[];
  severity: number;
  notes: string;
  date: Date;
}

export interface SymptomAnalysis {
  id: string;
  symptoms: string[];
  severity: number;
  possibleCauses: string[];
  recommendations: string[];
  relatedFoods: string[];
  warningSigns: string[];
  date: Date;
}

export interface FoodAnalysis {
  id: string;
  foodName: string;
  amount: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  suitability: "good" | "moderate" | "avoid";
  recommendations: string[];
  alternatives: string[];
  date: Date;
}

interface HealthStore {
  // User Profile
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;

  // Symptoms
  symptoms: Symptom[];
  addSymptom: (symptom: Omit<Symptom, "id">) => void;
  removeSymptom: (id: string) => void;

  // Meals
  meals: Meal[];
  addMeal: (meal: Omit<Meal, "id">) => void;
  removeMeal: (id: string) => void;

  // Health Plans
  healthPlans: HealthPlan[];
  addHealthPlan: (plan: Omit<HealthPlan, "id">) => void;
  removeHealthPlan: (id: string) => void;

  // AI Generated Plans
  nutritionPlans: NutritionPlan[];
  fitnessPlans: FitnessPlan[];
  addNutritionPlan: (plan: Omit<NutritionPlan, "id" | "created">) => void;
  addFitnessPlan: (plan: Omit<FitnessPlan, "id" | "created">) => void;
  removeNutritionPlan: (id: string) => void;
  removeFitnessPlan: (id: string) => void;

  // Meal Tolerance Tracking
  mealTolerances: MealTolerance[];
  addMealTolerance: (tolerance: Omit<MealTolerance, "id">) => void;
  removeMealTolerance: (id: string) => void;

  // AI Analysis
  symptomAnalyses: SymptomAnalysis[];
  foodAnalyses: FoodAnalysis[];
  addSymptomAnalysis: (analysis: Omit<SymptomAnalysis, "id" | "date">) => void;
  addFoodAnalysis: (analysis: Omit<FoodAnalysis, "id" | "date">) => void;
  removeSymptomAnalysis: (id: string) => void;
  removeFoodAnalysis: (id: string) => void;

  // Clear all data
  clearAllData: () => void;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      // User Profile
      userProfile: {},
      setUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      // Symptoms
      symptoms: [],
      addSymptom: (symptom) =>
        set((state) => ({
          symptoms: [
            ...state.symptoms,
            { ...symptom, id: Date.now().toString() },
          ],
        })),
      removeSymptom: (id) =>
        set((state) => ({
          symptoms: state.symptoms.filter((s) => s.id !== id),
        })),

      // Meals
      meals: [],
      addMeal: (meal) =>
        set((state) => ({
          meals: [...state.meals, { ...meal, id: Date.now().toString() }],
        })),
      removeMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        })),

      // Health Plans
      healthPlans: [],
      addHealthPlan: (plan) =>
        set((state) => ({
          healthPlans: [
            ...state.healthPlans,
            { ...plan, id: Date.now().toString() },
          ],
        })),
      removeHealthPlan: (id) =>
        set((state) => ({
          healthPlans: state.healthPlans.filter((p) => p.id !== id),
        })),

      // AI Generated Plans
      nutritionPlans: [],
      fitnessPlans: [],
      addNutritionPlan: (plan) =>
        set((state) => ({
          nutritionPlans: [
            ...state.nutritionPlans,
            { ...plan, id: Date.now().toString(), created: new Date() },
          ],
        })),
      addFitnessPlan: (plan) =>
        set((state) => ({
          fitnessPlans: [
            ...state.fitnessPlans,
            { ...plan, id: Date.now().toString(), created: new Date() },
          ],
        })),
      removeNutritionPlan: (id) =>
        set((state) => ({
          nutritionPlans: state.nutritionPlans.filter((p) => p.id !== id),
        })),
      removeFitnessPlan: (id) =>
        set((state) => ({
          fitnessPlans: state.fitnessPlans.filter((p) => p.id !== id),
        })),

      // Meal Tolerance Tracking
      mealTolerances: [],
      addMealTolerance: (tolerance) =>
        set((state) => ({
          mealTolerances: [
            ...state.mealTolerances,
            { ...tolerance, id: Date.now().toString() },
          ],
        })),
      removeMealTolerance: (id) =>
        set((state) => ({
          mealTolerances: state.mealTolerances.filter((t) => t.id !== id),
        })),

      // AI Analysis
      symptomAnalyses: [],
      foodAnalyses: [],
      addSymptomAnalysis: (analysis) =>
        set((state) => ({
          symptomAnalyses: [
            ...state.symptomAnalyses,
            { ...analysis, id: Date.now().toString(), date: new Date() },
          ],
        })),
      addFoodAnalysis: (analysis) =>
        set((state) => ({
          foodAnalyses: [
            ...state.foodAnalyses,
            { ...analysis, id: Date.now().toString(), date: new Date() },
          ],
        })),
      removeSymptomAnalysis: (id) =>
        set((state) => ({
          symptomAnalyses: state.symptomAnalyses.filter((a) => a.id !== id),
        })),
      removeFoodAnalysis: (id) =>
        set((state) => ({
          foodAnalyses: state.foodAnalyses.filter((a) => a.id !== id),
        })),

      // Clear all data
      clearAllData: () =>
        set({
          userProfile: {},
          symptoms: [],
          meals: [],
          healthPlans: [],
          nutritionPlans: [],
          fitnessPlans: [],
          mealTolerances: [],
          symptomAnalyses: [],
          foodAnalyses: [],
        }),
    }),
    {
      name: "health-storage",
    }
  )
);
