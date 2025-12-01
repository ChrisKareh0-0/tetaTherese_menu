import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, MessageCircle, MapPin, Mail } from 'lucide-react';
import Background from './components/Background';
import MenuButton from './components/MenuButton';
import PdfMenuViewer from './components/PdfMenuViewer';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'menu'

  const handleNavigation = (type) => {
    switch (type) {
      case 'menu':
        setView('menu');
        break;
      case 'whatsapp':
        window.open('https://wa.me/1234567890', '_blank');
        break;
      case 'direction':
        window.open('https://maps.google.com', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:contact@example.com';
        break;
      default:
        break;
    }
  };

  const buttons = [
    {
      id: 'menu',
      label: 'Our Menu',
      icon: Utensils,
      color: 'bg-brand-light/10 hover:bg-brand-light/20 border-brand-light/20 text-brand-light',
      action: () => handleNavigation('menu')
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-brand-light/10 hover:bg-brand-light/20 border-brand-light/20 text-brand-light',
      action: () => handleNavigation('whatsapp')
    },
    {
      id: 'email',
      label: 'Email Us',
      icon: Mail,
      color: 'bg-brand-light/10 hover:bg-brand-light/20 border-brand-light/20 text-brand-light',
      action: () => handleNavigation('email')
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <Background />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md flex flex-col items-center z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12 text-center flex flex-col items-center"
            >
              {/* 
                INSTRUCTIONS:
                1. Place your logo file in the 'public' folder.
                2. Rename it to 'logo.png' (or update the src below).
              */}
              <img
                src="/logo.png"
                alt="Teta Menu Logo"
                className="w-48 h-auto mb-4 drop-shadow-lg"
              />
              <p className="text-white/60 text-lg font-light tracking-widest uppercase">
                Experience the Taste
              </p>
            </motion.div>

            <div className="w-full flex flex-col gap-2">
              {buttons.map((btn, index) => (
                <MenuButton
                  key={btn.id}
                  icon={btn.icon}
                  label={btn.label}
                  onClick={btn.action}
                  delay={index * 0.1 + 0.3}
                  color={btn.color}
                />
              ))}
            </div>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-6 text-white/30 text-sm font-light"
            >
              © 2024 Teta Therese. All rights reserved.
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'menu' && (
          <PdfMenuViewer key="pdf-viewer" onBack={() => setView('home')} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
