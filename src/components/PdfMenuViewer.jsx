import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const PdfMenuViewer = ({ onBack }) => {
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const checkIsIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(checkIsIOS);
    }, []);

    // iOS: Show toolbar (remove hiding params), view=Fit to zoom out
    // Others: Hide toolbar, view=FitH
    const pdfUrl = isIOS
        ? "/menu.pdf#view=Fit"
        : "/menu.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH";

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl overflow-hidden flex flex-col"
        >
            {/* Floating Back Button */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-3 rounded-full bg-brand-dark/50 hover:bg-brand-dark/70 backdrop-blur-md border border-brand-light/20 text-brand-light transition-all z-20 shadow-lg"
            >
                <ArrowLeft size={24} />
            </button>

            {/* PDF Container */}
            <div className="flex-1 w-full h-full relative bg-white/5 overflow-y-auto -webkit-overflow-scrolling-touch">
                <iframe
                    src={pdfUrl}
                    className="w-full h-full border-none min-h-full"
                    title="Menu PDF"
                    style={{
                        minWidth: '100%',
                        width: '100%',
                        height: '100%'
                    }}
                />
            </div>
        </motion.div>
    );
};

export default PdfMenuViewer;
