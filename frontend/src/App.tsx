import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Supplies from "./pages/Supplies";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import { useContext } from "react";
import { AuthContext } from "./providers/AuthContext";
import { Navigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const auth = useContext(AuthContext);
  const [loggedInStatus, setLoggedInStatus] = useState(false);
  useEffect(() => {
    auth?.user ? setLoggedInStatus(true) : setLoggedInStatus(false);
  }, [auth]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          {/* Protected routes */}
          <Route
            path="/*"
            element={
              loggedInStatus === true ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/supplies" element={<Supplies />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/categories" element={<Categories />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
