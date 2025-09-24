import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthContext";
import { useContext } from "react";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Define menu items for authenticated and unauthenticated users
  const isAuthenticated = !!auth?.user;

  const menuItems = isAuthenticated
    ? [
        { text: "Dashboard", path: "/" },
        { text: "Supplies", path: "/supplies" },
        { text: "Transactions", path: "/transactions" },
        { text: "Categories", path: "/categories" },
        {
          text: "Logout",
          action: () => {
            auth.logout();
            navigate("/login");
          },
        },
      ]
    : [{ text: "Login", path: "/login" }];

  const handleMenuClick = (item: any) => {
    setDrawerOpen(false);
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Office Supply Monitoring
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{
                  width: 220,
                  pt: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                role="presentation"
                onClick={() => setDrawerOpen(false)}
                onKeyDown={() => setDrawerOpen(false)}
              >
                <Typography variant="h6" sx={{ px: 2, pb: 1, fontWeight: 600 }}>
                  Menu
                </Typography>
                <Divider />
                <List>
                  {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        selected={
                          !!(item.path && location.pathname === item.path)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuClick(item);
                        }}
                      >
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                sx={{
                  backgroundColor:
                    item.path && location.pathname === item.path
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
