import React from "react";
import { Card, CardProps, styled } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(30, 41, 59, 0.8)"
      : "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 12,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 16px rgba(0, 0, 0, 0.2)"
      : "0 4px 16px rgba(103, 126, 234, 0.1)",
}));

interface GlassCardProps extends CardProps {
  children: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledCard ref={ref} {...props}>
        {children}
      </StyledCard>
    );
  }
);
