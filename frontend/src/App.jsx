import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import Coach from "./pages/Coach";
import Dashboard from "./pages/Dashboard";
import Diet from "./pages/Diet";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Register from "./pages/Register";
import Splash from "./pages/Splash";
import Workout from "./pages/Workout";
import { useEffect, useState } from "react";
import IntroScreen from "./components/IntroScreen";

function AnimatedPage({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowIntro(false);
  }, 10000);

  return () => clearTimeout(timer);
}, []);

if (showIntro) {
  return <IntroScreen onFinish={() => setShowIntro(false)} />;
}

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/workout" element={<AnimatedPage><Workout /></AnimatedPage>} />
            <Route path="/diet" element={<AnimatedPage><Diet /></AnimatedPage>} />
            <Route path="/progress" element={<AnimatedPage><Progress /></AnimatedPage>} />
            <Route path="/coach" element={<AnimatedPage><Coach /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
