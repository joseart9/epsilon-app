"use client";

import { useEffect, useState } from "react";
import Corte from "@/types/corte";
import { getCortesByStoreId } from "@/server/actions/corte"; // Asegúrate de que esta función esté correctamente implementada

const useCortes = (storeId: number) => {
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndSetCortes = async () => {
    if (storeId <= 0) {
      // No hacer peticiones si storeId no es válido
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCortesByStoreId(storeId); // Llamada a la función que obtiene los cortes
      console.log(data);

      setCortes(data);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetCortes();
  }, [storeId]);

  return [cortes, loading, error, fetchAndSetCortes] as const;
};

export default useCortes;
