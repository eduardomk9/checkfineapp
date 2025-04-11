import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";
import { getAllowedMenuItems } from "../utils/permissions";
import { SnackbarProvider } from "../contexts/SnackbarContext"; // Import the provider

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
    handleMenuClose();
  };

  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "??";
  const userProfiles = user?.memberOf.map((m) => m.name) || [];
  const allowedMenuItems = getAllowedMenuItems(userProfiles);

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Divider />
      <List>
        {allowedMenuItems.map((item) => (
          <ListItem
            key={item.text}
            component="a"
            href={item.path}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: "#CFD8DC",
              color: "#333333",
              textDecoration: "none",
              "&:hover": { bgcolor: "#B0BEC5", color: "#333333" },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <SnackbarProvider> {/* Wrap the entire layout */}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: "white",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: { xs: "100%", sm: `calc(100% - ${drawerOpen ? 250 : 0}px)` },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ color: "text.primary" }}>
              Checkfine
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={isMobile ? handleDrawerToggle : handleMenuOpen}>
              <Avatar sx={{ bgcolor: "#B0BEC5", color: "text.primary" }}>{userInitials}</Avatar>
            </IconButton>
            {!isMobile && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            )}
          </Toolbar>
        </AppBar>

        {!isMobile ? (
          <Drawer
            variant="permanent"
            sx={{
              width: 250,
              flexShrink: 0,
              "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box", mt: "64px", bgcolor: "#F5F5F5" },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
            <Box sx={{ width: 250 }}>
              <List>
                <ListItem>
                  <Avatar sx={{ bgcolor: "#B0BEC5", mr: 2 }}>{userInitials}</Avatar>
                  <Typography>{user?.mail}</Typography>
                </ListItem>
                <Divider />
                {allowedMenuItems.map((item) => (
                  <ListItem
                    key={item.text}
                    component="a"
                    href={item.path}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: "#CFD8DC",
                      color: "#333333",
                      textDecoration: "none",
                      "&:hover": { bgcolor: "#B0BEC5", color: "#333333" },
                    }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
                <Divider />
                <ListItem onClick={handleMenuClose}><ListItemText primary="Perfil" /></ListItem>
                <ListItem onClick={handleLogout}><ListItemText primary="Sair" /></ListItem>
              </List>
            </Box>
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 0, sm: 3 },
            mt: { xs: "56px", sm: "64px" },
            width: { xs: "100%", sm: "calc(100% - 250px)" },
            minHeight: "calc(100vh - 56px)",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </SnackbarProvider>
  );
};

export default Layout;