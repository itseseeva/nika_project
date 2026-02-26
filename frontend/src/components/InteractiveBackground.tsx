import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const InteractiveBackground: React.FC = () => {
    // Particles generation - stable ids to prevent hydration mismatch though we are CSR
    const [particles] = useState(() =>
        Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 15 + 15,
            delay: Math.random() * -30, // Negative start so they are already on screen
        }))
    );

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-blue-50">
            {/* 1. Mash Gradient Base */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-100"
                style={{
                    background: 'linear-gradient(-45deg, #e0f2fe, #f0f9ff, #bae6fd, #e0e7ff, #e0f2fe)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient-shift 15s ease infinite',
                }}
            />

            {/* 2. Floating Blobs (Mash gradient) */}
            <motion.div
                animate={{
                    x: [0, 80, -80, 0],
                    y: [0, -80, 80, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full filter blur-[120px] opacity-[0.55] bg-blue-300"
            />
            <motion.div
                animate={{
                    x: [0, -100, 100, 0],
                    y: [0, 100, -100, 0],
                    scale: [1, 1.2, 0.8, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[30%] right-[10%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full filter blur-[120px] opacity-[0.5] bg-indigo-300"
            />
            <motion.div
                animate={{
                    x: [0, 120, -50, 0],
                    y: [0, 50, -120, 0],
                    scale: [1, 0.9, 1.1, 1]
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] left-[30%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full filter blur-[120px] opacity-[0.4] bg-cyan-300"
            />



            {/* 4. Particles (Dust) */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-white opacity-40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}vw`,
                        top: `${p.y}vh`,
                    }}
                    animate={{
                        y: ["0vh", "-30vh"],
                        x: ["0vw", `${Math.random() * 10 - 5}vw`],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay,
                    }}
                />
            ))}

            {/* 5. Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};
