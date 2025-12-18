import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, MessageCircle, Tag } from 'lucide-react';
import Background from './components/Background';
import MenuButton from './components/MenuButton';
import PdfMenuViewer from './components/PdfMenuViewer';
import OffersStoriesViewer from './components/OffersStoriesViewer';
import { OFFERS_STORIES } from './data/offers';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'menu' | 'offers'

  const handleNavigation = (type) => {
    switch (type) {
      case 'menu':
        setView('menu');
        break;
      case 'offers':
        setView('offers');
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
      id: 'offers',
      label: 'Offers',
      icon: Tag,
      color: 'bg-brand-light/10 hover:bg-brand-light/20 border-brand-light/20 text-brand-light',
      action: () => handleNavigation('offers')
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-brand-light/10 hover:bg-brand-light/20 border-brand-light/20 text-brand-light',
      action: () => handleNavigation('whatsapp')
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

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-12 text-center space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-brand-light font-bold text-sm uppercase tracking-wider">Delivery Areas</h3>
                <p className="text-white/80 text-sm font-light leading-relaxed max-w-xs mx-auto">
                  Halat, Fidar, Jbeil, Mastita, Blat, Hboub, Amchit
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-brand-light font-bold text-sm uppercase tracking-wider">Operating Hours</h3>
                <p className="text-white/80 text-sm font-light">
                  9:00 AM - 5:00 PM
                </p>
              </div>
            </motion.div>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-6 text-white/30 text-sm font-light"
            >
              © 2025 Teta Therese. All rights reserved.
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'menu' && (
          <PdfMenuViewer key="pdf-viewer" onBack={() => setView('home')} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'offers' && (
          <OffersStoriesViewer
            key="offers-viewer"
            stories={OFFERS_STORIES}
            onBack={() => setView('home')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
