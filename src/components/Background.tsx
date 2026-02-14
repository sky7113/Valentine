import { useEffect, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import confetti from 'canvas-confetti';
import type { Container, Engine } from "@tsparticles/engine";

export const Background = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });

        // Random firecracker/confetti bursts
        const interval = setInterval(() => {

            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff69b4', '#ffa500'],
                shapes: ['heart' as any], // Cast 'heart' as any to avoid type issues if older types
                disableForReducedMotion: true
            });

        }, 8000); // Burst every 8 seconds

        return () => clearInterval(interval);
    }, []);

    const particlesLoaded = useCallback(async (_container?: Container) => {
        // console.log(container);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient Background */}
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-pink-400"></div>

            {/* Particles */}
            {init && (
                <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={{
                        background: {
                            color: { value: "transparent" },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: { enable: true, mode: "push" },
                                onHover: { enable: true, mode: "repulse" },
                            },
                            modes: {
                                push: { quantity: 4 },
                                repulse: { distance: 100, duration: 0.4 },
                            },
                        },
                        particles: {
                            color: { value: ["#ffc0cb", "#ff69b4"] },
                            links: { enable: false }, // No links for floaty feel
                            move: {
                                direction: "top",
                                enable: true,
                                outModes: { default: "out" },
                                random: true,
                                speed: 2,
                                straight: false,
                            },
                            number: {
                                density: { enable: true, area: 800 } as any,
                                value: 40,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "char",
                                options: {
                                    char: {
                                        value: ["❤️", "💖", "💕", "💘"],
                                        font: "Verdana",
                                        style: "",
                                        weight: "400",
                                        fill: true
                                    }
                                }
                            } as any, // Cast to any to handle type mismatch in v3
                            size: {
                                value: { min: 10, max: 20 },
                            },
                        },
                        detectRetina: true,
                    }}
                    className="absolute inset-0"
                />
            )}
        </div>
    );
};
