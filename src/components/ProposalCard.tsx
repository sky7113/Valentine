import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ProposalCardProps {
    onSuccess: () => void;
}

export const ProposalCard = ({ onSuccess }: ProposalCardProps) => {
    const [noBtnPosition, setNoBtnPosition] = useState<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleNoHover = () => {
        // Determine screen bounds (safe area)
        const maxWidth = window.innerWidth - 100; // subtract button width approx
        const maxHeight = window.innerHeight - 100; // subtract button height approx

        const randomX = Math.random() * maxWidth;
        const randomY = Math.random() * maxHeight;

        // Ensure it doesn't overlap completely with Yes button if possible (optional simplification)
        // For now, just absolute random position
        setNoBtnPosition({ x: Math.max(20, randomX), y: Math.max(20, randomY) });
    };

    const resetNoBtn = () => {
        setNoBtnPosition(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4" ref={containerRef}>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10"
                onMouseLeave={resetNoBtn}
            >
                <img
                    src="bear.gif"
                    alt="Cute Bear (Please save your GIF as bear.gif in the public folder)"
                    className="w-48 h-48 mx-auto mb-6 object-contain"
                />

                <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-2 font-['Comic_Sans_MS',_sans-serif]">
                    Will you be my Valentine? 💌
                </h1>

                <p className="text-gray-600 text-lg mb-8">Think carefully 😉</p>

                <div className="flex justify-center gap-4 relative h-16">
                    {/* YES Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSuccess}
                        onMouseEnter={resetNoBtn}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors z-20"
                    >
                        Yes 💖
                    </motion.button>

                    {/* NO Button */}
                    <motion.button
                        onMouseEnter={handleNoHover}
                        onTouchStart={handleNoHover}
                        animate={noBtnPosition ? {
                            x: noBtnPosition.x - (containerRef.current?.getBoundingClientRect().left || 0),
                            y: noBtnPosition.y - (containerRef.current?.getBoundingClientRect().top || 0),
                            position: 'absolute'
                        } : {
                            x: 0,
                            y: 0,
                            position: 'relative'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`bg-red-300 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors ${noBtnPosition ? 'absolute' : 'relative'}`}
                    >
                        No 😝
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
