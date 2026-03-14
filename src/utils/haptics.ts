// src/utils/haptics.ts

export const vibrar = (patron: number | number[] = 40) => {
  // Verificamos si el celular tiene motor de vibración web disponible
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(patron);
  }
};