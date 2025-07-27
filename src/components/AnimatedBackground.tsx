import React from 'react';
import { Box, styled, keyframes } from '@mui/material';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(-180deg); }
`;

const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  zIndex: -1,
  overflow: 'hidden',
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.03)'
    : 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const Element1 = styled(FloatingElement)({
  width: 200,
  height: 200,
  top: '10%',
  left: '10%',
  animation: `${float} 6s ease-in-out infinite`,
});

const Element2 = styled(FloatingElement)({
  width: 150,
  height: 150,
  top: '60%',
  right: '15%',
  animation: `${float2} 8s ease-in-out infinite`,
});

const Element3 = styled(FloatingElement)({
  width: 100,
  height: 100,
  bottom: '20%',
  left: '20%',
  animation: `${float} 10s ease-in-out infinite`,
});

export const AnimatedBackground: React.FC = () => {
  return (
    <BackgroundContainer>
      <Element1 />
      <Element2 />
      <Element3 />
    </BackgroundContainer>
  );
};