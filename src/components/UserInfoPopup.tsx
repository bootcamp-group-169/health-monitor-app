import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useHealthStore } from "../store/healthStore";
import { useAuthStore } from "../store/authStore";

const formSchema = z.object({
  height: z
    .number()
    .min(100, "Boy en az 100 cm olmalıdır")
    .max(250, "Boy en fazla 250 cm olmalıdır"),
  weight: z
    .number()
    .min(30, "Kilo en az 30 kg olmalıdır")
    .max(300, "Kilo en fazla 300 kg olmalıdır"),
  age: z
    .number()
    .min(1, "Yaş en az 1 olmalıdır")
    .max(120, "Yaş en fazla 120 olmalıdır"),
  disease: z.string().min(1, "Lütfen hastalık türünü seçin"),
  dietaryRestrictions: z
    .array(z.string())
    .min(1, "En az bir diyet kısıtlaması seçin"),
  activityLevel: z.string().min(1, "Lütfen aktivite seviyesini seçin"),
});

type FormData = z.infer<typeof formSchema>;

interface UserInfoPopupProps {
  open: boolean;
  onClose: () => void;
}

const diseaseTypes = [
  "İrritabl Bağırsak Sendromu (IBS)",
  "Crohn Hastalığı",
  "Ülseratif Kolit",
  "Çölyak Hastalığı",
  "Laktoz İntoleransı",
  "FODMAP Hassasiyeti",
  "Gastrit",
  "Reflü",
  "Divertikülit",
  "Diğer",
];

const dietaryRestrictions = [
  "Gluten",
  "Laktoz",
  "FODMAP",
  "Yağlı Yiyecekler",
  "Baharatlı Yiyecekler",
  "Kafein",
  "Alkol",
  "Gazlı İçecekler",
  "İşlenmiş Gıdalar",
  "Süt Ürünleri",
  "Yumurta",
  "Fındık",
  "Deniz Ürünleri",
  "Soya",
];

const activityLevels = [
  "Hareketsiz (Günlük aktivite yok)",
  "Hafif Aktif (Haftada 1-3 gün egzersiz)",
  "Orta Aktif (Haftada 3-5 gün egzersiz)",
  "Çok Aktif (Haftada 6-7 gün egzersiz)",
  "Aşırı Aktif (Günde 2+ kez egzersiz)",
];

export const UserInfoPopup: React.FC<UserInfoPopupProps> = ({
  open,
  onClose,
}) => {
  const { setUserProfile } = useHealthStore();
  const { completeFirstLogin } = useAuthStore();
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: undefined,
      weight: undefined,
      age: undefined,
      disease: "",
      dietaryRestrictions: [],
      activityLevel: "",
    },
  });

  const watchedDisease = watch("disease");
  const watchedRestrictions = watch("dietaryRestrictions");

  const steps = [
    "Temel Bilgiler",
    "Hastalık Profili",
    "Diyet Kısıtlamaları",
    "Aktivite Seviyesi",
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = (data: FormData) => {
    setUserProfile({
      height: data.height,
      weight: data.weight,
      age: data.age,
      disease: data.disease,
      dietaryRestrictions: data.dietaryRestrictions,
      activityLevel: data.activityLevel,
    });

    // Mark first login as complete
    completeFirstLogin();

    onClose();
    setActiveStep(0);
  };

  const handleRestrictionToggle = (restriction: string) => {
    const current = watchedRestrictions || [];
    if (current.includes(restriction)) {
      setValue(
        "dietaryRestrictions",
        current.filter((r) => r !== restriction)
      );
    } else {
      setValue("dietaryRestrictions", [...current, restriction]);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#667eea" }}>
              Temel Sağlık Bilgileriniz
            </Typography>

            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Boy (cm)"
                  type="number"
                  fullWidth
                  error={!!errors.height}
                  helperText={errors.height?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  InputProps={{
                    style: { borderRadius: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kilo (kg)"
                  type="number"
                  fullWidth
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  InputProps={{
                    style: { borderRadius: 12 },
                  }}
                />
              )}
            />

            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Yaş"
                  type="number"
                  fullWidth
                  error={!!errors.age}
                  helperText={errors.age?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  InputProps={{
                    style: { borderRadius: 12 },
                  }}
                />
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#667eea" }}>
              Bağırsak Hastalığı Türü
            </Typography>

            <Controller
              name="disease"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.disease}>
                  <InputLabel>Hastalık Türü</InputLabel>
                  <Select
                    {...field}
                    label="Hastalık Türü"
                    style={{ borderRadius: 12 }}
                  >
                    {diseaseTypes.map((disease) => (
                      <MenuItem key={disease} value={disease}>
                        {disease}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.disease && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.disease.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {watchedDisease && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>{watchedDisease}</strong> seçtiniz. Bu bilgi size özel
                  beslenme ve fitness planları oluşturmak için kullanılacak.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#667eea" }}>
              Diyet Kısıtlamalarınız
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Size rahatsızlık veren besinleri seçin (birden fazla
              seçebilirsiniz):
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {dietaryRestrictions.map((restriction) => (
                <Chip
                  key={restriction}
                  label={restriction}
                  onClick={() => handleRestrictionToggle(restriction)}
                  color={
                    watchedRestrictions?.includes(restriction)
                      ? "primary"
                      : "default"
                  }
                  variant={
                    watchedRestrictions?.includes(restriction)
                      ? "filled"
                      : "outlined"
                  }
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>

            {errors.dietaryRestrictions && (
              <Typography variant="caption" color="error">
                {errors.dietaryRestrictions.message}
              </Typography>
            )}

            {watchedRestrictions && watchedRestrictions.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Seçilen kısıtlamalar:{" "}
                  <strong>{watchedRestrictions.join(", ")}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#667eea" }}>
              Aktivite Seviyeniz
            </Typography>

            <Controller
              name="activityLevel"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.activityLevel}>
                  <InputLabel>Aktivite Seviyesi</InputLabel>
                  <Select
                    {...field}
                    label="Aktivite Seviyesi"
                    style={{ borderRadius: 12 }}
                  >
                    {activityLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.activityLevel && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.activityLevel.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(102, 126, 234, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Bu bilgi size özel fitness planları oluşturmak için
                kullanılacak. Hastalığınıza uygun egzersiz önerileri
                alacaksınız.
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#667eea" }}>
          Sağlık Profilinizi Oluşturun
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Size özel beslenme ve fitness planları için bilgilerinizi girin
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent(activeStep)}
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ borderRadius: 2 }}
          >
            Geri
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  px: 4,
                }}
              >
                Profili Tamamla
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  px: 4,
                }}
              >
                İleri
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
