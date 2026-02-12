import React, { useState, useEffect, useRef, useCallback } from 'react';

const ValentinesDay = () => {
  // State management
  const [scene, setScene] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });
  const [exploded, setExploded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [letterText, setLetterText] = useState('');
  const [letterDone, setLetterDone] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [giftStarted, setGiftStarted] = useState(false);
  const [showFrost, setShowFrost] = useState(false);
  const [frostActive, setFrostActive] = useState(false);
  const [frostBoxPop, setFrostBoxPop] = useState(false);
  const [answerValue, setAnswerValue] = useState('');
  const [cubeTransform, setCubeTransform] = useState({
    x: -300,
    y: 0,
    rotX: 0,
    rotY: 0,
    opacity: 0
  });
  const [photos, setPhotos] = useState([]);
  const [secretVisible, setSecretVisible] = useState(false);

  // Refs
  const audioRef = useRef(null);
  const letterTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const constellationRef = useRef(null);
  const giftAnimationRef = useRef(null);
  const secretTimerRef = useRef(null);

  // Constants
  const photoUrls = Array.from({ length: 28 }, (_, i) => `Images/${i + 1}.jpeg`);
  const collageImages = ["Images/18.jpeg", "Images/8.jpeg", "Images/16.jpeg", "Images/22.jpeg"];

  const letterMessage = "Some people feel like a chapter. You feel like the entire story. Every moment with you, Shruti, feels cinematic in its own quiet way — like watching golden hour light filter through curtains, or hearing your favorite song unexpectedly. You are my comfort in chaos, my excitement in the ordinary, and my constant in a world that never stops changing. Thank you for being you, for being here, for being mine. Happy Valentine's Day, my love. ❤️";

  const gratitudeItems = [
    { icon: "😊", title: "Your Smile", text: "The way your whole face lights up when you laugh — it's my favorite view in the world." },
    { icon: "🌟", title: "Your Support", text: "You believe in me even when I don't believe in myself. That means everything." },
    { icon: "💭", title: "Our Conversations", text: "From deep talks to silly jokes, I cherish every moment we spend just talking." },
    { icon: "🎵", title: "Little Moments", text: "Coffee in the morning, songs in the car, quiet evenings together — they're all perfect." },
    { icon: "🌙", title: "Your Presence", text: "Just knowing you're there makes everything better. You're my peace and my home." },
    { icon: "✨", title: "Our Future", text: "Every day I'm excited about what we'll build together, the memories we'll create." }
  ];

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Trail animation
  useEffect(() => {
    const updateTrail = () => {
      setTrailPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.14,
        y: prev.y + (mousePos.y - prev.y) * 0.14
      }));
      animationFrameRef.current = requestAnimationFrame(updateTrail);
    };
    updateTrail();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos]);

  // Heart particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();

    const hearts = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 0.6 + 0.2,
      size: Math.random() * 18 + 10,
      opacity: Math.random() * 0.5 + 0.25,
      sway: Math.random() * 2 - 1
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach(h => {
        ctx.globalAlpha = h.opacity;
        ctx.font = `${h.size}px serif`;
        ctx.fillText("💖", h.x, h.y);
        h.y += h.speed;
        h.x += Math.sin(h.y / 50) * h.sway;
        if (h.y > canvas.height + 40) {
          h.y = -20;
          h.x = Math.random() * canvas.width;
        }
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle start
  const handleStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      nextScene();
    }
  };

  // Next scene
  const nextScene = useCallback(() => {
    setScene(prev => {
      const next = prev + 1;
      
      // Reset states for specific scenes
      if (next === 1) {
        setExploded(false);
      }
      if (next === 2) {
        setCarouselIndex(0);
      }
      if (next === 3) {
        startLetterTyping();
      }
      if (next === 4) {
        setGiftStarted(false);
        setPhotos([]);
        setCubeTransform({ x: -300, y: 0, rotX: 0, rotY: 0, opacity: 0 });
      }
      if (next === 6) {
        setAnswerValue('');
      }
      if (next === 7) {
        initSecretPage();
      }
      
      return next;
    });
  }, []);

  // Letter typing effect
  const startLetterTyping = () => {
    setLetterText('');
    setLetterDone(false);
    setShowSignature(false);
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index <= letterMessage.length) {
        setLetterText(letterMessage.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setLetterDone(true);
        setShowSignature(true);
        
        setTimeout(() => {
          setShowFrost(true);
          setTimeout(() => setFrostActive(true), 50);
          setTimeout(() => setFrostBoxPop(true), 400);
          
          setTimeout(() => {
            setShowFrost(false);
            setFrostActive(false);
            setFrostBoxPop(false);
            nextScene();
          }, 2800);
        }, 1800);
      }
    }, 42);

    letterTimerRef.current = typeInterval;
  };

  // Explosion handler
  const handleExplosion = () => {
    if (scene === 1 && !exploded) {
      setExploded(true);
      
      setTimeout(() => {
        nextScene();
      }, 2600);
    }
  };

  // Carousel navigation
  const handleCarouselClick = () => {
    if (scene === 2) {
      if (carouselIndex < photoUrls.length - 1) {
        setCarouselIndex(prev => prev + 1);
      } else {
        nextScene();
      }
    }
  };

  // Gift animation
  const handleGiftClick = () => {
    if (scene === 4 && !giftStarted) {
      setGiftStarted(true);
      animateGift();
    }
  };

  const animateGift = () => {
    const duration = 2200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      setCubeTransform({
        x: -300 + (eased * 500),
        y: 0,
        rotX: progress * 360,
        rotY: progress * 720,
        opacity: Math.min(progress * 2, 1)
      });

      if (progress < 1) {
        giftAnimationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setPhotos(collageImages);
          setTimeout(() => nextScene(), 3000);
        }, 1000);
      }
    };

    giftAnimationRef.current = requestAnimationFrame(animate);
  };

  // Answer submission
  const handleSubmitAnswer = () => {
    if (!answerValue.trim()) return;

    if (answerValue.toLowerCase() === 'shruti') {
      setTimeout(() => setScene(7), 800);
    } else {
      setTimeout(() => setScene(8), 500);
    }
  };

  // Secret page initialization
  const initSecretPage = () => {
    setSecretVisible(false);
    
    clearTimeout(secretTimerRef.current);
    secretTimerRef.current = setTimeout(() => {
      setSecretVisible(true);
    }, 10000);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (letterTimerRef.current) clearInterval(letterTimerRef.current);
      if (giftAnimationRef.current) cancelAnimationFrame(giftAnimationRef.current);
      if (secretTimerRef.current) clearTimeout(secretTimerRef.current);
    };
  }, []);

  return (
    <div 
      className="valentines-container"
      onClick={scene === 0 ? handleStart : undefined}
      style={{ cursor: scene === 0 ? 'pointer' : 'default' }}
    >
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: Georgia, "Times New Roman", serif;
          -webkit-tap-highlight-color: transparent;
        }

        html, body, #root {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .valentines-container {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at top, #2b0a1f, #000);
          color: #fff;
          overflow: hidden;
          touch-action: pan-y;
        }

        /* Cursor - hide on mobile */
        .cursor, .cursor-trail {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: all 0.12s ease;
          mix-blend-mode: difference;
        }

        .cursor {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ff7eb3;
          background: transparent;
        }

        .cursor-trail {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff7eb3;
          opacity: 0.7;
        }

        @media (hover: none) {
          .cursor, .cursor-trail {
            display: none;
          }
        }

        canvas.particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .light-ray {
          position: fixed;
          width: 2px;
          height: 100vh;
          background: linear-gradient(to bottom, transparent, rgba(255,126,179,0.08), transparent);
          pointer-events: none;
          animation: rayShift 8s ease-in-out infinite;
          z-index: 0;
        }

        @keyframes rayShift {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }

        .page {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: clamp(1rem, 3vw, 2rem);
          text-align: center;
          opacity: 0;
          transform: scale(1.06);
          transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 2;
        }

        .page.active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .title {
          font-size: clamp(1.5rem, 7vw, 4rem);
          letter-spacing: clamp(1px, 0.5vw, 3px);
          text-transform: uppercase;
          background: linear-gradient(135deg, #ff7eb3, #ff9a9e, #ffd1dc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 40px rgba(255, 126, 179, 0.45);
          font-weight: 300;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.25); }
        }

        .name {
          font-size: clamp(1.2rem, 5vw, 3rem);
          color: #ff7eb3;
          margin-top: clamp(1rem, 3vw, 1.5rem);
          font-style: italic;
          animation: float 3s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(255, 126, 179, 0.6);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .tap {
          margin-top: clamp(1.5rem, 4vw, 2rem);
          opacity: 0.9;
          animation: fadeInPulse 2s ease-in-out 1s infinite;
          font-size: clamp(0.85rem, 2.5vw, 1.05rem);
          z-index: 100;
          padding: 0 1rem;
        }

        @keyframes fadeInPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .main-heart {
          width: clamp(120px, 35vw, 200px);
          height: clamp(120px, 35vw, 200px);
          cursor: pointer;
          transition: transform 0.3s ease;
          z-index: 100;
          touch-action: manipulation;
        }

        .main-heart svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 10px 30px rgba(255, 126, 179, 0.5));
        }

        .main-heart:active {
          transform: scale(0.95);
        }

        .main-heart.exploded {
          animation: explode 0.6s ease-out forwards;
        }

        @keyframes explode {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(0); opacity: 0; }
        }

        .explosion-title {
          font-size: clamp(1rem, 3.5vw, 2rem);
          color: #ff9a9e;
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
          font-style: italic;
          opacity: 0.9;
        }

        /* Carousel */
        .carousel {
          width: 100%;
          max-width: min(90vw, 420px);
          height: clamp(300px, 60vh, 560px);
          position: relative;
          perspective: 9000px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(1rem, 3vw, 2rem);
        }

        .track {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .track img {
          position: absolute;
          left: 50%;
          top: 50%;
          width: clamp(200px, 70vw, 420px);
          height: clamp(280px, 90vw, 560px);
          transform: translate(-50%, -50%);
          border-radius: clamp(12px, 3vw, 20px);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.8),
                      0 0 60px rgba(255, 126, 179, 0.25);
          object-fit: cover;
          transition: filter 0.4s ease, transform 0.4s ease;
          filter: brightness(0.7) blur(1px);
        }

        .track img.active {
          filter: brightness(1.05) blur(0px);
          box-shadow: 0 60px 160px rgba(0, 0, 0, 0.9),
                      0 0 60px rgba(255, 126, 179, 0.5);
          z-index: 20;
          transform: translate(-50%, -50%) scale(1.02);
        }

        /* Letter Scene */
        .letter-envelope {
          position: relative;
          max-width: min(92%, 680px);
          width: 100%;
          background: linear-gradient(145deg, rgba(255, 126, 179, 0.08), rgba(80, 10, 40, 0.35));
          border: 1px solid rgba(255, 126, 179, 0.28);
          border-radius: clamp(16px, 4vw, 24px);
          padding: clamp(1.5rem, 4vw, 2.8rem) clamp(1.5rem, 5vw, 3rem);
          backdrop-filter: blur(12px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7),
                      0 0 60px rgba(255, 100, 160, 0.1);
          overflow: hidden;
        }

        .letter-greeting {
          font-size: clamp(0.95rem, 2.5vw, 1.1rem);
          color: #ffb3d1;
          font-style: italic;
          margin-bottom: clamp(1rem, 3vw, 1.2rem);
          letter-spacing: 1px;
          animation: fadeInUp 0.8s ease 0.3s forwards;
          opacity: 0;
        }

        .letter-text {
          font-size: clamp(0.85rem, 2vw, 1.05rem);
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.85;
          min-height: 120px;
          text-align: left;
          white-space: pre-wrap;
          position: relative;
        }

        .letter-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: #ff7eb3;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.7s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .letter-signature {
          margin-top: clamp(1rem, 3vw, 1.5rem);
          text-align: right;
          color: #ff7eb3;
          font-style: italic;
          font-size: clamp(0.9rem, 2vw, 1rem);
          opacity: 0;
          transition: opacity 1s ease;
        }

        .letter-signature.visible {
          animation: fadeInUp 1s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Frost Overlay */
        .frost-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .frost-overlay.visible {
          opacity: 1;
        }

        .frost-bg {
          position: absolute;
          inset: 0;
          backdrop-filter: blur(0px);
          background: rgba(0, 0, 0, 0);
          transition: backdrop-filter 1.4s ease, background 1.4s ease;
        }

        .frost-bg.active {
          backdrop-filter: blur(30px) saturate(0.3);
          background: rgba(10, 0, 20, 0.6);
        }

        .frost-box-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .frost-box-wrapper.pop {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .frost-box {
          width: clamp(120px, 35vw, 200px);
          height: clamp(120px, 35vw, 200px);
          background: linear-gradient(135deg, rgba(255, 200, 220, 0.18), rgba(255, 100, 160, 0.1));
          border: 1.5px solid rgba(255, 180, 210, 0.45);
          border-radius: clamp(16px, 4vw, 24px);
          backdrop-filter: blur(20px) saturate(1.5);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
                      0 0 80px rgba(255, 100, 160, 0.18),
                      inset 0 1px 1px rgba(255, 255, 255, 0.12);
          position: relative;
        }

        .frost-bow {
          position: absolute;
          top: clamp(-28px, -6vw, -38px);
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(2rem, 7vw, 3.2rem);
          filter: drop-shadow(0 4px 16px rgba(255, 80, 140, 0.5));
          animation: bounceBow 1.5s ease-in-out infinite;
        }

        @keyframes bounceBow {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }

        .frost-box-text {
          position: absolute;
          bottom: clamp(-45px, -10vw, -56px);
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(0.85rem, 2vw, 1rem);
          color: rgba(255, 200, 220, 0.9);
          font-style: italic;
          white-space: nowrap;
          letter-spacing: 1px;
          animation: fadeInUp 0.6s ease 0.4s forwards;
          opacity: 0;
        }

        /* Gift Scene */
        .gift-scene {
          background: radial-gradient(ellipse at center bottom, #1a0510 0%, #000 70%);
        }

        .gift-prompt {
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          color: rgba(255, 180, 210, 0.9);
          font-style: italic;
          letter-spacing: 1px;
          animation: fadeInPulse 2s ease-in-out infinite;
          z-index: 60;
          padding: 0 1rem;
        }

        .cube-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(100px, 25vw, 180px);
          height: clamp(100px, 25vw, 180px);
          transform-style: preserve-3d;
          transition: transform 0.5s ease, opacity 0.5s ease;
        }

        .cube-3d {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(255, 200, 220, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(2rem, 5vw, 3.2rem);
          border-radius: clamp(10px, 3vw, 16px);
          backface-visibility: hidden;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, #ff7eb3, #ff4b7d);
        }

        .photos-grid {
          position: absolute;
          inset: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: clamp(0.5rem, 2vw, 1rem);
          padding: clamp(1rem, 3vw, 2rem);
          pointer-events: none;
        }

        .photo-item {
          width: clamp(120px, 35vw, 260px);
          height: clamp(120px, 35vw, 260px);
          border-radius: clamp(10px, 3vw, 16px);
          object-fit: cover;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6),
                      0 0 30px rgba(255, 126, 179, 0.3);
          border: 2px solid rgba(255, 180, 210, 0.45);
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }

        /* Gratitude */
        .gratitude-container {
          max-width: min(90%, 900px);
          width: 100%;
          padding: 0 clamp(0.5rem, 2vw, 1rem);
        }

        .gratitude-title {
          font-size: clamp(1.5rem, 5vw, 3rem);
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
          background: linear-gradient(135deg, #ff7eb3, #ff9a9e);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }

        .gratitude-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
          gap: clamp(1rem, 3vw, 1.5rem);
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
        }

        .gratitude-card {
          background: linear-gradient(135deg, rgba(255, 126, 179, 0.12), rgba(255, 154, 158, 0.06));
          backdrop-filter: blur(10px);
          padding: clamp(1.2rem, 4vw, 1.8rem);
          border-radius: clamp(12px, 3vw, 18px);
          border: 1px solid rgba(255, 126, 179, 0.2);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
          opacity: 0;
          transform: translateY(24px);
          animation: cardFadeIn 0.6s ease forwards;
        }

        .gratitude-card .icon {
          font-size: clamp(1.8rem, 5vw, 2.2rem);
          margin-bottom: 0.7rem;
          display: block;
        }

        .gratitude-card h3 {
          color: #ff9a9e;
          margin-bottom: 0.45rem;
          font-size: clamp(1rem, 2.5vw, 1.15rem);
        }

        .gratitude-card p {
          color: rgba(255, 255, 255, 0.92);
          line-height: 1.6;
          font-size: clamp(0.9rem, 2vw, 1rem);
        }

        @keyframes cardFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Prompt Page */
        .prompt-container {
          max-width: min(92%, 600px);
          width: 100%;
        }

        .prompt-title {
          font-size: clamp(1.5rem, 5vw, 2.8rem);
          background: linear-gradient(135deg, #ff7eb3, #ff9a9e, #ffd1dc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: clamp(1rem, 3vw, 1.5rem);
          animation: shimmer 3s ease-in-out infinite;
        }

        .prompt-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          color: rgba(255, 200, 220, 0.9);
          margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
          font-style: italic;
          line-height: 1.6;
        }

        .prompt-box {
          background: linear-gradient(145deg, rgba(255, 126, 179, 0.08), rgba(80, 10, 40, 0.35));
          border: 1px solid rgba(255, 126, 179, 0.28);
          border-radius: clamp(14px, 4vw, 20px);
          padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.2rem, 3vw, 2rem);
          backdrop-filter: blur(12px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7),
                      0 0 60px rgba(255, 100, 160, 0.1);
        }

        .prompt-question {
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          color: #ffb3d1;
          margin-bottom: clamp(1rem, 3vw, 1.5rem);
          font-style: italic;
          letter-spacing: 0.5px;
        }

        .prompt-input {
          width: 100%;
          padding: clamp(0.8rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem);
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 126, 179, 0.3);
          border-radius: clamp(10px, 2vw, 12px);
          color: #fff;
          font-family: Georgia, serif;
          transition: all 0.3s ease;
          margin-bottom: clamp(1rem, 3vw, 1.5rem);
        }

        .prompt-input:focus {
          outline: none;
          border-color: #ff7eb3;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(255, 126, 179, 0.3);
        }

        .prompt-submit {
          width: 100%;
          padding: clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          background: linear-gradient(135deg, #ff7eb3, #db2777);
          border: none;
          border-radius: clamp(10px, 2vw, 12px);
          color: #fff;
          font-family: Georgia, serif;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
          box-shadow: 0 10px 30px rgba(255, 126, 179, 0.4);
          touch-action: manipulation;
        }

        .prompt-submit:active {
          transform: scale(0.98);
        }

        /* Secret Page */
        .secret-page {
          background: radial-gradient(circle at center, #2b001a, #000);
        }

        .secret-container {
          max-width: min(90%, 900px);
          width: 100%;
          padding: 0 clamp(0.5rem, 2vw, 1rem);
        }

        .secret-title {
          font-size: clamp(1.5rem, 6vw, 3rem);
          background: linear-gradient(135deg, #ffd1dc, #ff7eb3, #fff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: heartbeatGlow 1.5s ease-in-out infinite;
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
        }

        @keyframes heartbeatGlow {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(255, 126, 179, 0.5));
            transform: scale(1);
          }
          14%, 42% {
            filter: brightness(1.3) drop-shadow(0 0 40px rgba(255, 126, 179, 0.8));
            transform: scale(1.05);
          }
          28% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(255, 126, 179, 0.5));
            transform: scale(1);
          }
        }

        .handwritten-text {
          font-family: 'Brush Script MT', cursive, Georgia, serif;
          font-size: clamp(1.2rem, 3.5vw, 2.2rem);
          color: #ff7eb3;
          line-height: 1.8;
          text-shadow: 0 0 20px rgba(255, 126, 179, 0.6);
          animation: handwritingReveal 3s ease forwards 1s;
          opacity: 0;
        }

        @keyframes handwritingReveal {
          0% {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .secret-message {
          margin-top: clamp(2rem, 5vw, 3rem);
          padding: clamp(1.5rem, 4vw, 2rem);
          background: linear-gradient(145deg, rgba(255, 126, 179, 0.1), rgba(80, 10, 40, 0.3));
          border: 1px solid rgba(255, 126, 179, 0.3);
          border-radius: clamp(14px, 4vw, 20px);
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 1.5s ease, transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .secret-message.visible {
          opacity: 1;
          transform: scale(1);
        }

        .secret-message p {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: rgba(255, 200, 220, 0.95);
          line-height: 1.8;
          font-style: italic;
          text-shadow: 0 0 15px rgba(255, 126, 179, 0.4);
        }

        /* Ending */
        .ending {
          background: linear-gradient(135deg, #ff4b7d, #ff9a9e, #ffd1dc);
          animation: gradientShift 6s ease infinite;
          background-size: 200% 200%;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .ending h1 {
          font-size: clamp(1.5rem, 7vw, 4rem);
          margin-bottom: 1rem;
          animation: celebrationPop 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }

        @keyframes celebrationPop {
          0% {
            transform: scale(0) rotate(-160deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }

        .ending p {
          font-size: clamp(1rem, 3vw, 1.2rem);
          font-style: italic;
          animation: fadeInUp 1s ease 0.4s forwards;
          opacity: 0;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .page {
            padding: 1rem;
          }

          .carousel {
            height: 50vh;
          }

          .letter-envelope {
            padding: 1.5rem 1.2rem;
          }

          .gratitude-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-height: 600px) and (orientation: landscape) {
          .carousel {
            height: 70vh;
          }

          .letter-envelope {
            max-height: 80vh;
            overflow-y: auto;
          }
        }
      `}</style>

      {/* Audio */}
      <audio ref={audioRef} loop>
        <source src="./song.mp3" type="audio/mp3" />
      </audio>

      {/* Custom cursors */}
      <div 
        className="cursor" 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }} 
      />
      <div 
        className="cursor-trail" 
        style={{ 
          left: `${trailPos.x}px`, 
          top: `${trailPos.y}px` 
        }} 
      />

      {/* Light rays */}
      {[10, 30, 50, 70, 90].map((left, i) => (
        <div 
          key={i}
          className="light-ray" 
          style={{ 
            left: `${left}%`,
            animationDelay: `${i * 2}s`
          }} 
        />
      ))}

      {/* Particles canvas */}
      <canvas ref={canvasRef} className="particles" />

      {/* Frost overlay */}
      {showFrost && (
        <div className={`frost-overlay ${showFrost ? 'visible' : ''}`}>
          <div className={`frost-bg ${frostActive ? 'active' : ''}`} />
          <div className={`frost-box-wrapper ${frostBoxPop ? 'pop' : ''}`}>
            <div className="frost-box">
              <div className="frost-bow">🎀</div>
            </div>
            <div className="frost-box-text">Something beautiful is waiting...</div>
          </div>
        </div>
      )}

      {/* Scene 0: Welcome */}
      <section className={`page ${scene === 0 ? 'active' : ''}`}>
        <h1 className="title">Happy Valentine's Day</h1>
        <h2 className="name">Shruti ❤️</h2>
        <p className="tap">✨ Tap anywhere to begin our cinematic story ✨</p>
      </section>

      {/* Scene 1: Explosion */}
      <section 
        className={`page ${scene === 1 ? 'active' : ''}`}
        onClick={handleExplosion}
      >
        <h2 className="explosion-title">
          Every moment with you bursts with joy
        </h2>
        <div className={`main-heart ${exploded ? 'exploded' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#db2777', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path 
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" 
              fill="url(#heartGradient)" 
            />
          </svg>
        </div>
        <p className="tap">💕 Click the heart to see our memories 💕</p>
      </section>

      {/* Scene 2: Carousel */}
      <section 
        className={`page ${scene === 2 ? 'active' : ''}`}
        onClick={handleCarouselClick}
      >
        <div className="carousel">
          <div 
            className="track" 
            style={{ 
              transform: `rotateY(${-carouselIndex * (360 / photoUrls.length)}deg)` 
            }}
          >
            {photoUrls.map((url, index) => {
              const angle = (360 / photoUrls.length) * index;
              const radius = 600;
              return (
                <img
                  key={index}
                  src={url}
                  alt={`Memory ${index + 1}`}
                  className={carouselIndex === index ? 'active' : ''}
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                    zIndex: carouselIndex === index ? 20 : Math.max(1, 20 - Math.abs(index - carouselIndex))
                  }}
                />
              );
            })}
          </div>
        </div>
        <p className="tap">💫 Tap to journey through our memories 💫</p>
      </section>

      {/* Scene 3: Letter */}
      <section className={`page ${scene === 3 ? 'active' : ''}`}>
        <div className="letter-envelope">
          <p className="letter-greeting">My dearest Shruti,</p>
          <div className="letter-text">
            {letterText}
            {!letterDone && <span className="letter-cursor" />}
          </div>
          <div className={`letter-signature ${showSignature ? 'visible' : ''}`}>
            — Akarsh ❤️
          </div>
        </div>
      </section>

      {/* Scene 4: Gift */}
      <section 
        className={`page gift-scene ${scene === 4 ? 'active' : ''}`}
        onClick={handleGiftClick}
      >
        {!giftStarted && (
          <div className="gift-prompt">
            🎁 Click anywhere to unwrap your surprise ✨
          </div>
        )}
        
        <div 
          className="cube-wrapper"
          style={{
            transform: `translate(${cubeTransform.x}px, ${cubeTransform.y}px)`,
            opacity: cubeTransform.opacity
          }}
        >
          <div 
            className="cube-3d"
            style={{
              transform: `rotateX(${cubeTransform.rotX}deg) rotateY(${cubeTransform.rotY}deg)`
            }}
          >
            <div className="cube-face">🎁</div>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="photos-grid">
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Photo ${i + 1}`}
                className="photo-item"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Scene 5: Gratitude */}
      <section 
        className={`page ${scene === 5 ? 'active' : ''}`}
        onClick={nextScene}
      >
        <div className="gratitude-container">
          <h1 className="gratitude-title">Things I Love About Us</h1>
          <div className="gratitude-grid">
            {gratitudeItems.map((item, index) => (
              <div 
                key={index} 
                className="gratitude-card"
                style={{ animationDelay: `${0.08 * index}s` }}
              >
                <span className="icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <p className="tap">💕 Tap to continue 💕</p>
        </div>
      </section>

      {/* Scene 6: Prompt */}
      <section className={`page ${scene === 6 ? 'active' : ''}`}>
        <div className="prompt-container">
          <h1 className="prompt-title">One Last Question ✨</h1>
          <p className="prompt-subtitle">
            Before we reach our finale, there's something I'd love to know...
          </p>
          
          <div className="prompt-box">
            <p className="prompt-question">Who holds the key to my heart?</p>
            <input 
              type="text" 
              className="prompt-input" 
              placeholder="Type your answer here..."
              value={answerValue}
              onChange={(e) => setAnswerValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              autoComplete="off"
            />
            <button className="prompt-submit" onClick={handleSubmitAnswer}>
              Reveal ❤️
            </button>
          </div>
        </div>
      </section>

      {/* Scene 7: Secret */}
      <section className={`page secret-page ${scene === 7 ? 'active' : ''}`} onClick={nextScene}>
        <div className="secret-container">
          <h1 className="secret-title">You Found The Hidden Piece ❤️</h1>
          
          <div style={{ margin: '2rem auto', maxWidth: '700px' }}>
            <p className="handwritten-text">
              In a universe of infinite possibilities,<br />
              across countless stars and stories,<br />
              my heart chose you, Shruti ✨
            </p>
          </div>

          <div className={`secret-message ${secretVisible ? 'visible' : ''}`}>
            <p>
              Some secrets are meant to be discovered.<br />
              Some love stories write themselves in constellations.<br />
              And some people, like you, make every moment feel like magic.<br /><br />
              Thank you for finding this. Thank you for being you. ❤️
            </p>
          </div>

          <p className="tap" style={{ marginTop: 'clamp(2rem, 5vw, 3rem)' }}>
            💕 Tap to continue to the finale 💕
          </p>
        </div>
      </section>

      {/* Scene 8: Ending */}
      <section className={`page ending ${scene === 8 ? 'active' : ''}`}>
        <h1>Forever Grateful for You 💕</h1>
        <p>Every day with you is my favorite day.</p>
      </section>
    </div>
  );
};

export default ValentinesDay;