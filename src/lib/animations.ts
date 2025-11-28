export const TRANSITIONS = {
  // Smooth, professional entry for cards and layout
  spring: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
  // Standard UI transition (fades, simple slides)
  standard: {
    duration: 0.3,
    // Add 'as const' here 👇
    ease: [0.25, 0.1, 0.25, 1] as const, 
  },
  // Slower, dramatic reveal for the "Thank You" page
  dramatic: {
    duration: 0.8,
    // Add 'as const' here 👇
    ease: [0.22, 1, 0.36, 1] as const,
  }
};

export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }
};