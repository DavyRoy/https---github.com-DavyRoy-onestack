// Общие анимации для всех компонентов страницы
// Оптимизировано для производительности и переиспользования

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
    delay,
  },
  viewport: { once: true, margin: "-100px" },
});

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.7,
    ease: "easeOut",
    delay,
  },
  viewport: { once: true, margin: "-50px" },
});

export const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
  viewport: { once: true, margin: "-100px" },
};

export const slideInFromLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
    delay,
  },
  viewport: { once: true, margin: "-100px" },
});

export const slideInFromRight = (delay = 0) => ({
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
    delay,
  },
  viewport: { once: true, margin: "-100px" },
});

// Модальные окна
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
};

// Кнопки и интерактивные элементы
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const buttonTap = {
  scale: 0.98,
};
