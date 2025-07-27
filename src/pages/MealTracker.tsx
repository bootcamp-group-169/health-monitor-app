import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fade,
} from '@mui/material';
import {
  Add,
  Restaurant,
  TrendingUp,
  Psychology,
  LocalFireDepartment,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard } from '../components/GlassCard';
import { useHealthStore } from '../store/healthStore';
import { format } from 'date-fns';

const mealSchema = z.object({
  name: z.string().min(1, 'Please enter a meal name'),
  calories: z.number({ required_error: 'Kalori bilgisi gerekli' }).min(1, 'Kalori 0\'dan büyük olmalı'),
  protein: z.number({ required_error: 'Protein bilgisi gerekli' }).min(0, 'Protein negatif olamaz'),
  carbs: z.number({ required_error: 'Karbonhidrat bilgisi gerekli' }).min(0, 'Karbonhidrat negatif olamaz'),
  fats: z.number({ required_error: 'Yağ bilgisi gerekli' }).min(0, 'Yağ negatif olamaz'),
  date: z.date(),
});

type MealForm = z.infer<typeof mealSchema>;

const foodSuggestions = [
  { name: 'Grilled Chicken Breast', calories: 231, protein: 43, carbs: 0, fats: 5 },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fats: 0 },
  { name: 'Quinoa Bowl', calories: 222, protein: 8, carbs: 39, fats: 4 },
  { name: 'Salmon Fillet', calories: 206, protein: 22, carbs: 0, fats: 12 },
  { name: 'Avocado Toast', calories: 195, protein: 6, carbs: 16, fats: 14 },
];

const sampleImages = [
  'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  'https://images.pexels.com/photos/1209029/pexels-photo-1209029.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
];

export const MealTracker: React.FC = () => {
  const [viewMode, setViewMode] = useState<'form' | 'history' | 'analysis'>('form');
  const { meals, addMeal } = useHealthStore();

  const form = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      calories: undefined,
      protein: undefined,
      carbs: undefined,
      fats: undefined,
      date: new Date(),
    },
  });

  const handleSubmit = (data: MealForm) => {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    addMeal({ ...data, image: randomImage });
    form.reset({
      name: '',
      calories: undefined,
      protein: undefined,
      carbs: undefined,
      fats: undefined,
      date: new Date(),
    });
  };

  const handleQuickAdd = (suggestion: typeof foodSuggestions[0]) => {
    form.setValue('name', suggestion.name);
    form.setValue('calories', suggestion.calories);
    form.setValue('protein', suggestion.protein);
    form.setValue('carbs', suggestion.carbs);
    form.setValue('fats', suggestion.fats);
  };

  const todayMeals = meals.filter(
    meal => format(meal.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const todayTotals = todayMeals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const targets = { calories: 2000, protein: 150, carbs: 250, fats: 65 };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Meal Tracker
      </Typography>

      {/* Navigation Tabs */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { id: 'form', label: 'Log Meal', icon: <Add /> },
            { id: 'history', label: 'Meal History', icon: <Restaurant /> },
            { id: 'analysis', label: 'AI Analysis', icon: <Psychology /> },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={viewMode === tab.id ? 'contained' : 'outlined'}
              startIcon={tab.icon}
              onClick={() => setViewMode(tab.id as any)}
              sx={{
                ...(viewMode === tab.id && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }),
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {viewMode === 'form' && (
          <>
            {/* Meal Form */}
            <Grid item xs={12} md={6}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Restaurant sx={{ color: '#22c55e', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Log New Meal
                    </Typography>
                  </Box>

                  {/* Quick Add Suggestions */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Quick Add:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {foodSuggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion.name}
                          onClick={() => handleQuickAdd(suggestion)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box
                    component="form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <TextField
                      {...form.register('name')}
                      label="Meal Name"
                      fullWidth
                      error={!!form.formState.errors.name}
                      helperText={form.formState.errors.name?.message}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Controller
                          name="calories"
                          control={form.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Calories"
                              type="number"
                              fullWidth
                             placeholder="Örn: 350"
                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              error={!!form.formState.errors.calories}
                              helperText={form.formState.errors.calories?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="protein"
                          control={form.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Protein (g)"
                              type="number"
                              fullWidth
                             placeholder="Örn: 25"
                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              error={!!form.formState.errors.protein}
                              helperText={form.formState.errors.protein?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="carbs"
                          control={form.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Carbs (g)"
                              type="number"
                              fullWidth
                             placeholder="Örn: 45"
                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              error={!!form.formState.errors.carbs}
                              helperText={form.formState.errors.carbs?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="fats"
                          control={form.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Fats (g)"
                              type="number"
                              fullWidth
                             placeholder="Örn: 12"
                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              error={!!form.formState.errors.fats}
                              helperText={form.formState.errors.fats?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Controller
                      name="date"
                      control={form.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="datetime-local"
                          label="Date & Time"
                          fullWidth
                          value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      sx={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        py: 1.5,
                      }}
                    >
                      Log Meal
                    </Button>
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>

            {/* Daily Progress */}
            <Grid item xs={12} md={6}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUp sx={{ color: '#667eea', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Today's Progress
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {Object.entries(targets).map(([key, target]) => {
                      const current = todayTotals[key as keyof typeof todayTotals];
                      const percentage = Math.min((current / target) * 100, 100);
                      
                      return (
                        <Grid item xs={6} key={key}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {key}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {current}/{target}{key === 'calories' ? '' : 'g'}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: percentage >= 90 ? '#22c55e' : '#667eea',
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Today's Meals
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {todayMeals.length > 0 ? (
                        todayMeals.map((meal) => (
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
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Restaurant sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {meal.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {meal.calories} kcal • {meal.protein}g protein
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {format(meal.date, 'HH:mm')}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          No meals logged today
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>
          </>
        )}

        {viewMode === 'history' && (
          <Grid item xs={12}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Meal History
                </Typography>
                <Grid container spacing={2}>
                  {meals.length > 0 ? (
                    meals.slice().reverse().map((meal) => (
                      <Grid item xs={12} sm={6} md={4} key={meal.id}>
                        <Fade in timeout={500}>
                          <Card
                            sx={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            {meal.image && (
                              <CardMedia
                                component="img"
                                height="140"
                                image={meal.image}
                                alt={meal.name}
                              />
                            )}
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {meal.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {format(meal.date, 'MMM dd, yyyy HH:mm')}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                  <Typography variant="body2">
                                    <LocalFireDepartment sx={{ fontSize: 16, mr: 0.5, color: '#f59e0b' }} />
                                    {meal.calories} kcal
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Fade>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No meals logged yet
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </GlassCard>
          </Grid>
        )}

        {viewMode === 'analysis' && (
          <Grid item xs={12}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Psychology sx={{ color: '#667eea', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Nutrition Analysis
                  </Typography>
                </Box>
                
                {meals.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Nutrition Overview
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Average daily calories: {Math.round(meals.reduce((sum, m) => sum + m.calories, 0) / meals.length)} kcal
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Average protein intake: {Math.round(meals.reduce((sum, m) => sum + m.protein, 0) / meals.length)}g per meal
                      </Typography>
                      <Typography variant="body2">
                        • Total meals logged: {meals.length}
                      </Typography>
                    </Alert>

                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Recommendations
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Your protein intake looks good! Keep including lean proteins in each meal
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Consider adding more colorful vegetables for increased antioxidants
                      </Typography>
                      <Typography variant="body2">
                        • Stay consistent with your meal timing for better metabolism
                      </Typography>
                    </Alert>

                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Areas for Improvement
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Try to include more fiber-rich foods like whole grains and legumes
                      </Typography>
                      <Typography variant="body2">
                        • Consider adding healthy fats from sources like avocados and nuts
                      </Typography>
                    </Alert>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Start logging meals to see AI-powered nutrition analysis and recommendations
                  </Typography>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};