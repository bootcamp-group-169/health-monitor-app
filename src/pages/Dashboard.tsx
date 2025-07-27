import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  LocalHospital,
  Restaurant,
  Psychology,
  Timeline,
  CheckCircle,
  Person,
  Height,
  MonitorWeight,
  Cake,
  FitnessCenter,
} from '@mui/icons-material';
import { GlassCard } from '../components/GlassCard';
import { useHealthStore } from '../store/healthStore';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { symptoms, meals, healthPlans, userProfile } = useHealthStore();

  const recentSymptoms = symptoms.slice(-3);
  const recentMeals = meals.slice(-3);
  const todayCalories = meals
    .filter(meal => format(meal.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((total, meal) => total + meal.calories, 0);

  const statsCards = [
    {
      title: 'Today\'s Calories',
      value: todayCalories,
      target: 2000,
      icon: <Restaurant />,
      color: '#22c55e',
    },
    {
      title: 'Symptoms Tracked',
      value: symptoms.length,
      target: null,
      icon: <LocalHospital />,
      color: '#f59e0b',
    },
    {
      title: 'AI Plans Generated',
      value: healthPlans.length,
      target: null,
      icon: <Psychology />,
      color: '#667eea',
    },
    {
      title: 'Health Score',
      value: 85,
      target: 100,
      icon: <Timeline />,
      color: '#764ba2',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Sağlık Paneli
      </Typography>

      {/* User Profile Summary */}
      {(userProfile.height || userProfile.weight || userProfile.age) && (
        <GlassCard sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3,
                }}
              >
                <Person sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Profil Özeti
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Kişisel sağlık bilgileriniz
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={6} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #22c55e20 0%, #16a34a20 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)',
                    },
                  }}
                >
                  <Height sx={{ color: '#22c55e', fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Boy
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#22c55e' }}>
                    {userProfile.height}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    cm
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                    },
                  }}
                >
                  <MonitorWeight sx={{ color: '#667eea', fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Kilo
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {userProfile.weight}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f59e0b20 0%, #d97706220 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)',
                    },
                  }}
                >
                  <Cake sx={{ color: '#f59e0b', fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Yaş
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {userProfile.age}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    yıl
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #8b5cf620 0%, #a855f720 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)',
                    },
                  }}
                >
                  <FitnessCenter sx={{ color: '#8b5cf6', fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    BMI
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                    {userProfile.height && userProfile.weight 
                      ? ((userProfile.weight) / Math.pow((userProfile.height) / 100, 2)).toFixed(1)
                      : 'N/A'
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kg/m²
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {userProfile.hasIntestinalDisease && (
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ef444420 0%, #dc262620 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <LocalHospital sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Bağırsak Hastalığı
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#ef4444' }}>
                      {userProfile.intestinalDiseaseType}
                    </Typography>
                  </Box>
                  <Chip
                    label="Aktif Takip"
                    size="small"
                    sx={{
                      background: '#ef4444',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </GlassCard>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                  {stat.target && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      /{stat.target}
                    </Typography>
                  )}
                </Typography>
                {stat.target && (
                  <LinearProgress
                    variant="determinate"
                    value={(stat.value / stat.target) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${stat.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stat.color,
                      },
                    }}
                  />
                )}
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Symptoms */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalHospital sx={{ color: '#f59e0b', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Son Belirtiler
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentSymptoms.length > 0 ? (
                  recentSymptoms.map((symptom) => (
                    <Box
                      key={symptom.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {symptom.type.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Chip
                          label={`Severity: ${symptom.severity}/5`}
                          size="small"
                          sx={{
                            background: `hsl(${120 - (symptom.severity * 24)}, 70%, 50%)`,
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {format(symptom.date, 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2">
                        {symptom.notes}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Henüz belirtilenmiş semptom yok
                  </Typography>
                )}
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Recent Meals */}
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Restaurant sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Son Öğünler
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentMeals.length > 0 ? (
                  recentMeals.map((meal) => (
                    <Box
                      key={meal.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Avatar
                        src={meal.image}
                        sx={{ width: 48, height: 48 }}
                      >
                        <Restaurant />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {meal.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {meal.calories} kcal • {meal.protein}g protein
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(meal.date, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Henüz kaydedilmiş öğün yok
                  </Typography>
                )}
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Health Plans */}
        <Grid item xs={12}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Psychology sx={{ color: '#667eea', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Aktif Sağlık Planları
                </Typography>
              </Box>
              {healthPlans.length > 0 ? (
                <Grid container spacing={2}>
                  {healthPlans.map((plan) => (
                    <Grid item xs={12} md={6} key={plan.id}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={plan.type.toUpperCase()}
                            size="small"
                            sx={{
                              background: plan.type === 'diet' ? '#22c55e' : '#667eea',
                              color: 'white',
                              mr: 2,
                            }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {plan.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {plan.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {plan.items.slice(0, 3).map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#22c55e' }} />
                              <Typography variant="body2">{item}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Henüz sağlık planı oluşturulmamış. İlk planınızı oluşturmak için AI Asistanı ziyaret edin!
                </Typography>
              )}
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};