import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Wallet from "@/pages/Wallet";
import Tasks from "@/pages/Tasks";
import Offers from "@/pages/Offers";
import AdsWall from "@/pages/AdsWall";
import Surveys from "@/pages/Surveys";
import VIP from "@/pages/VIP";
import Referral from "@/pages/Referral";
import Admin from "@/pages/Admin";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
                <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                <Route path="/offers" element={<PrivateRoute><Offers /></PrivateRoute>} />
                <Route path="/ads" element={<PrivateRoute><AdsWall /></PrivateRoute>} />
                <Route path="/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
                <Route path="/vip" element={<PrivateRoute><VIP /></PrivateRoute>} />
                <Route path="/referral" element={<PrivateRoute><Referral /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
