import React from 'react';

const Background = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-brand-dark">
            {/* 
        INSTRUCTIONS:
        1. Place your image file in the 'public' folder.
        2. Rename it to 'background.jpg' (or update the src below).
      */}
            <img
                src="/background.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    );
};

export default Background;
