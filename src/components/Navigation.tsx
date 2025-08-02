import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Switch,
} from "@mui/material";
import {
  Dashboard,
  Psychology,
  LocalHospital,
  Restaurant,
  Settings,
  Logout,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { GlassCard } from "./GlassCard";

const drawerWidth = 240;

export const Navigation: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Ana Sayfa", icon: <Dashboard /> },
    { path: "/ai-assistant", label: "AI Asistan", icon: <Psychology /> },
    {
      path: "/intestinal-tracker",
      label: "Semptom Takibi",
      icon: <LocalHospital />,
    },
    { path: "/meal-tracker", label: "Yemek Takibi", icon: <Restaurant /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "transparent",
          border: "none",
          padding: 0,
        },
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", height: "100%", p: 0 }}
      >
        <GlassCard sx={{ mb: 0.5, p: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={user?.avatar} sx={{ width: 35, height: 35 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: "0.8rem" }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </GlassCard>

        <GlassCard sx={{ flex: 1, p: 0.25 }}>
          <List sx={{ py: 0 }}>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1,
                    mx: 0.5,
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 40,
                      "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </GlassCard>

        <GlassCard sx={{ mt: 0.5, p: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.8rem" }}
            >
              Tema
            </Typography>
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#667eea",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#667eea",
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isDark ? (
              <DarkMode sx={{ fontSize: 16 }} />
            ) : (
              <LightMode sx={{ fontSize: 16 }} />
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem" }}
            >
              {isDark ? "Karanlık" : "Aydınlık"} Mod
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={logout}
              sx={{
                color: "#ef4444",
              }}
            >
              <Logout sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem" }}
            >
              Çıkış Yap
            </Typography>
          </Box>
        </GlassCard>
      </Box>
    </Drawer>
  );
};
