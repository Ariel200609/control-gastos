import { useState, useEffect } from 'react';

// Este hook recibe una clave (ej: 'mis-gastos') y un valor inicial
export function useLocalStorage<T>(key: string, initialValue: T) {
  
  // 1. Al arrancar, nos fijamos si ya hay algo guardado con esa clave
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Si hay algo, lo convertimos de texto a objeto. Si no, usamos el valor inicial.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error leyendo localStorage', error);
      return initialValue;
    }
  });

  // 2. Cada vez que el 'storedValue' cambie, lo guardamos en el teléfono
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error guardando en localStorage', error);
    }
  }, [key, storedValue]);

  // Devolvemos el valor y la función para actualizarlo, igual que un useState normal
  return [storedValue, setStoredValue] as const;
}