"use client";

import { useEffect, useState } from "react";

/**
 * Componente que envuelve el contenido y elimina errores de hidratación
 * demorando la renderización en el cliente hasta después de la hidratación.
 * Útil para eliminar errores causados por extensiones del navegador que
 * añaden atributos no esperados como bis_skin_checked.
 */

interface IgnoreHydrationErrorsProps {
  children: React.ReactNode;
}

export default function IgnoreHydrationErrors({ children }: IgnoreHydrationErrorsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // En el navegador, después de hidratación
    setIsMounted(true);
  }, []);

  // En la primera renderización en el cliente, renderiza un placeholder
  // para mantener el diseño estable y evitar errores de hidratación
  if (!isMounted) {
    return null;
  }

  // Una vez montado, renderiza el contenido real
  return <>{children}</>;
} 