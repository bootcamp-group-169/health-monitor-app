import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Calendar,
  Alert,
  Fade,
} from '@mui/material';
import {
  Add,
  LocalHospital,
  TrendingUp,
  CalendarToday,
  Psychology,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard } from '../components/GlassCard';
import { useHealthStore } from '../store/healthStore';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const symptomSchema = z.object({
  type: z.string().min(1, 'Please select a symptom type'),
  severity: z.number().min(1).max(5),
  notes: z.string().optional(),
  date: z.date(),
});

type SymptomForm = z.infer<typeof symptomSchema>;

const symptomTypes = [
  'bloating',
  'stomach_pain',
  'nausea',
  'constipation',
  'diarrhea',
  'heartburn',
  'gas',
  'cramping',
];

export const IntestinalTracker: React.FC = () => {
  const [viewMode, setViewMode] = useState<'form' | 'calendar' | 'insights'>('form');
  const { symptoms, addSymptom } = useHealthStore();

  const form = useForm<SymptomForm>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      type: '',
      severity: 3,
      notes: '',
      date: new Date(),
    },
  });

  const handleSubmit = (data: SymptomForm) => {
    addSymptom(data);
    form.reset({
      type: '',
      severity: 3,
      notes: '',
      date: new Date(),
    });
  };

  const currentMonth = new Date();
  const monthSymptoms = symptoms.filter(
    symptom => 
      symptom.date >= startOfMonth(currentMonth) && 
      symptom.date <= endOfMonth(currentMonth)
  );

  const severityColors = {
    1: '#22c55e',
    2: '#84cc16',
    3: '#eab308',
    4: '#f97316',
    5: '#ef4444',
  };

  const getInsights = () => {
    if (symptoms.length === 0) return [];

    const typeCount = symptoms.reduce((acc, symptom) => {
      acc[symptom.type] = (acc[symptom.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)[0];

    const averageSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;

    return [
      `Most common symptom: ${mostCommon[0].replace('_', ' ')} (${mostCommon[1]} times)`,
      `Average severity: ${averageSeverity.toFixed(1)}/5`,
      `Total symptoms tracked: ${symptoms.length}`,
    ];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Symptom Tracker
      </Typography>

      {/* Navigation Tabs */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { id: 'form', label: 'Log Symptom', icon: <Add /> },
            { id: 'calendar', label: 'Calendar View', icon: <CalendarToday /> },
            { id: 'insights', label: 'AI Insights', icon: <Psychology /> },
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
            {/* Symptom Form */}
            <Grid item xs={12} md={6}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalHospital sx={{ color: '#f59e0b', mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Log New Symptom
                    </Typography>
                  </Box>

                  <Box
                    component="form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <Controller
                      name="type"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth error={!!fieldState.error}>
                          <InputLabel>Symptom Type</InputLabel>
                          <Select {...field} label="Symptom Type">
                            {symptomTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type.replace('_', ' ').toUpperCase()}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="severity"
                      control={form.control}
                      render={({ field }) => (
                        <Box>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            Severity: {field.value}/5
                          </Typography>
                          <Slider
                            {...field}
                            min={1}
                            max={5}
                            step={1}
                            marks
                            valueLabelDisplay="auto"
                            sx={{
                              color: severityColors[field.value as keyof typeof severityColors],
                            }}
                          />
                        </Box>
                      )}
                    />

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

                    <TextField
                      {...form.register('notes')}
                      label="Additional Notes"
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Any additional details about this symptom..."
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        py: 1.5,
                      }}
                    >
                      Log Symptom
                    </Button>
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>

            {/* Recent Symptoms */}
            <Grid item xs={12} md={6}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Symptoms
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {symptoms.slice(-5).reverse().map((symptom) => (
                      <Fade in key={symptom.id} timeout={500}>
                        <Box
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
                              label={`${symptom.severity}/5`}
                              size="small"
                              sx={{
                                background: severityColors[symptom.severity as keyof typeof severityColors],
                                color: 'white',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {format(symptom.date, 'MMM dd, yyyy HH:mm')}
                          </Typography>
                          {symptom.notes && (
                            <Typography variant="body2">
                              {symptom.notes}
                            </Typography>
                          )}
                        </Box>
                      </Fade>
                    ))}
                    {symptoms.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No symptoms logged yet
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>
          </>
        )}

        {viewMode === 'calendar' && (
          <Grid item xs={12}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Symptom Calendar - {format(currentMonth, 'MMMM yyyy')}
                </Typography>
                <Grid container spacing={2}>
                  {monthSymptoms.length > 0 ? (
                    monthSymptoms.map((symptom) => (
                      <Grid item xs={12} sm={6} md={4} key={symptom.id}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: `${severityColors[symptom.severity as keyof typeof severityColors]}20`,
                            border: `1px solid ${severityColors[symptom.severity as keyof typeof severityColors]}40`,
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'between', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {format(symptom.date, 'dd MMM')}
                            </Typography>
                            <Chip
                              label={symptom.severity}
                              size="small"
                              sx={{
                                background: severityColors[symptom.severity as keyof typeof severityColors],
                                color: 'white',
                                ml: 'auto',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {symptom.type.replace('_', ' ').toUpperCase()}
                          </Typography>
                          {symptom.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {symptom.notes}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No symptoms logged this month
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </GlassCard>
          </Grid>
        )}

        {viewMode === 'insights' && (
          <Grid item xs={12}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Psychology sx={{ color: '#667eea', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Health Insights
                  </Typography>
                </Box>
                
                {symptoms.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Health Pattern Analysis
                      </Typography>
                      {getInsights().map((insight, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                          • {insight}
                        </Typography>
                      ))}
                    </Alert>

                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Recommendations
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Consider keeping a food diary to identify potential triggers
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        • Stay hydrated and maintain regular meal times
                      </Typography>
                      <Typography variant="body2">
                        • Consult with a healthcare provider if symptoms persist
                      </Typography>
                    </Alert>

                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Progress Tracking
                      </Typography>
                      <Typography variant="body2">
                        Great job on consistently tracking your symptoms! This data will help you and your healthcare provider identify patterns and develop an effective treatment plan.
                      </Typography>
                    </Alert>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Start logging symptoms to see AI-powered insights and recommendations
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