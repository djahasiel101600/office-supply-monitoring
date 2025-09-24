import React from "react";
import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ py: 3, flexGrow: 1 }}>
        {children ?? <Outlet />}
      </Container>
    </Box>
  );
};

export default Layout;
