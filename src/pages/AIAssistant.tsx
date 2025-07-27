import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Fade,
} from '@mui/material';
import {
  Send,
  Psychology,
  Restaurant,
  FitnessCenter,
  CheckCircle,
  AutoAwesome,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { GlassCard } from '../components/GlassCard';
import { useHealthStore } from '../store/healthStore';
import { format } from 'date-fns';

interface MessageForm {
  message: string;
}

interface PlanForm {
  preferences: string;
}

export const AIAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState<'diet' | 'fitness' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatMessages, healthPlans, userProfile, addChatMessage, generateHealthPlan } = useHealthStore();

  const messageForm = useForm<MessageForm>({
    defaultValues: { message: '' },
  });

  const dietForm = useForm<PlanForm>({
    defaultValues: { preferences: '' },
  });

  const fitnessForm = useForm<PlanForm>({
    defaultValues: { preferences: '' },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Add welcome message when component mounts and no messages exist
  useEffect(() => {
    if (chatMessages.length === 0) {
      const welcomeMessage = userProfile.hasIntestinalDisease 
        ? `Merhaba! Ben AI Sağlık Asistanınızım. ${userProfile.intestinalDiseaseType} ile ilgili size nasıl yardımcı olabilirim?`
        : 'Merhaba! Ben AI Sağlık Asistanınızım. Sağlığınız hakkında size nasıl yardımcı olabilirim?';
      
      addChatMessage({
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date(),
      });
    }
  }, [chatMessages.length, userProfile, addChatMessage]);

  const handleSendMessage = async (data: MessageForm) => {
    if (!data.message.trim()) return;

    addChatMessage({
      type: 'user',
      content: data.message,
      timestamp: new Date(),
    });

    messageForm.reset();
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your health data, I recommend focusing on reducing inflammation through your diet. Consider incorporating more omega-3 rich foods like salmon and walnuts.",
        "Your symptom patterns suggest you might benefit from a gut-friendly diet. I can help you create a personalized plan with probiotics and fiber-rich foods.",
        "I notice you've been tracking symptoms regularly. This is great! Based on the data, I recommend discussing these patterns with your healthcare provider.",
        "Your meal tracking shows good protein intake. To optimize your nutrition, consider adding more colorful vegetables for additional antioxidants.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addChatMessage({
        type: 'ai',
        content: randomResponse,
        timestamp: new Date(),
      });
      setLoading(false);
    }, 1000);
  };

  const handleGeneratePlan = async (type: 'diet' | 'fitness', data: PlanForm) => {
    if (!data.preferences.trim()) return;

    setGeneratingPlan(type);
    await generateHealthPlan(type, data.preferences);
    setGeneratingPlan(null);
    
    if (type === 'diet') {
      dietForm.reset();
    } else {
      fitnessForm.reset();
    }
  };

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        AI Health Assistant
      </Typography>

      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        {/* Chat Interface */}
        <Grid item xs={12} md={8}>
          <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Psychology />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Health Assistant
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your personal health companion
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
              {chatMessages.map((message) => (
                <Fade in key={message.id} timeout={500}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        background: message.type === 'user'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: message.type === 'user' ? 'white' : 'inherit',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          mt: 1,
                          display: 'block',
                        }}
                      >
                        {format(message.timestamp, 'HH:mm')}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Paper
                    sx={{
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                      AI is thinking...
                    </Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box
              component="form"
              onSubmit={messageForm.handleSubmit(handleSendMessage)}
              sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Ask me anything about your health..."
                  variant="outlined"
                  {...messageForm.register('message')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    minWidth: 56,
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </GlassCard>
        </Grid>

        {/* Plan Generation */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            {/* Diet Plan Generator */}
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Restaurant sx={{ color: '#22c55e', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Generate Diet Plan
                  </Typography>
                </Box>
                <Box
                  component="form"
                  onSubmit={dietForm.handleSubmit((data) => handleGeneratePlan('diet', data))}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Tell me your dietary preferences, allergies, and goals..."
                    variant="outlined"
                    {...dietForm.register('preferences')}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={generatingPlan === 'diet'}
                    startIcon={generatingPlan === 'diet' ? <CircularProgress size={20} /> : <AutoAwesome />}
                    sx={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      },
                    }}
                  >
                    {generatingPlan === 'diet' ? 'Generating...' : 'Generate Plan'}
                  </Button>
                </Box>
              </CardContent>
            </GlassCard>

            {/* Fitness Plan Generator */}
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenter sx={{ color: '#667eea', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Generate Fitness Plan
                  </Typography>
                </Box>
                <Box
                  component="form"
                  onSubmit={fitnessForm.handleSubmit((data) => handleGeneratePlan('fitness', data))}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe your fitness level, goals, and available equipment..."
                    variant="outlined"
                    {...fitnessForm.register('preferences')}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={generatingPlan === 'fitness'}
                    startIcon={generatingPlan === 'fitness' ? <CircularProgress size={20} /> : <AutoAwesome />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {generatingPlan === 'fitness' ? 'Generating...' : 'Generate Plan'}
                  </Button>
                </Box>
              </CardContent>
            </GlassCard>

            {/* Generated Plans */}
            {healthPlans.length > 0 && (
              <GlassCard sx={{ flex: 1 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Your Plans
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {healthPlans.slice(-2).map((plan) => (
                      <Fade in key={plan.id} timeout={500}>
                        <Box
                          sx={{
                            p: 2,
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {plan.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {plan.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {plan.items.slice(0, 2).map((item, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <CheckCircle sx={{ fontSize: 16, color: '#22c55e', mt: 0.5 }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {item}
                                </Typography>
                              </Box>
                            ))}
                            {plan.items.length > 2 && (
                              <Typography variant="body2" color="text.secondary">
                                +{plan.items.length - 2} more items
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </CardContent>
              </GlassCard>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};