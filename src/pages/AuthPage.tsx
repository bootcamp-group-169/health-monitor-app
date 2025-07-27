import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Card,
  CardContent,
  Fade,
  CircularProgress,
} from '@mui/material';
import {
  Psychology,
  Security,
  Timeline,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      console.log('Login attempt:', data);
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      console.log('Register attempt:', data);
      await register(data.name, data.email, data.password);
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Psychology />,
      title: 'AI Health Assistant',
      description: 'Get personalized health insights and recommendations powered by advanced AI',
    },
    {
      icon: <Timeline />,
      title: 'Health Tracking',
      description: 'Monitor your symptoms, meals, and progress with beautiful visualizations',
    },
    {
      icon: <Security />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with enterprise-grade security',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <AnimatedBackground />
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left Side - Branding */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', alignItems: 'center', p: 4 }}
        >
          <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  HealthMonitor
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 4,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Your AI-powered health companion for a better lifestyle.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {features.map((feature, index) => (
                    <Fade in timeout={1000 + index * 200} key={index}>
                      <GlassCard>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                              }}
                            >
                              {feature.icon}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </GlassCard>
                    </Fade>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Box>
        </Grid>

        {/* Right Side - Auth Forms */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', alignItems: 'center', p: 4 }}
        >
          <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
            <Fade in timeout={1200}>
              <GlassCard>
                <Box sx={{ p: 4 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 4 }}
                    variant="fullWidth"
                  >
                    <Tab
                      icon={<Login />}
                      label="Login"
                      iconPosition="start"
                    />
                    <Tab
                      icon={<PersonAdd />}
                      label="Register"
                      iconPosition="start"
                    />
                  </Tabs>

                  {activeTab === 0 ? (
                    <Box
                      component="form"
                      onSubmit={loginForm.handleSubmit(handleLogin)}
                      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                    >
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        {...loginForm.register('email')}
                        error={!!loginForm.formState.errors.email}
                        helperText={loginForm.formState.errors.email?.message}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        {...loginForm.register('password')}
                        error={!!loginForm.formState.errors.password}
                        helperText={loginForm.formState.errors.password?.message}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          },
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      component="form"
                      onSubmit={registerForm.handleSubmit(handleRegister)}
                      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                    >
                      <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        {...registerForm.register('name')}
                        error={!!registerForm.formState.errors.name}
                        helperText={registerForm.formState.errors.name?.message}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        {...registerForm.register('email')}
                        error={!!registerForm.formState.errors.email}
                        helperText={registerForm.formState.errors.email?.message}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        {...registerForm.register('password')}
                        error={!!registerForm.formState.errors.password}
                        helperText={registerForm.formState.errors.password?.message}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          },
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </GlassCard>
            </Fade>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};