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
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Send,
  Restaurant,
  FitnessCenter,
  Psychology,
  Message,
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";
import { GlassCard } from "../components/GlassCard";
import { useHealthStore } from "../store/healthStore";
import {
  chatWithAI,
  generateNutritionPlan,
  generateFitnessPlan,
  UserHealthProfile,
} from "../services/aiService";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const {
    userProfile,
    nutritionPlans,
    fitnessPlans,
    addNutritionPlan,
    addFitnessPlan,
    removeNutritionPlan,
    removeFitnessPlan,
  } = useHealthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const context = `Kullanıcı Profili: ${userProfile.disease} hastalığı, ${
        userProfile.age
      } yaşında. Diyet kısıtlamaları: ${userProfile.dietaryRestrictions?.join(
        ", "
      )}`;
      const aiResponse = await chatWithAI(inputMessage, context);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (type: "nutrition" | "fitness") => {
    if (!userProfile.disease || !userProfile.age) {
      alert("Lütfen önce sağlık profilinizi tamamlayın.");
      return;
    }

    setIsLoading(true);

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

      if (type === "nutrition") {
        const plan = await generateNutritionPlan(userHealthProfile);
        addNutritionPlan(plan);
        setActiveTab(0); // Switch to nutrition plans tab
      } else {
        const plan = await generateFitnessPlan(userHealthProfile);
        addFitnessPlan(plan);
        setActiveTab(1); // Switch to fitness plans tab
      }
    } catch (error) {
      console.error("Plan generation error:", error);
      alert("Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPlan = (plan: any) => {
    console.log("Viewing plan:", plan);
    setSelectedPlan(plan);
    setPlanDialogOpen(true);
  };

  const handleDeletePlan = (type: "nutrition" | "fitness", id: string) => {
    if (type === "nutrition") {
      removeNutritionPlan(id);
    } else {
      removeFitnessPlan(id);
    }
  };

  const renderPlanDialog = () => {
    if (!selectedPlan) return null;

    return (
      <Dialog
        open={planDialogOpen}
        onClose={() => setPlanDialogOpen(false)}
        maxWidth="md"
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
            {selectedPlan.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedPlan.description}
          </Typography>

          {selectedPlan.meals && selectedPlan.meals.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Öğünler
              </Typography>
              {selectedPlan.meals.map((meal: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {meal.meal}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Besinler:</strong> {meal.foods.join(", ")}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Kalori:</strong> {meal.calories} kcal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meal.notes}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {selectedPlan.exercises && selectedPlan.exercises.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Egzersizler
              </Typography>
              {selectedPlan.exercises.map((exercise: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {exercise.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Set:</strong> {exercise.sets} |{" "}
                    <strong>Tekrar:</strong> {exercise.reps} |{" "}
                    <strong>Süre:</strong> {exercise.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exercise.notes}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {selectedPlan.recommendations &&
            selectedPlan.recommendations.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Öneriler
                </Typography>
                <List>
                  {selectedPlan.recommendations.map(
                    (rec: string, index: number) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography variant="body2" color="primary">
                            •
                          </Typography>
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPlanDialogOpen(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
            }}
          >
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Grid container spacing={3}>
        {/* AI Chat Section */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Message sx={{ color: "#667eea", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  AI Sağlık Asistanı
                </Typography>
              </Box>

              {/* Chat Messages */}
              <Box
                sx={{
                  height: 400,
                  overflowY: "auto",
                  mb: 3,
                  p: 2,
                  bgcolor: "rgba(0,0,0,0.02)",
                  borderRadius: 2,
                }}
              >
                {messages.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Sağlığınızla ilgili sorularınızı sorun, size yardımcı
                    olayım!
                  </Typography>
                ) : (
                  messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.type === "user" ? "flex-end" : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          p: 2,
                          borderRadius: 2,
                          bgcolor:
                            message.type === "user"
                              ? "#667eea"
                              : "rgba(102, 126, 234, 0.1)",
                          color: message.type === "user" ? "white" : "inherit",
                        }}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.7, mt: 1, display: "block" }}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
                {isLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Chat Input */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Sağlığınızla ilgili sorularınızı sorun..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 2,
                    minWidth: 48,
                  }}
                >
                  <Send />
                </Button>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Plan Generator Section */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Psychology sx={{ color: "#f59e0b", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Plan Oluşturucu
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                AI destekli kişiselleştirilmiş beslenme ve fitness planları
                oluşturun.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Restaurant />}
                    onClick={() => handleGeneratePlan("nutrition")}
                    disabled={isLoading}
                    sx={{
                      borderRadius: 2,
                      py: 2,
                      borderColor: "#22c55e",
                      color: "#22c55e",
                      "&:hover": {
                        borderColor: "#16a34a",
                        bgcolor: "rgba(34, 197, 94, 0.1)",
                      },
                    }}
                  >
                    Beslenme Planı Oluştur
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FitnessCenter />}
                    onClick={() => handleGeneratePlan("fitness")}
                    disabled={isLoading}
                    sx={{
                      borderRadius: 2,
                      py: 2,
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#5b21b6",
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                      },
                    }}
                  >
                    Fitness Planı Oluştur
                  </Button>
                </Grid>

              </Grid>

              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  <Typography variant="body2">Plan oluşturuluyor...</Typography>
                </Box>
              )}
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Plans Section */}
      <GlassCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Psychology sx={{ color: "#667eea", mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Oluşturulan Planlar
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label={`Beslenme Planları (${nutritionPlans.length})`} />
            <Tab label={`Fitness Planları (${fitnessPlans.length})`} />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              {nutritionPlans.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Henüz beslenme planı oluşturulmadı.
                  </Typography>
                </Grid>
              ) : (
                nutritionPlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={4} key={plan.id}>
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
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, flex: 1 }}
                          >
                            {plan.title}
                          </Typography>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleViewPlan(plan)}
                              sx={{ color: "#667eea" }}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeletePlan("nutrition", plan.id)
                              }
                              sx={{ color: "#ef4444" }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {plan.description}
                        </Typography>
                        <Chip
                          label={plan.duration}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              {fitnessPlans.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Henüz fitness planı oluşturulmadı.
                  </Typography>
                </Grid>
              ) : (
                fitnessPlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={4} key={plan.id}>
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
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, flex: 1 }}
                          >
                            {plan.title}
                          </Typography>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleViewPlan(plan)}
                              sx={{ color: "#667eea" }}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeletePlan("fitness", plan.id)
                              }
                              sx={{ color: "#ef4444" }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {plan.description}
                        </Typography>
                        <Chip
                          label={plan.duration}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </CardContent>
      </GlassCard>

      {renderPlanDialog()}
    </Box>
  );
};
