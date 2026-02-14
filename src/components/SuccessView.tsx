import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const SuccessView = () => {
    const [view, setView] = useState<'music-prompt' | 'selection' | 'hug' | 'kiss' | 'beat' | 'reasons' | 'promise' | 'gallery'>('music-prompt');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Music Player State
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);

    // USER: Replace these with your own URLs!
    const images = [
        "us1.jpeg",
        "us2.jpeg",
        "us3.jpeg",
        "us4.jpeg",
        "us5.jpeg",
        "us6.jpeg"
    ];

    useEffect(() => {
        // Trigger massive confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleMusicChoice = (play: boolean) => {
        if (play) {
            setShowMusicPlayer(true);
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
                setIsPlaying(true);
            }
        }
        setView('selection');
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleChoice = (choice: 'hug' | 'kiss' | 'beat') => {
        setView(choice);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const handleFinalSurprise = () => {
        confetti({
            particleCount: 500,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ff69b4', '#ffa500']
        });
        setView('gallery');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center z-20 relative perspective-1000 overflow-hidden">
            <audio
                ref={audioRef}
                src="song.mp3"
                loop
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />

            {/* Advanced Music Player Overlay */}
            {showMusicPlayer && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-pink-200 w-80 flex flex-col gap-2"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-pink-600 font-bold text-sm">🎵 Our Song</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />

                    <div className="flex items-center justify-between mt-2">
                        <button
                            onClick={handlePlayPause}
                            className="bg-pink-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-pink-600 transition-colors shadow-md"
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-xs">🔊</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-20 accent-gray-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {view !== 'gallery' && (
                    <motion.div
                        key="main-card"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10"
                    >
                        {/* Music Prompt View */}
                        {view === 'music-prompt' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src="bear.gif" // Reusing bear gif for prompt
                                    alt="Music Prompt Bear"
                                    className="w-48 h-48 mx-auto mb-6 object-contain"
                                />
                                <h1 className="text-3xl font-bold text-red-500 mb-6 font-['Comic_Sans_MS',_sans-serif]">
                                    Would you like to listen to a song? 🎶
                                </h1>
                                <div className="flex gap-4 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMusicChoice(true)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
                                    >
                                        Yes Please! 🎵
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMusicChoice(false)}
                                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
                                    >
                                        No thanks 🔇
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Selection View */}
                        {view === 'selection' && (
                            <>
                                <img
                                    src="dance.gif"
                                    alt="Happy Dance"
                                    className="w-48 h-48 mx-auto mb-6 object-contain"
                                />
                                <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-4 font-['Comic_Sans_MS',_sans-serif]">
                                    I KNEW YOU'D SAY YES! ❤️
                                </h1>
                                <p className="text-gray-600 text-lg mb-8">
                                    Now... reward me immediately! 🔫 <br />
                                    <span className="text-sm text-gray-400">(Please?)</span>
                                </p>

                                <div className="flex justify-center gap-4 flex-wrap">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice('hug')}
                                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
                                    >
                                        Hug 🤗
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice('kiss')}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
                                    >
                                        Kiss 💋
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice('beat')}
                                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
                                    >
                                        Beat Me 🥊
                                    </motion.button>
                                </div>
                            </>
                        )}

                        {/* Hug View */}
                        {view === 'hug' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src="hug.gif"
                                    alt="Hugging"
                                    className="w-64 h-64 mx-auto mb-6 object-contain"
                                />
                                <h1 className="text-3xl font-bold text-pink-500 mb-4 font-['Comic_Sans_MS',_sans-serif]">
                                    YAAAY! *Bear Hug* 🫂
                                </h1>
                                <p className="text-gray-600">Best Valentine Ever! 💖</p>
                                <div className="flex gap-4 mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView('selection')}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full shadow transition-colors"
                                    >
                                        Choose Again 🔄
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView('reasons')}
                                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow transition-colors"
                                    >
                                        Next ➡️
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Kiss View */}
                        {view === 'kiss' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src="kiss.gif"
                                    alt="Kissing"
                                    className="w-64 h-64 mx-auto mb-6 object-contain"
                                />
                                <h1 className="text-3xl font-bold text-red-500 mb-4 font-['Comic_Sans_MS',_sans-serif]">
                                    HEHEHE! *Mwah* 💋
                                </h1>
                                <p className="text-gray-600">I love you! ❤️</p>
                                <div className="flex gap-4 mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView('selection')}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full shadow transition-colors"
                                    >
                                        Choose Again 🔄
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView('reasons')}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow transition-colors"
                                    >
                                        Next ➡️
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Beat View */}
                        {view === 'beat' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center w-full"
                            >
                                <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-sm">
                                    <img src="beat1.gif" alt="Beat 1" className="w-full h-32 object-contain rounded-lg shadow-md bg-purple-50" />
                                    <img src="beat2.gif" alt="Beat 2" className="w-full h-32 object-contain rounded-lg shadow-md bg-purple-50" />
                                    <img src="beat3.gif" alt="Beat 3" className="w-full h-32 object-contain rounded-lg shadow-md bg-purple-50" />
                                    <img src="beat4.gif" alt="Beat 4" className="w-full h-32 object-contain rounded-lg shadow-md bg-purple-50" />
                                </div>
                                <h1 className="text-3xl font-bold text-purple-500 mb-4 font-['Comic_Sans_MS',_sans-serif]">
                                    OW! OW! 🤕
                                </h1>
                                <p className="text-gray-600">Okay okay, I deserve that... <br /> But I still love you! 🥺</p>
                                <div className="flex gap-4 mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView('selection')}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full shadow transition-colors"
                                    >
                                        Choose Again 🔄
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView('reasons')}
                                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow transition-colors"
                                    >
                                        Next ➡️
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Reasons View */}
                        {view === 'reasons' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center w-full"
                            >
                                <h1 className="text-3xl font-bold text-red-500 mb-8 font-['Comic_Sans_MS',_sans-serif]">
                                    Reasons Why I Love You 💖
                                </h1>
                                <div className="w-full space-y-4 mb-8">
                                    {[
                                        "💖 Your beautiful smile",
                                        "🌸 Your kindness and care",
                                        "🫶 You understand me deeply",
                                        "🏡 You're my safe place",
                                        "✨ You make life magical"
                                    ].map((reason, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 + 0.5 }}
                                            className="bg-red-50 text-red-600 font-semibold py-3 px-4 rounded-xl shadow-sm"
                                        >
                                            {reason}
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setView('promise')}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
                                >
                                    Next ➡️
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Promise View */}
                        {view === 'promise' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <img
                                    src="promise.gif"
                                    alt="Promise Bear"
                                    className="w-48 h-48 mx-auto mb-6 object-contain rounded-xl"
                                />
                                <h1 className="text-3xl font-bold text-red-500 mb-4 font-['Comic_Sans_MS',_sans-serif] drop-shadow-sm">
                                    My Valentine Promise 💝
                                </h1>
                                <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-sm">
                                    I promise to care for you, <br />
                                    to make you smile even on hard days, <br />
                                    and to love you more with every heartbeat ❤️
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleFinalSurprise}
                                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors flex items-center gap-2"
                                >
                                    Final Surprise 🎁
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Orbiting Gallery View */}
            {view === 'gallery' && (
                <div className="w-full h-screen flex items-center justify-center relative z-20 overflow-hidden perspective-1000">
                    {/* Scene Container */}
                    <motion.div
                        className="relative w-full h-full flex items-center justify-center"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Central Static Card */}
                        <div
                            className="absolute p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_0_50px_rgba(255,105,180,0.8)] text-center max-w-xs border-4 border-pink-200"
                            style={{
                                transform: 'translateZ(0px)', // Fixed at center
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            <h1 className="text-3xl font-bold text-red-500 mb-2 font-['Comic_Sans_MS',_sans-serif]">
                                Happy Valentine's Day! 💝
                            </h1>
                            <p className="text-gray-700 italic mb-4">
                                "You are my today and all of my tomorrows."
                            </p>
                            <h2 className="text-4xl font-extrabold text-pink-600 drop-shadow-md font-['Comic_Sans_MS',_sans-serif]">
                                I LOVE YOU! ❤️
                            </h2>
                        </div>

                        {/* Orbiting Ring */}
                        <motion.div
                            className="absolute flex items-center justify-center"
                            animate={{ rotateY: 360 }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 20
                            }}
                            style={{
                                transformStyle: 'preserve-3d',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {images.map((src, index) => {
                                const angle = (360 / images.length) * index;
                                const radius = 400; // Radius of orbit

                                return (
                                    <div
                                        key={index}
                                        className="absolute p-2 bg-white rounded-xl shadow-xl"
                                        style={{
                                            width: '200px',
                                            height: '280px',
                                            transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                        }}
                                    >
                                        <img
                                            src={src}
                                            alt={`Memory ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=500";
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
