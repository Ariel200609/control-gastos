import confetti from 'canvas-confetti';

export const festejarPago = () => {
  // Explosión elegante con colores de la marca (Bosque y Menta)
  confetti({
    particleCount: 85,
    spread: 75,
    origin: { y: 0.75 },
    colors: ['#2d6a4f', '#52b788', '#d8f3dc', '#f59e0b', '#10b981'],
    disableForReducedMotion: true
  });
};

export const festejarAhorro = () => {
  // Lluvia dorada y esmeralda para la bóveda de ahorros
  const duration = 1.8 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 40 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#f59e0b', '#fbbf24', '#10b981', '#34d399'] });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#f59e0b', '#fbbf24', '#10b981', '#34d399'] });
  }, 250);
};
