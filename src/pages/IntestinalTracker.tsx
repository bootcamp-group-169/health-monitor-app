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
  Slider,
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
  Divider,
} from "@mui/material";
import {
  LocalHospital,
  TrendingUp,
  Psychology,
  Warning,
  CheckCircle,
  Info,
  CalendarToday,
  Analytics,
} from "@mui/icons-material";
import { GlassCard } from "../components/GlassCard";
import { useHealthStore } from "../store/healthStore";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  analyzeSymptoms,
  getHealthInsights,
  UserHealthProfile,
} from "../services/aiService";

const symptomTypes = [
  "bloating",
  "cramps",
  "diarrhea",
  "constipation",
  "nausea",
  "gas",
  "pain",
  "discomfort",
  "heartburn",
  "loss_of_appetite",
];

const symptomTypeLabels: { [key: string]: string } = {
  bloating: "Şişkinlik",
  cramps: "Kramp",
  diarrhea: "İshal",
  constipation: "Kabızlık",
  nausea: "Mide Bulantısı",
  gas: "Gaz",
  pain: "Ağrı",
  discomfort: "Rahatsızlık",
  heartburn: "Mide Yanması",
  loss_of_appetite: "İştahsızlık",
};

export const IntestinalTracker: React.FC = () => {
  const {
    userProfile,
    symptoms,
    addSymptom,
    removeSymptom,
    addSymptomAnalysis,
  } = useHealthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSymptomType, setSelectedSymptomType] = useState("");
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const recentSymptoms = symptoms.slice(-5);

  const handleAddSymptom = () => {
    if (!selectedSymptomType) return;

    addSymptom({
      type: selectedSymptomType,
      severity,
      date: new Date(),
      notes: notes || "",
    });

    // Reset form
    setSelectedSymptomType("");
    setSeverity(3);
    setNotes("");
  };

  const handleAnalyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      alert("Analiz için en az bir semptom kaydı gerekli.");
      return;
    }

    if (!userProfile.disease || !userProfile.age) {
      alert("Lütfen önce sağlık profilinizi tamamlayın.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const userHealthProfile: UserHealthProfile = {
        disease: userProfile.disease,
        age: userProfile.age,
        weight: userProfile.weight || 70,
        height: userProfile.height || 170,
        symptoms: symptoms.map((s) => s.type),
        dietaryRestrictions: userProfile.dietaryRestrictions || [],
        activityLevel: userProfile.activityLevel || "Hafif Aktif",
      };

      const analysis = await analyzeSymptoms(
        symptoms.map((s) => s.type),
        userHealthProfile
      );
      setCurrentAnalysis(analysis);
      setAnalysisDialogOpen(true);

      // Save analysis to store
      addSymptomAnalysis({
        symptoms: symptoms.map((s) => s.type),
        severity: analysis.severity,
        possibleCauses: analysis.possibleCauses,
        recommendations: analysis.recommendations,
        relatedFoods: analysis.relatedFoods,
        warningSigns: analysis.warningSigns,
      });
    } catch (error) {
      console.error("Symptom analysis error:", error);
      alert("Semptom analizi yapılırken bir hata oluştu.");
    } finally {
      setIsAnalyzing(false);
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
        symptoms: symptoms.map((s) => s.type),
        dietaryRestrictions: userProfile.dietaryRestrictions || [],
        activityLevel: userProfile.activityLevel || "Hafif Aktif",
      };

      const healthInsights = await getHealthInsights(
        userHealthProfile,
        [],
        symptoms
      );
      setInsights(healthInsights);
    } catch (error) {
      console.error("Health insights error:", error);
      setInsights(["Tavsiye alınamadı. Lütfen daha sonra tekrar deneyin."]);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return "#22c55e";
    if (severity <= 3) return "#f59e0b";
    return "#ef4444";
  };

  const getSeverityText = (severity: number) => {
    if (severity <= 2) return "Hafif";
    if (severity <= 3) return "Orta";
    return "Şiddetli";
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Grid container spacing={3}>
        {/* Symptom Form */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <LocalHospital sx={{ color: "#f59e0b", mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Semptom Ekle
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Semptom Türü</InputLabel>
                  <Select
                    value={selectedSymptomType}
                    onChange={(e) => setSelectedSymptomType(e.target.value)}
                    label="Semptom Türü"
                    sx={{ borderRadius: 2 }}
                  >
                    {symptomTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {symptomTypeLabels[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Şiddet Seviyesi: {getSeverityText(severity)}
                  </Typography>
                  <Slider
                    value={severity}
                    onChange={(e, value) => setSeverity(value as number)}
                    min={1}
                    max={5}
                    marks
                    valueLabelDisplay="auto"
                    sx={{
                      color: getSeverityColor(severity),
                      "& .MuiSlider-mark": {
                        backgroundColor: "#bfdbfe",
                      },
                    }}
                  />
                </Box>

                <TextField
                  label="Notlar (İsteğe bağlı)"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  onClick={handleAddSymptom}
                  disabled={!selectedSymptomType}
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Semptom Ekle
                </Button>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* AI Analysis */}
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
                Semptomlarınızı analiz ederek kişiselleştirilmiş öneriler alın.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  onClick={handleAnalyzeSymptoms}
                  disabled={isAnalyzing || symptoms.length === 0}
                  variant="outlined"
                  startIcon={
                    isAnalyzing ? <CircularProgress size={20} /> : <Analytics />
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
                  {isAnalyzing ? "Analiz Ediliyor..." : "Semptomları Analiz Et"}
                </Button>

                <Button
                  onClick={handleGetInsights}
                  disabled={isLoadingInsights}
                  variant="outlined"
                  startIcon={
                    isLoadingInsights ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Info />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    borderColor: "#22c55e",
                    color: "#22c55e",
                    "&:hover": {
                      borderColor: "#16a34a",
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                    },
                  }}
                >
                  {isLoadingInsights
                    ? "Yükleniyor..."
                    : "Sağlık Tavsiyeleri Al"}
                </Button>
              </Box>

              {insights.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    AI Tavsiyeleri
                  </Typography>
                  <List>
                    {insights.map((insight, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle
                            sx={{ color: "#22c55e", fontSize: 20 }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={insight} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Recent Symptoms and Calendar View */}
      <GlassCard sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CalendarToday sx={{ color: "#f59e0b", mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Semptom Geçmişi
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Son Semptomlar" />
            <Tab label="Takvim Görünümü" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              {recentSymptoms.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Henüz semptom kaydedilmedi
                  </Typography>
                </Grid>
              ) : (
                recentSymptoms.map((symptom) => (
                  <Grid item xs={12} sm={6} md={4} key={symptom.id}>
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
                            {symptomTypeLabels[symptom.type]}
                          </Typography>
                          <Chip
                            label={`Seviye ${symptom.severity}`}
                            size="small"
                            sx={{
                              background: getSeverityColor(symptom.severity),
                              color: "white",
                              fontSize: "0.8rem",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {format(symptom.date, "dd MMM yyyy", { locale: tr })}
                        </Typography>
                        {symptom.notes && (
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic" }}
                          >
                            "{symptom.notes}"
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                Takvim görünümü yakında eklenecek...
              </Typography>
            </Box>
          )}
        </CardContent>
      </GlassCard>

      {/* Analysis Dialog */}
      <Dialog
        open={analysisDialogOpen}
        onClose={() => setAnalysisDialogOpen(false)}
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Analytics sx={{ color: "#667eea", mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#667eea" }}>
              Semptom Analizi
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {currentAnalysis && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Şiddet Seviyesi:</strong> {currentAnalysis.severity}/5
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Olası Nedenler
                  </Typography>
                  <List>
                    {currentAnalysis.possibleCauses.map(
                      (cause: string, index: number) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Warning sx={{ color: "#f59e0b", fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary={cause} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Öneriler
                  </Typography>
                  <List>
                    {currentAnalysis.recommendations.map(
                      (rec: string, index: number) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle
                              sx={{ color: "#22c55e", fontSize: 20 }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Kaçınılması Gereken Besinler
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {currentAnalysis.relatedFoods.map(
                      (food: string, index: number) => (
                        <Chip
                          key={index}
                          label={food}
                          color="error"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      )
                    )}
                  </Box>
                </Grid>

                {currentAnalysis.warningSigns.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Dikkat Edilmesi Gereken Belirtiler
                      </Typography>
                      <List>
                        {currentAnalysis.warningSigns.map(
                          (sign: string, index: number) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Warning
                                  sx={{ color: "#ef4444", fontSize: 20 }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={sign} />
                            </ListItem>
                          )
                        )}
                      </List>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
