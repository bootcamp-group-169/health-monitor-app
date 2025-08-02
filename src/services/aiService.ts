import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Gemini API anahtarını environment variable'dan al
const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || "your-api-key-here";

// Gemini AI instance'ı oluştur
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// LangChain chat model
const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048,
  temperature: 0.7,
});

export interface UserHealthProfile {
  disease: string;
  age: number;
  weight: number;
  height: number;
  symptoms: string[];
  dietaryRestrictions: string[];
  activityLevel: string;
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
}

export interface SymptomAnalysis {
  severity: number;
  possibleCauses: string[];
  recommendations: string[];
  relatedFoods: string[];
  warningSigns: string[];
}

export interface FoodAnalysis {
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
}

export interface MealTolerance {
  foodName: string;
  tolerated: boolean;
  symptoms: string[];
  severity: number;
  notes: string;
  date: Date;
}

// AI Chatbot için genel sohbet
export const chatWithAI = async (
  message: string,
  context?: string
): Promise<string> => {
  try {
    const prompt = context
      ? `Context: ${context}\n\nUser: ${message}\n\nAssistant:`
      : `User: ${message}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Chat error:", error);
    return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.";
  }
};

// Beslenme planı oluştur
export const generateNutritionPlan = async (
  userProfile: UserHealthProfile
): Promise<NutritionPlan> => {
  try {
    const prompt = `
    Sen bir bağırsak hastalıkları uzmanı diyetisyensin. ${
      userProfile.disease
    } hastalığı olan ${
      userProfile.age
    } yaşındaki bir hasta için 7 günlük beslenme planı oluştur.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Kilo: ${userProfile.weight} kg
    - Boy: ${userProfile.height} cm
    - Semptomlar: ${userProfile.symptoms.join(", ")}
    - Diyet Kısıtlamaları: ${userProfile.dietaryRestrictions.join(", ")}
    - Aktivite Seviyesi: ${userProfile.activityLevel}
    
    Lütfen JSON formatında yanıt ver:
    {
      "title": "7 Günlük Beslenme Planı",
      "description": "Hastalığınıza özel kişiselleştirilmiş beslenme planı",
      "duration": "7 gün",
      "meals": [
        {
          "meal": "Kahvaltı",
          "foods": ["yemek1", "yemek2"],
          "calories": 300,
          "notes": "Notlar"
        }
      ],
      "recommendations": ["tavsiye1", "tavsiye2"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const planData = JSON.parse(response.text());

    return {
      id: Date.now().toString(),
      ...planData,
    };
  } catch (error) {
    console.error("Nutrition plan generation error:", error);
    throw new Error("Beslenme planı oluşturulamadı");
  }
};

// Fitness planı oluştur
export const generateFitnessPlan = async (
  userProfile: UserHealthProfile
): Promise<FitnessPlan> => {
  try {
    const prompt = `
    Sen bir bağırsak hastalıkları uzmanı fitness eğitmenisin. ${
      userProfile.disease
    } hastalığı olan ${
      userProfile.age
    } yaşındaki bir hasta için 7 günlük fitness planı oluştur.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Kilo: ${userProfile.weight} kg
    - Boy: ${userProfile.height} cm
    - Semptomlar: ${userProfile.symptoms.join(", ")}
    - Aktivite Seviyesi: ${userProfile.activityLevel}
    
    Lütfen JSON formatında yanıt ver:
    {
      "title": "7 Günlük Fitness Planı",
      "description": "Hastalığınıza özel kişiselleştirilmiş fitness planı",
      "duration": "7 gün",
      "exercises": [
        {
          "name": "Egzersiz adı",
          "sets": 3,
          "reps": 10,
          "duration": "15 dakika",
          "notes": "Notlar"
        }
      ],
      "recommendations": ["tavsiye1", "tavsiye2"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const planData = JSON.parse(response.text());

    return {
      id: Date.now().toString(),
      ...planData,
    };
  } catch (error) {
    console.error("Fitness plan generation error:", error);
    throw new Error("Fitness planı oluşturulamadı");
  }
};

// Semptom analizi
export const analyzeSymptoms = async (
  symptoms: string[],
  userProfile: UserHealthProfile
): Promise<SymptomAnalysis> => {
  try {
    const prompt = `
    Sen bir bağırsak hastalıkları uzmanı doktorsun. ${
      userProfile.disease
    } hastalığı olan bir hastanın semptomlarını analiz et.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Semptomlar: ${symptoms.join(", ")}
    
    Lütfen JSON formatında yanıt ver:
    {
      "severity": 1-5 arası şiddet seviyesi,
      "possibleCauses": ["olası nedenler"],
      "recommendations": ["tavsiyeler"],
      "relatedFoods": ["kaçınılması gereken besinler"],
      "warningSigns": ["dikkat edilmesi gereken belirtiler"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Symptom analysis error:", error);
    throw new Error("Semptom analizi yapılamadı");
  }
};

// Yemek kalori hesaplama
export const calculateFoodCalories = async (
  foodName: string,
  amount: string
): Promise<FoodAnalysis> => {
  try {
    const prompt = `
    ${amount} ${foodName} için kalori ve besin değerlerini hesapla.
    
    Lütfen JSON formatında yanıt ver:
    {
      "calories": kalori miktarı,
      "nutrients": {
        "protein": protein gramı,
        "carbs": karbonhidrat gramı,
        "fat": yağ gramı,
        "fiber": lif gramı
      },
      "suitability": "good/moderate/avoid",
      "recommendations": ["tavsiyeler"],
      "alternatives": ["alternatif besinler"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Food calorie calculation error:", error);
    throw new Error("Kalori hesaplanamadı");
  }
};

// Yemek tolerans analizi
export const analyzeFoodTolerance = async (
  foodName: string,
  toleranceHistory: MealTolerance[],
  userProfile: UserHealthProfile
): Promise<string[]> => {
  try {
    const prompt = `
    Sen bir bağırsak hastalıkları uzmanı doktorsun. ${
      userProfile.disease
    } hastalığı olan bir hasta için ${foodName} besininin toleransını analiz et.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    
    Geçmiş Tolerans Verileri:
    ${toleranceHistory
      .map(
        (t) =>
          `${t.foodName}: ${
            t.tolerated ? "Toleranslı" : "Toleranssız"
          } - ${t.symptoms.join(", ")}`
      )
      .join("\n")}
    
    Bu besin için öneriler ver:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response
      .text()
      .split("\n")
      .filter((line) => line.trim());
  } catch (error) {
    console.error("Food tolerance analysis error:", error);
    return ["Analiz yapılamadı"];
  }
};

// Genel sağlık tavsiyeleri
export const getHealthInsights = async (
  userProfile: UserHealthProfile,
  recentMeals: any[],
  recentSymptoms: any[]
): Promise<string[]> => {
  try {
    const prompt = `
    Sen bir bağırsak hastalıkları uzmanı doktorsun. ${
      userProfile.disease
    } hastalığı olan bir hasta için genel sağlık tavsiyeleri ver.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Son Yemekler: ${recentMeals.map((m) => m.name).join(", ")}
    - Son Semptomlar: ${recentSymptoms.map((s) => s.type).join(", ")}
    
    Kişiselleştirilmiş tavsiyeler ver:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response
      .text()
      .split("\n")
      .filter((line) => line.trim());
  } catch (error) {
    console.error("Health insights error:", error);
    return ["Tavsiye alınamadı"];
  }
};
