import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

/**
 * CeramicCube Component
 * 
 * A lightweight alternative to the Three.js version.
 * Simulates a 3D rotating cube using CSS 3D transforms and Framer Motion.
 * This approach significantly reduces the bundle size and improves performance on mobile.
 */

const TEXTURES = Array.from({ length: 6 }, (_, i) => `/textures/${i + 1}.avif`);
const INTERVAL_MS = 2800;
const ANIMATION_DURATION = 0.65;

// Rotation axis mapping for each face index:
// 'y' = horizontal rotation, 'x' = vertical flip
const ROTATION_AXES: ('x' | 'y')[] = ['y', 'y', 'y', 'y', 'x', 'x'];

export default function CeramicCube() {
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFaceIndex((prev) => (prev + 1) % TEXTURES.length);
    }, INTERVAL_MS);
    
    return () => clearInterval(timer);
  }, []);

  const currentAxis = ROTATION_AXES[faceIndex];

  // Memoize variants for performance
  const variants: Variants = useMemo(() => ({
    initial: (axis: 'x' | 'y') => ({
      rotateY: axis === 'y' ? 90 : 0,
      rotateX: axis === 'x' ? -90 : 0,
      opacity: 0,
      scale: 0.95
    }),
    animate: { 
      rotateY: 0, 
      rotateX: 0, 
      opacity: 1,
      scale: 1
    },
    exit: (axis: 'x' | 'y') => ({
      rotateY: axis === 'y' ? -90 : 0,
      rotateX: axis === 'x' ? 90 : 0,
      opacity: 0,
      scale: 0.95
    }),
  }), []);

  return (
    <div
      className="relative w-full aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-stone-100"
      style={{ perspective: '1000px' }}
      aria-label="Galleria opere in ceramica"
    >
      <AnimatePresence mode="sync" custom={currentAxis}>
        <motion.div
          key={faceIndex}
          custom={currentAxis}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ 
            duration: ANIMATION_DURATION, 
            ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for a more "physical" feel
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ 
            backgroundImage: `url(${TEXTURES[faceIndex]})`,
            backfaceVisibility: 'hidden'
          }}
        />
      </AnimatePresence>

      {/* Optional subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 to-transparent" />
    </div>
  );
}