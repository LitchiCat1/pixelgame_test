import React from 'react';
import clsx from 'clsx';

// Simple CSS pixel border implementation
// Alternatively we could use multiple box-shadows or border-image
const PixelCard = ({ children, className }) => {
    return (
        <div className={clsx("relative p-6 bg-pixel-card text-white", className)}
            style={{
                boxShadow: `
             -4px 0 0 0 white,
             4px 0 0 0 white,
             0 -4px 0 0 white,
             0 4px 0 0 white,
             -4px -4px 0 0 var(--pixel-dark),
             4px -4px 0 0 var(--pixel-dark),
             -4px 4px 0 0 var(--pixel-dark),
             4px 4px 0 0 var(--pixel-dark)
           `,
                margin: '4px' // Spacing for the shadow
            }}
        >
            {children}
        </div>
    );
};

export default PixelCard;
