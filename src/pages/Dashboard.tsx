import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Height,
  MonitorWeight,
  Cake,
  TrendingUp,
  Restaurant,
  LocalHospital,
  Psychology,
  CheckCircle,
  FitnessCenter,
} from "@mui/icons-material";
import { GlassCard } from "../components/GlassCard";
import { useHealthStore } from "../store/healthStore";
import { useAuthStore } from "../store/authStore";
import { UserInfoPopup } from "../components/UserInfoPopup";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const Dashboard: React.FC = () => {
  const { userProfile, symptoms, meals, healthPlans } = useHealthStore();
  const { isFirstLogin } = useAuthStore();

  const recentSymptoms = symptoms.slice(-3);
  const recentMeals = meals.slice(-3);

  // Ortalama kalori hesaplama
  const averageCalories =
    meals.length > 0
      ? Math.round(
          meals.reduce((total, meal) => total + meal.calories, 0) / meals.length
        )
      : 0;

  // Diyet ve aktivite planlarını ayır
  const dietPlans = healthPlans.filter((plan) => plan.type === "diet");
  const fitnessPlans = healthPlans.filter((plan) => plan.type === "fitness");

  // Semptom türlerini Türkçe'ye çevir
  const getSymptomTypeInTurkish = (type: string) => {
    const symptomTypes: { [key: string]: string } = {
      bloating: "Şişkinlik",
      cramps: "Kramp",
      diarrhea: "İshal",
      constipation: "Kabızlık",
      nausea: "Mide Bulantısı",
      gas: "Gaz",
      pain: "Ağrı",
      discomfort: "Rahatsızlık",
    };
    return symptomTypes[type.toLowerCase()] || type;
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      {/* User Profile Summary */}
      {(userProfile.height || userProfile.weight || userProfile.age) && (
        <GlassCard sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {userProfile.height && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Height sx={{ color: "#667eea", fontSize: 24 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {userProfile.height} cm
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Boy
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {userProfile.weight && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <MonitorWeight sx={{ color: "#22c55e", fontSize: 24 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {userProfile.weight} kg
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kilo
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {userProfile.age && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Cake sx={{ color: "#f59e0b", fontSize: 24 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {userProfile.age} yaş
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Yaş
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </GlassCard>
      )}

      {/* Health Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <LocalHospital sx={{ color: "#f59e0b", fontSize: 40, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {symptoms.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Toplam Semptom
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Restaurant sx={{ color: "#667eea", fontSize: 40, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {averageCalories}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ortalama Kalori
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Psychology sx={{ color: "#22c55e", fontSize: 40, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {dietPlans.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Diyet Planı
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <FitnessCenter sx={{ color: "#10b981", fontSize: 40, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {fitnessPlans.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aktivite Planı
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Symptoms */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <LocalHospital sx={{ color: "#f59e0b", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Son Semptomlar
                </Typography>
              </Box>
              {recentSymptoms.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentSymptoms.map((symptom) => (
                    <Box
                      key={symptom.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {getSymptomTypeInTurkish(symptom.type)}
                        </Typography>
                        <Chip
                          label={`Seviye ${symptom.severity}`}
                          size="small"
                          sx={{
                            background:
                              symptom.severity <= 2
                                ? "#22c55e"
                                : symptom.severity <= 3
                                ? "#f59e0b"
                                : "#ef4444",
                            color: "white",
                            fontSize: "0.8rem",
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(symptom.date, "dd MMM yyyy", { locale: tr })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Henüz semptom kaydedilmedi
                </Typography>
              )}
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Recent Meals */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Restaurant sx={{ color: "#22c55e", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Son Yemekler
                </Typography>
              </Box>
              {recentMeals.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentMeals.map((meal) => (
                    <Box
                      key={meal.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {meal.name}
                      </Typography>
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
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Henüz yemek kaydedilmedi
                </Typography>
              )}
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Health Plans */}
      {healthPlans.length > 0 && (
        <GlassCard sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Psychology sx={{ color: "#667eea", mr: 2, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Sağlık Planları
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {healthPlans.slice(-2).map((plan) => (
                <Grid item xs={12} sm={6} key={plan.id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={plan.type === "diet" ? "Beslenme" : "Fitness"}
                        size="medium"
                        sx={{
                          background:
                            plan.type === "diet" ? "#22c55e" : "#667eea",
                          color: "white",
                          fontSize: "0.9rem",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {plan.duration === "7 days" ? "7 gün" : plan.duration}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {plan.title === "7-Day Nutrition Plan"
                        ? "7 Günlük Beslenme Planı"
                        : plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description ===
                      "Personalized diet plan based on your preferences:"
                        ? "Tercihlerinize göre kişiselleştirilmiş beslenme planı:"
                        : plan.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </GlassCard>
      )}

      {/* User Info Popup */}
      <UserInfoPopup open={isFirstLogin} onClose={() => {}} />
    </Box>
  );
};
