import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Fade,
  Alert,
} from '@mui/material';
import {
  Person,
  Height,
  MonitorWeight,
  Cake,
  LocalHospital,
  CheckCircle,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { useHealthStore } from '../store/healthStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';

const onboardingSchema = z.object({
  height: z.number({ required_error: 'Boy bilgisi gerekli' }).min(100, 'Boy en az 100 cm olmalı').max(250, 'Boy en fazla 250 cm olabilir'),
  weight: z.number({ required_error: 'Kilo bilgisi gerekli' }).min(30, 'Kilo en az 30 kg olmalı').max(300, 'Kilo en fazla 300 kg olabilir'),
  age: z.number({ required_error: 'Yaş bilgisi gerekli' }).min(13, 'Yaş en az 13 olmalı').max(120, 'Yaş en fazla 120 olabilir'),
  hasIntestinalDisease: z.boolean(),
  intestinalDiseaseType: z.string().optional(),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const intestinalDiseases = [
  'Crohn Hastalığı',
  'Ülseratif Kolit',
  'İrritabl Bağırsak Sendromu (IBS)',
  'Çölyak Hastalığı',
  'Gastroözofageal Reflü Hastalığı (GERD)',
  'Peptik Ülser',
  'Diğer',
];

const steps = [
  'Kişisel Bilgiler',
  'Sağlık Durumu',
  'Tamamlandı',
];

export const OnboardingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { completeOnboarding } = useAuthStore();
  const { updateUserProfile, clearAllData } = useHealthStore();
  const navigate = useNavigate();

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      height: undefined,
      weight: undefined,
      age: undefined,
      hasIntestinalDisease: false,
      intestinalDiseaseType: '',
    },
  });

  const watchHasDisease = form.watch('hasIntestinalDisease');

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      form.trigger(['height', 'weight', 'age']).then((isValid) => {
        if (isValid) {
          setActiveStep(1);
        }
      });
    } else if (activeStep === 1) {
      // Validate second step and complete onboarding
      const hasDisease = form.getValues('hasIntestinalDisease');
      if (hasDisease) {
        form.trigger(['intestinalDiseaseType']).then((isValid) => {
          if (isValid && form.getValues('intestinalDiseaseType')) {
            completeOnboarding();
            setActiveStep(2);
          }
        });
      } else {
        completeOnboarding();
        setActiveStep(2);
      }
    }
  };

  const handleComplete = () => {
    const formData = form.getValues();
    
    // Clear all existing data for new user
    clearAllData();
    
    // Save user profile
    updateUserProfile({
      height: formData.height,
      weight: formData.weight,
      age: formData.age,
      hasIntestinalDisease: formData.hasIntestinalDisease,
      intestinalDiseaseType: formData.hasIntestinalDisease ? formData.intestinalDiseaseType : undefined,
      isProfileComplete: true,
    });

    completeOnboarding();
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Kişisel Bilgileriniz
            </Typography>
            
            <Controller
              name="height"
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Boy (cm)"
                  type="number"
                  fullWidth
                  placeholder="Örn: 175"
                  InputProps={{
                    startAdornment: <Height sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!form.formState.errors.height}
                  helperText={form.formState.errors.height?.message}
                />
              )}
            />

            <Controller
              name="weight"
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kilo (kg)"
                  type="number"
                  fullWidth
                  placeholder="Örn: 70"
                  InputProps={{
                    startAdornment: <MonitorWeight sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!form.formState.errors.weight}
                  helperText={form.formState.errors.weight?.message}
                />
              )}
            />

            <Controller
              name="age"
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Yaş"
                  type="number"
                  fullWidth
                  placeholder="Örn: 25"
                  InputProps={{
                    startAdornment: <Cake sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!form.formState.errors.age}
                  helperText={form.formState.errors.age?.message}
                />
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Sağlık Durumunuz
            </Typography>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2 }}>
                Bağırsak hastalığınız var mı?
              </FormLabel>
              <Controller
                name="hasIntestinalDisease"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={field.value.toString()}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                  >
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="Hayır, bağırsak hastalığım yok"
                    />
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Evet, bağırsak hastalığım var"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {watchHasDisease && (
              <Fade in timeout={500}>
                <FormControl fullWidth>
                  <InputLabel>Hastalık Türü</InputLabel>
                  <Controller
                    name="intestinalDiseaseType"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Hastalık Türü"
                        startAdornment={<LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />}
                        error={!!form.formState.errors.intestinalDiseaseType}
                      >
                        {intestinalDiseases.map((disease) => (
                          <MenuItem key={disease} value={disease}>
                            {disease}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {form.formState.errors.intestinalDiseaseType && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      Lütfen hastalık türünü seçin
                    </Typography>
                  )}
                </FormControl>
              </Fade>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#22c55e' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
              Hoş Geldiniz!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Profiliniz başarıyla oluşturuldu. Artık sağlık takibinize başlayabilirsiniz.
            </Typography>
            <Alert severity="success" sx={{ width: '100%' }}>
              Bilgileriniz güvenli bir şekilde kaydedildi. AI asistanınız kişiselleştirilmiş öneriler sunmaya hazır!
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', p: 3 }}>
      <AnimatedBackground />
      <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
        <Fade in timeout={1000}>
          <GlassCard>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                  Profilinizi Tamamlayın
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                  Size daha iyi hizmet verebilmek için birkaç bilgiye ihtiyacımız var
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {renderStepContent()}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                {activeStep < 2 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    {activeStep === 1 ? 'Tamamla' : 'İleri'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleComplete}
                    sx={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Uygulamaya Başla
                  </Button>
                )}
              </Box>
            </CardContent>
          </GlassCard>
        </Fade>
      </Box>
    </Box>
  );
};