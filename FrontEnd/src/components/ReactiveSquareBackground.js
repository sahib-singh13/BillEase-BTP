// src/components/ReactiveSquareBackground.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUM_SQUARES = 100; // Adjust the number of squares
const INTERACTION_RADIUS = 150; // How close the mouse needs to be to affect squares (px)
const BASE_SPEED = 0.3; // Base movement speed of squares
const MOUSE_REPEL_STRENGTH = 1.5; // How strongly squares move away from mouse
const BASE_SIZE = 12; // Base size of squares (px)
const MAX_SCALE = 1.4; // Maximum scale on mouse proximity
const MIN_OPACITY = 0.1; // Minimum opacity when far from mouse
const MAX_OPACITY = 0.6; // Maximum opacity when close to mouse

// Simple utility for random number in a range
const random = (min, max) => Math.random() * (max - min) + min;

// Initial state for a single square
const createSquare = (bounds) => ({
  id: Math.random(),
  x: random(0, bounds.width),
  y: random(0, bounds.height),
  // Velocity vector for base movement
  vx: random(-BASE_SPEED, BASE_SPEED),
  vy: random(-BASE_SPEED, BASE_SPEED),
  // Current style attributes (will be updated)
  opacity: MIN_OPACITY,
  scale: 1,
});

const ReactiveSquareBackground = () => {
  const containerRef = useRef(null);
  const squaresRef = useRef([]);
  const mousePosition = useRef({ x: -1000, y: -1000 }); // Start mouse off-screen
  const animationFrameId = useRef(null);
  // We need a state variable to trigger re-renders when styles change
  const [, setTick] = useState(0); // Dummy state to force updates

  // Initialize squares only once on mount
  useEffect(() => {
    const bounds = containerRef.current.getBoundingClientRect();
    squaresRef.current = Array.from({ length: NUM_SQUARES }, () => createSquare(bounds));
    // Start the animation loop
    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once


  // Track mouse movement
  const handleMouseMove = useCallback((event) => {
    if (containerRef.current) {
        // Get mouse position relative to the container
        const bounds = containerRef.current.getBoundingClientRect();
        mousePosition.current = {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        };
    }
  }, []);

  // Handle mouse leaving the container area
   const handleMouseLeave = useCallback(() => {
     mousePosition.current = { x: -1000, y: -1000 }; // Move mouse "off-screen" virtually
   }, []);

   // Setup and cleanup mouse listeners
   useEffect(() => {
     const container = containerRef.current;
     container.addEventListener('mousemove', handleMouseMove);
     container.addEventListener('mouseleave', handleMouseLeave);

     return () => {
       container.removeEventListener('mousemove', handleMouseMove);
       container.removeEventListener('mouseleave', handleMouseLeave);
       if (animationFrameId.current) {
         cancelAnimationFrame(animationFrameId.current);
       }
     };
   }, [handleMouseMove, handleMouseLeave]);


  // The main animation logic
  const animate = () => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) { // Exit if container is not yet available
        animationFrameId.current = requestAnimationFrame(animate);
        return;
    }

    const mouseX = mousePosition.current.x;
    const mouseY = mousePosition.current.y;
    let needsUpdate = false; // Track if any square actually changed

    squaresRef.current = squaresRef.current.map(square => {
      // --- Calculate distance to mouse ---
      const dx = square.x - mouseX;
      const dy = square.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetOpacity = MIN_OPACITY;
      let targetScale = 1;
      let repelX = 0;
      let repelY = 0;

      // --- Apply mouse interaction effects ---
      if (dist < INTERACTION_RADIUS) {
        const proximity = 1 - (dist / INTERACTION_RADIUS); // 0 (at edge) to 1 (at center)

        targetOpacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * proximity;
        targetScale = 1 + (MAX_SCALE - 1) * proximity;

        // Calculate repulsion force (stronger when closer)
        const repelForce = (1 - dist / INTERACTION_RADIUS) * MOUSE_REPEL_STRENGTH;
        // Normalized direction vector away from mouse
        const normDx = dx / (dist || 1); // Avoid division by zero
        const normDy = dy / (dist || 1);
        repelX = normDx * repelForce;
        repelY = normDy * repelForce;
      }

      // --- Update base velocity & Apply Repulsion ---
      square.vx += repelX;
      square.vy += repelY;

      // --- Apply friction/damping to velocity ---
      square.vx *= 0.95; // Slows down movement over time
      square.vy *= 0.95;

       // Ensure velocity doesn't get TOO slow to avoid floating point issues
       if (Math.abs(square.vx) < 0.01) square.vx = 0;
       if (Math.abs(square.vy) < 0.01) square.vy = 0;

      // --- Update position ---
      square.x += square.vx;
      square.y += square.vy;

      // --- Boundary checks (bounce effect) ---
      if (square.x < 0 || square.x > bounds.width) {
        square.vx *= -1; // Reverse horizontal velocity
        square.x = Math.max(0, Math.min(square.x, bounds.width)); // Clamp position
      }
      if (square.y < 0 || square.y > bounds.height) {
        square.vy *= -1; // Reverse vertical velocity
        square.y = Math.max(0, Math.min(square.y, bounds.height)); // Clamp position
      }

      // --- Smoothly interpolate opacity and scale towards target ---
      const lerpFactor = 0.1; // How quickly style adjusts (0 to 1)
      const newOpacity = square.opacity + (targetOpacity - square.opacity) * lerpFactor;
      const newScale = square.scale + (targetScale - square.scale) * lerpFactor;


      // Check if style actually changed significantly enough to warrant update
      if (Math.abs(newOpacity - square.opacity) > 0.01 || Math.abs(newScale - square.scale) > 0.01 || square.vx !== 0 || square.vy !== 0 ) {
          needsUpdate = true;
          square.opacity = newOpacity;
          square.scale = newScale;
      }

      return square;
    });

    // Only trigger a re-render if something changed
    if (needsUpdate) {
        setTick(tick => tick + 1); // Force re-render by updating state
    }


    // Continue the loop
    animationFrameId.current = requestAnimationFrame(animate);
  };


  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto" // pointer-events-auto needed to capture mouse events on this div
    >
      {squaresRef.current.map((square) => (
        <div
          key={square.id}
          className="absolute bg-gradient-to-br from-orange-400 to-amber-500 rounded-sm" // Orange square style
          style={{
            width: `${BASE_SIZE}px`,
            height: `${BASE_SIZE}px`,
            left: `0px`, // Use transform for positioning
            top: `0px`,
            transform: `translate(${square.x - BASE_SIZE / 2}px, ${square.y - BASE_SIZE / 2}px) scale(${square.scale})`, // Center square and apply scale
            opacity: square.opacity,
            willChange: 'transform, opacity', // Hint browser for optimization
            transition: 'opacity 0.1s linear, transform 0.1s linear' // Add slight transition for smoothness
          }}
        />
      ))}
    </div>
  );
};

export default ReactiveSquareBackground;