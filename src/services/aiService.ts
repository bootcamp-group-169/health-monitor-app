import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Gemini API anahtarını environment variable'dan al
const GEMINI_API_KEY =
  import.meta.env.VITE_GOOGLE_AI_API_KEY ||
  import.meta.env.VITE_GEMINI_API_KEY ||
  "your-api-key-here";

// Environment variable'ı LangChain için de ayarla
if (typeof window !== "undefined") {
  (window as any).GOOGLE_API_KEY = GEMINI_API_KEY;
}

// Gemini AI instance'ı oluştur
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// LangChain chat model
const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: GEMINI_API_KEY, // API key'i direkt olarak da ver
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
    Sen bir bağırsak hastalıkları uzmanı beslenme uzmanısın. ${
      userProfile.disease
    } hastalığı olan ${
      userProfile.age
    } yaşındaki bir hasta için 7 günlük beslenme planı oluştur.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Kilo: ${userProfile.weight} kg
    - Boy: ${userProfile.height} cm
    - Diyet Kısıtlamaları: ${userProfile.dietaryRestrictions.join(", ")}
    - Aktivite Seviyesi: ${userProfile.activityLevel}
    
    SADECE JSON formatında yanıt ver, başka hiçbir şey yazma:
    {
      "title": "7 Günlük Beslenme Planı",
      "description": "Hastalığınıza özel kişiselleştirilmiş beslenme planı",
      "duration": "7 gün",
      "meals": [
        {
          "meal": "Kahvaltı",
          "foods": ["yulaf ezmesi", "muz", "badem sütü"],
          "calories": 300,
          "notes": "Laktoz içermeyen süt kullanın"
        },
        {
          "meal": "Öğle Yemeği",
          "foods": ["pirinç", "tavuk göğsü", "havuç"],
          "calories": 450,
          "notes": "Baharat kullanmayın"
        },
        {
          "meal": "Akşam Yemeği",
          "foods": ["balık", "patates", "salata"],
          "calories": 400,
          "notes": "Yağsız pişirin"
        }
      ],
      "recommendations": ["Günde 8 bardak su için", "Yavaş yiyin", "Gazlı içeceklerden kaçının"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // AI yanıtını temizle - JSON kısmını bul
    let cleanResponse = responseText.trim();

    // ```json ve ``` işaretlerini kaldır
    if (cleanResponse.includes("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\s*/, "")
        .replace(/\s*```/, "");
    }

    // Sadece JSON kısmını al
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    // JSON parse'ı güvenli hale getir
    let planData;
    try {
      planData = JSON.parse(cleanResponse);
    } catch (parseError) {
      // Fallback plan oluştur
      planData = {
        title: `${userProfile.disease} Hastası için 7 Günlük Beslenme Planı`,
        description: `${userProfile.age} yaşındaki, ${userProfile.weight} kg, ${
          userProfile.height
        } cm boyundaki, ${
          userProfile.activityLevel
        } yaşam tarzına sahip ve ${userProfile.dietaryRestrictions.join(
          ", "
        )} alerjisi olan ${
          userProfile.disease
        } hastası için kişiselleştirilmiş beslenme planı.`,
        duration: "7 gün",
        meals: [
          {
            meal: "Kahvaltı",
            foods: ["yulaf ezmesi", "muz", "badem sütü", "badem"],
            calories: 350,
            notes: "Laktoz içermeyen süt kullanın, yavaş yiyin",
          },
          {
            meal: "Ara Öğün",
            foods: ["elma", "ceviz"],
            calories: 150,
            notes: "Kabuklu meyve tüketmeyin",
          },
          {
            meal: "Öğle Yemeği",
            foods: ["pirinç", "tavuk göğsü", "havuç", "zeytinyağı"],
            calories: 500,
            notes: "Baharat kullanmayın, yağsız pişirin",
          },
          {
            meal: "Ara Öğün",
            foods: ["yoğurt", "muz"],
            calories: 200,
            notes: "Laktoz içermeyen yoğurt tercih edin",
          },
          {
            meal: "Akşam Yemeği",
            foods: ["balık", "patates", "salata", "zeytinyağı"],
            calories: 450,
            notes: "Yağsız pişirin, yavaş yiyin",
          },
        ],
        recommendations: [
          "Günde 8-10 bardak su için",
          "Yavaş yiyin ve iyi çiğneyin",
          "Gazlı içeceklerden kaçının",
          "Baharatlı ve yağlı yiyeceklerden uzak durun",
          "Düzenli öğün saatlerine uyun",
          "Stres yönetimi için nefes egzersizleri yapın",
        ],
      };
    }

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
    Sen bir bağırsak hastalıkları uzmanı fitness eğitmenisin. ${userProfile.disease} hastalığı olan ${userProfile.age} yaşındaki bir hasta için 7 günlük fitness planı oluştur.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Kilo: ${userProfile.weight} kg
    - Boy: ${userProfile.height} cm
    - Aktivite Seviyesi: ${userProfile.activityLevel}
    
    SADECE JSON formatında yanıt ver, başka hiçbir şey yazma:
    {
      "title": "7 Günlük Fitness Planı",
      "description": "Hastalığınıza özel kişiselleştirilmiş fitness planı",
      "duration": "7 gün",
      "exercises": [
        {
          "name": "Yürüyüş",
          "sets": 1,
          "reps": 0,
          "duration": "20 dakika",
          "notes": "Yavaş tempoda yürüyün"
        },
        {
          "name": "Hafif Yoga",
          "sets": 1,
          "reps": 0,
          "duration": "15 dakika",
          "notes": "Karın bölgesini zorlamayın"
        },
        {
          "name": "Nefes Egzersizleri",
          "sets": 3,
          "reps": 10,
          "duration": "5 dakika",
          "notes": "Derin nefes alın"
        }
      ],
      "recommendations": ["Günde 30 dakika egzersiz yapın", "Ağır egzersizlerden kaçının", "Bol su için"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // AI yanıtını temizle - JSON kısmını bul
    let cleanResponse = responseText.trim();

    // ```json ve ``` işaretlerini kaldır
    if (cleanResponse.includes("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\s*/, "")
        .replace(/\s*```/, "");
    }

    // Sadece JSON kısmını al
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    // JSON parse'ı güvenli hale getir
    let planData;
    try {
      planData = JSON.parse(cleanResponse);
    } catch (parseError) {
      // Fallback plan oluştur
      planData = {
        title: `${userProfile.disease} Hastası için 7 Günlük Fitness Planı`,
        description: `${userProfile.age} yaşındaki, ${userProfile.weight} kg, ${userProfile.height} cm boyundaki, ${userProfile.activityLevel} yaşam tarzına sahip ${userProfile.disease} hastası için kişiselleştirilmiş fitness planı.`,
        duration: "7 gün",
        exercises: [
          {
            name: "Hafif Yürüyüş",
            sets: 1,
            reps: 0,
            duration: "20-30 dakika",
            notes: "Yavaş tempoda yürüyün, karın bölgesini zorlamayın",
          },
          {
            name: "Nefes Egzersizleri",
            sets: 3,
            reps: 10,
            duration: "5 dakika",
            notes: "Derin nefes alın, stres azaltın",
          },
          {
            name: "Hafif Yoga (Oturarak)",
            sets: 1,
            reps: 0,
            duration: "15 dakika",
            notes: "Karın bölgesini zorlamayın, yumuşak hareketler",
          },
          {
            name: "Esneme Egzersizleri",
            sets: 2,
            reps: 5,
            duration: "10 dakika",
            notes: "Yavaş ve kontrollü hareketler yapın",
          },
          {
            name: "Hafif Pilates",
            sets: 1,
            reps: 0,
            duration: "15 dakika",
            notes: "Karın kaslarını zorlamayın",
          },
        ],
        recommendations: [
          "Günde 30-45 dakika hafif egzersiz yapın",
          "Ağır egzersizlerden ve karın bölgesini zorlayan hareketlerden kaçının",
          "Egzersiz öncesi ve sonrası bol su için",
          "Stres yönetimi için nefes egzersizlerini düzenli yapın",
          "Egzersiz sırasında rahatsızlık hissederseniz durun",
          "Düzenli yürüyüş yapın ama aşırıya kaçmayın",
        ],
      };
    }

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
    
    SADECE JSON formatında yanıt ver, başka hiçbir şey yazma:
    {
      "severity": 3,
      "possibleCauses": ["Stres", "Yanlış beslenme", "Enfeksiyon"],
      "recommendations": ["Bol su için", "Hafif besinler tüketin", "Doktora görünün"],
      "relatedFoods": ["Süt ürünleri", "Baharatlı yiyecekler", "Gazlı içecekler"],
      "warningSigns": ["Şiddetli ağrı", "Kanama", "Yüksek ateş"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // AI yanıtını temizle
    let cleanResponse = responseText.trim();
    if (cleanResponse.includes("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\s*/, "")
        .replace(/\s*```/, "");
    }
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    try {
      const analysisData = JSON.parse(cleanResponse);
      return analysisData;
    } catch (parseError) {
      // Fallback analiz
      return {
        severity: 3,
        possibleCauses: ["Stres", "Yanlış beslenme", "Enfeksiyon"],
        recommendations: [
          "Bol su için",
          "Hafif besinler tüketin",
          "Doktora görünün",
        ],
        relatedFoods: [
          "Süt ürünleri",
          "Baharatlı yiyecekler",
          "Gazlı içecekler",
        ],
        warningSigns: ["Şiddetli ağrı", "Kanama", "Yüksek ateş"],
      };
    }
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
    Sen bir beslenme uzmanısın. ${amount} ${foodName} için kalori hesapla.
    
    SADECE JSON formatında yanıt ver:
    {
      "calories": kalori_miktari,
      "nutrients": {
        "protein": protein_grami,
        "carbs": karbonhidrat_grami,
        "fat": yag_grami,
        "fiber": lif_grami
      },
      "suitability": "good",
      "recommendations": ["tavsiye1", "tavsiye2"],
      "alternatives": ["alternatif1", "alternatif2"]
    }`;

    console.log("Sending request to AI for:", foodName, amount);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Raw AI Response:", responseText);

    // AI yanıtını temizle
    let cleanResponse = responseText.trim();

    // JSON kısmını bul
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    console.log("Cleaned response:", cleanResponse);

    const foodData = JSON.parse(cleanResponse);
    console.log("Parsed food data:", foodData);

    return foodData;
  } catch (error) {
    console.error("AI Error:", error);

    // AI çalışmazsa basit hesaplama
    const amountNumber = parseInt(amount.replace(/\D/g, "")) || 100;
    const baseCalories = 150; // Ortalama kalori
    const calculatedCalories = Math.round((amountNumber * baseCalories) / 100);

    return {
      calories: calculatedCalories,
      nutrients: {
        protein: 10,
        carbs: 20,
        fat: 5,
        fiber: 3,
      },
      suitability: "good",
      recommendations: ["Bol su ile tüketin", "Yavaş yiyin"],
      alternatives: ["Alternatif 1", "Alternatif 2"],
    };
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
    } hastalığı olan bir hasta için kısa ve öz sağlık tavsiyeleri ver.
    
    Hasta Bilgileri:
    - Hastalık: ${userProfile.disease}
    - Yaş: ${userProfile.age}
    - Son Yemekler: ${recentMeals.map((m) => m.name).join(", ")}
    - Son Semptomlar: ${recentSymptoms.map((s) => s.type).join(", ")}
    
    SADECE 3-5 kısa tavsiye ver, her tavsiye 1-2 cümle olsun. JSON formatında yanıt ver:
    {
      "insights": [
        "Tavsiye 1",
        "Tavsiye 2", 
        "Tavsiye 3"
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // AI yanıtını temizle
    let cleanResponse = responseText.trim();
    if (cleanResponse.includes("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\s*/, "")
        .replace(/\s*```/, "");
    }
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    try {
      const data = JSON.parse(cleanResponse);
      return data.insights || ["Tavsiye alınamadı"];
    } catch (parseError) {
      // Fallback tavsiyeler
      return [
        "**Genel Sağlık Tavsiyeleri:** Günde 8 bardak su için ve yavaş yiyin.",
        "**Beslenme:** Laktoz ve gluten içeren besinlerden kaçının.",
        "**Aktivite:** Hafif yürüyüş yapın, ağır egzersizlerden kaçının.",
        "**Stres:** Stres yönetimi için nefes egzersizleri yapın.",
      ];
    }
  } catch (error) {
    console.error("Health insights error:", error);
    return [
      "**Genel Sağlık Tavsiyeleri:** Günde 8 bardak su için ve yavaş yiyin.",
      "**Beslenme:** Laktoz ve gluten içeren besinlerden kaçının.",
      "**Aktivite:** Hafif yürüyüş yapın, ağır egzersizlerden kaçının.",
    ];
  }
};
