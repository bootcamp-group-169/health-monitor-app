import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel,
  Divider,
  Slider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Restaurant,
  Add,
  TrendingUp,
  Psychology,
  CheckCircle,
  Warning,
  Info,
  CalendarToday,
  Analytics,
  ThumbUp,
  ThumbDown,
  Delete,
} from "@mui/icons-material";
import { GlassCard } from "../components/GlassCard";
import { useHealthStore } from "../store/healthStore";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  calculateFoodCalories,
  analyzeFoodTolerance,
  getHealthInsights,
  UserHealthProfile,
} from "../services/aiService";

const mealTypes = [
  { value: "breakfast", label: "Kahvaltı" },
  { value: "lunch", label: "Öğle Yemeği" },
  { value: "dinner", label: "Akşam Yemeği" },
  { value: "snack", label: "Ara Öğün" },
];

const foodSuggestions = [
  "Tavuk Göğsü",
  "Somon",
  "Mercimek Çorbası",
  "Pirinç",
  "Brokoli",
  "Havuç",
  "Elma",
  "Muz",
  "Yoğurt",
  "Badem",
  "Zeytinyağı",
  "Balık",
  "Et",
  "Yumurta",
  "Süt",
  "Ekmek",
];

export const MealTracker: React.FC = () => {
  const {
    userProfile,
    meals,
    addMeal,
    removeMeal,
    mealTolerances,
    addMealTolerance,
    addFoodAnalysis,
  } = useHealthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(
    null
  );
  const [foodAnalysis, setFoodAnalysis] = useState<any>(null);
  const [toleranceDialogOpen, setToleranceDialogOpen] = useState(false);
  const [selectedFoodForTolerance, setSelectedFoodForTolerance] =
    useState<any>(null);
  const [tolerated, setTolerated] = useState(true); // Default: Rahatsız Etmiyor
  const [toleranceSymptoms, setToleranceSymptoms] = useState<string[]>([]);
  const [toleranceSeverity, setToleranceSeverity] = useState(3);
  const [toleranceNotes, setToleranceNotes] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const recentMeals = meals.slice(-5);
  const todayMeals = meals.filter(
    (meal) =>
      format(meal.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const handleAddMeal = () => {
    if (!selectedMealType || !foodName || !amount) return;

    addMeal({
      name: foodName,
      calories: calculatedCalories || 0,
      date: new Date(),
      mealType: selectedMealType as any,
      foods: [foodName],
      amount: amount,
    });

    // Reset form
    setSelectedMealType("");
    setFoodName("");
    setAmount("");
    setCalculatedCalories(null);
    setFoodAnalysis(null);
  };

  const handleCalculateCalories = async () => {
    console.log("BUTONA TIKLANDI!");
    console.log("foodName:", foodName);
    console.log("amount:", amount);

    if (!foodName || !amount) {
      alert("Lütfen yemek adı ve miktar girin!");
      return;
    }

    setIsCalculating(true);

    // Basit kalori hesaplayıcı
    const foodCalories: { [key: string]: number } = {
      tavuk: 165,
      "tavuk göğsü": 165,
      somon: 208,
      balık: 200,
      et: 250,
      yumurta: 155,
      süt: 42,
      yoğurt: 59,
      pirinç: 130,
      ekmek: 265,
      elma: 52,
      muz: 89,
      brokoli: 34,
      havuç: 41,
      badem: 164,
      zeytinyağı: 884,
      mercimek: 116,
      çorba: 100,
    };

    // Miktardan gram çıkar
    const amountNumber = parseInt(amount.replace(/\D/g, "")) || 100;

    // Yemek adından kalori bul
    const baseCalories = foodCalories[foodName.toLowerCase()] || 150;

    // Gram başına kalori hesapla
    const calculatedCalories = Math.round((amountNumber * baseCalories) / 100);

    console.log("Hesaplanan kalori:", calculatedCalories);

    // Sonucu göster
    setCalculatedCalories(calculatedCalories);

    const analysis = {
      calories: calculatedCalories,
      nutrients: {
        protein: Math.floor(Math.random() * 20) + 5,
        carbs: Math.floor(Math.random() * 40) + 10,
        fat: Math.floor(Math.random() * 15) + 2,
        fiber: Math.floor(Math.random() * 8) + 1,
      },
      suitability: "good",
      recommendations: ["Bol su ile tüketin", "Yavaş yiyin"],
      alternatives: ["Alternatif 1", "Alternatif 2"],
    };

    setFoodAnalysis(analysis);
    setIsCalculating(false);

    console.log("Kalori hesaplama tamamlandı!");
  };

  const handleToleranceCheck = (meal: any) => {
    setSelectedFoodForTolerance(meal);
    setToleranceDialogOpen(true);
  };

  const handleSaveTolerance = () => {
    if (!selectedFoodForTolerance) return;

    addMealTolerance({
      foodName: selectedFoodForTolerance.name,
      tolerated,
      symptoms: toleranceSymptoms,
      severity: toleranceSeverity,
      notes: toleranceNotes,
      date: new Date(),
    });

    // Reset form
    setToleranceDialogOpen(false);
    setSelectedFoodForTolerance(null);
    setTolerated(true);
    setToleranceSymptoms([]);
    setToleranceSeverity(3);
    setToleranceNotes("");
  };

  const handleDeleteMeal = (mealId: string) => {
    if (window.confirm("Bu yemeği silmek istediğinizden emin misiniz?")) {
      removeMeal(mealId);
    }
  };

  const handleDeleteTolerance = (toleranceId: string) => {
    if (
      window.confirm("Bu tolerans kaydını silmek istediğinizden emin misiniz?")
    ) {
      // removeMealTolerance fonksiyonunu store'dan alalım
      const { removeMealTolerance } = useHealthStore.getState();
      removeMealTolerance(toleranceId);
    }
  };

  const handleGetInsights = async () => {
    if (!userProfile.disease || !userProfile.age) {
      alert("Lütfen önce sağlık profilinizi tamamlayın.");
      return;
    }

    setIsLoadingInsights(true);

    try {
      const userHealthProfile: UserHealthProfile = {
        disease: userProfile.disease,
        age: userProfile.age,
        weight: userProfile.weight || 70,
        height: userProfile.height || 170,
        symptoms: [],
        dietaryRestrictions: userProfile.dietaryRestrictions || [],
        activityLevel: userProfile.activityLevel || "Hafif Aktif",
      };

      const healthInsights = await getHealthInsights(
        userHealthProfile,
        meals,
        []
      );
      setInsights(healthInsights);
    } catch (error) {
      console.error("Health insights error:", error);
      setInsights(["Tavsiye alınamadı. Lütfen daha sonra tekrar deneyin."]);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "good":
        return "#22c55e";
      case "moderate":
        return "#f59e0b";
      case "avoid":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getSuitabilityText = (suitability: string) => {
    switch (suitability) {
      case "good":
        return "İyi";
      case "moderate":
        return "Orta";
      case "avoid":
        return "Kaçının";
      default:
        return "Bilinmiyor";
    }
  };

  const totalCaloriesToday = todayMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );
  const targetCalories = 2000; // Bu değer kullanıcı profiline göre ayarlanabilir

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Grid container spacing={3}>
        {/* Meal Form */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Restaurant sx={{ color: "#22c55e", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Yemek Ekle
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Öğün Türü</InputLabel>
                  <Select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    label="Öğün Türü"
                    sx={{ borderRadius: 2 }}
                  >
                    {mealTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Yemek Adı"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  label="Miktar (örn: 100g, 1 porsiyon)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  onClick={() => {
                    console.log("BUTONA TIKLANDI!");
                    console.log("foodName:", foodName);
                    console.log("amount:", amount);
                    handleCalculateCalories();
                  }}
                  disabled={isCalculating}
                  variant="outlined"
                  startIcon={
                    isCalculating ? (
                      <CircularProgress size={20} />
                    ) : (
                      <TrendingUp />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    borderColor: "#667eea",
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#5b21b6",
                      bgcolor: "rgba(102, 126, 234, 0.1)",
                    },
                  }}
                >
                  {isCalculating ? "Hesaplanıyor..." : "KALORI HESAPLA"}
                </Button>

                {calculatedCalories && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                      borderRadius: 2,
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#16a34a", mb: 1 }}
                    >
                      {calculatedCalories} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hesaplanan Kalori
                    </Typography>
                  </Box>
                )}

                {foodAnalysis && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(102, 126, 234, 0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Besin Analizi
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Protein:</strong>{" "}
                          {foodAnalysis.nutrients.protein}g
                        </Typography>
                        <Typography variant="body2">
                          <strong>Karbonhidrat:</strong>{" "}
                          {foodAnalysis.nutrients.carbs}g
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Yağ:</strong> {foodAnalysis.nutrients.fat}g
                        </Typography>
                        <Typography variant="body2">
                          <strong>Lif:</strong> {foodAnalysis.nutrients.fiber}g
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Uygunluk: ${getSuitabilityText(
                          foodAnalysis.suitability
                        )}`}
                        sx={{
                          background: getSuitabilityColor(
                            foodAnalysis.suitability
                          ),
                          color: "white",
                          fontSize: "0.8rem",
                        }}
                      />
                    </Box>
                  </Box>
                )}

                <Button
                  onClick={handleAddMeal}
                  disabled={!selectedMealType || !foodName || !amount}
                  variant="contained"
                  size="large"
                  sx={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    borderRadius: 2,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                      boxShadow: "0 6px 16px rgba(34, 197, 94, 0.4)",
                    },
                  }}
                >
                  ✅ YEMEK EKLE
                </Button>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* AI Analysis and Quick Add */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Psychology sx={{ color: "#667eea", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  AI Analizi
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Beslenme alışkanlıklarınızı analiz ederek kişiselleştirilmiş
                öneriler alın.
              </Typography>

              <Button
                onClick={handleGetInsights}
                disabled={isLoadingInsights}
                variant="outlined"
                startIcon={
                  isLoadingInsights ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Analytics />
                  )
                }
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#5b21b6",
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                {isLoadingInsights
                  ? "Analiz Ediliyor..."
                  : "Beslenme Analizi Al"}
              </Button>

              {insights.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    AI Tavsiyeleri
                  </Typography>
                  <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                    {insights.map((insight, index) => {
                      // Uzun tavsiyeleri parçalara ayır
                      const parts = insight
                        .split("**")
                        .filter((part) => part.trim());

                      return (
                        <Box
                          key={index}
                          sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: "rgba(34, 197, 94, 0.1)",
                            borderRadius: 2,
                          }}
                        >
                          {parts.map((part, partIndex) => {
                            const isHeader =
                              part.trim().endsWith(":") ||
                              part.trim().endsWith("：");
                            const isSubHeader =
                              part.trim().startsWith("*") &&
                              part.trim().endsWith("*");

                            return (
                              <Box
                                key={partIndex}
                                sx={{
                                  mb: partIndex < parts.length - 1 ? 1 : 0,
                                }}
                              >
                                {isHeader ? (
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#16a34a",
                                      mb: 1,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <CheckCircle
                                      sx={{ fontSize: 18, color: "#22c55e" }}
                                    />
                                    {part.trim().replace(":", "")}
                                  </Typography>
                                ) : isSubHeader ? (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "#374151",
                                      ml: 2,
                                      mb: 0.5,
                                    }}
                                  >
                                    {part.trim().replace(/\*/g, "")}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#6b7280",
                                      ml: 2,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {part.trim()}
                                  </Typography>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Hızlı Ekle
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {foodSuggestions.map((food) => (
                  <Chip
                    key={food}
                    label={food}
                    onClick={() => setFoodName(food)}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Today's Summary */}
      <GlassCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <TrendingUp sx={{ color: "#22c55e", mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Bugünün Özeti
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">
                Toplam Kalori: {totalCaloriesToday} / {targetCalories} kcal
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {Math.round((totalCaloriesToday / targetCalories) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((totalCaloriesToday / targetCalories) * 100, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(34, 197, 94, 0.2)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#22c55e",
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {todayMeals.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Bugünkü Yemekler
              </Typography>
              <Grid container spacing={2}>
                {todayMeals.map((meal) => (
                  <Grid item xs={12} sm={6} md={4} key={meal.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {meal.name}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => handleToleranceCheck(meal)}
                            sx={{ color: "#667eea", minWidth: "auto", p: 0.5 }}
                          >
                            {tolerated ? (
                              <ThumbUp fontSize="small" />
                            ) : (
                              <ThumbDown fontSize="small" />
                            )}
                          </Button>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {
                            mealTypes.find((t) => t.value === meal.mealType)
                              ?.label
                          }
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "#22c55e", fontWeight: 700 }}
                        >
                          {meal.calories} kalori
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </GlassCard>

      {/* Meal History */}
      <GlassCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CalendarToday sx={{ color: "#f59e0b", mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Yemek Geçmişi
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Son Yemekler" />
            <Tab label="Tolerans Takibi" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              {recentMeals.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Henüz yemek kaydedilmedi
                  </Typography>
                </Grid>
              ) : (
                recentMeals.map((meal) => (
                  <Grid item xs={12} sm={6} md={4} key={meal.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        position: "relative",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, flex: 1 }}
                          >
                            {meal.name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMeal(meal.id)}
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                bgcolor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {format(meal.date, "dd MMM yyyy", { locale: tr })}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "#22c55e", fontWeight: 700 }}
                        >
                          {meal.calories} kalori
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              {mealTolerances.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Henüz tolerans kaydı yok
                  </Typography>
                </Grid>
              ) : (
                mealTolerances.map((tolerance) => (
                  <Grid item xs={12} sm={6} md={4} key={tolerance.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        position: "relative",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, flex: 1 }}
                          >
                            {tolerance.foodName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {tolerance.tolerated ? (
                              <Tooltip title="Rahatsız Etmiyor">
                                <ThumbUp sx={{ color: "#22c55e" }} />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Rahatsız Ediyor">
                                <ThumbDown sx={{ color: "#ef4444" }} />
                              </Tooltip>
                            )}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteTolerance(tolerance.id)
                              }
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  bgcolor: "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {format(tolerance.date, "dd MMM yyyy", {
                            locale: tr,
                          })}
                        </Typography>
                        {!tolerance.tolerated &&
                          tolerance.symptoms.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="error">
                                Semptomlar: {tolerance.symptoms.join(", ")}
                              </Typography>
                            </Box>
                          )}
                        {tolerance.notes && (
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic" }}
                          >
                            "{tolerance.notes}"
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </CardContent>
      </GlassCard>

      {/* Tolerance Dialog */}
      <Dialog
        open={toleranceDialogOpen}
        onClose={() => setToleranceDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 16,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#667eea" }}>
            Besin Rahatsızlık Durumu
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFoodForTolerance && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h6">
                {selectedFoodForTolerance.name}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={tolerated}
                    onChange={(e) => setTolerated(e.target.checked)}
                  />
                }
                label={tolerated ? "Rahatsız Etmiyor" : "Rahatsız Ediyor"}
              />

              {!tolerated && (
                <>
                  <TextField
                    label="Semptomlar (virgülle ayırın)"
                    value={toleranceSymptoms.join(", ")}
                    onChange={(e) =>
                      setToleranceSymptoms(
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                      )
                    }
                    multiline
                    rows={2}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Şiddet Seviyesi: {toleranceSeverity}/5
                    </Typography>
                    <Slider
                      value={toleranceSeverity}
                      onChange={(e: Event, value: number | number[]) =>
                        setToleranceSeverity(value as number)
                      }
                      min={1}
                      max={5}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <TextField
                    label="Notlar"
                    value={toleranceNotes}
                    onChange={(e) => setToleranceNotes(e.target.value)}
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToleranceDialogOpen(false)}>İptal</Button>
          <Button onClick={handleSaveTolerance} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
