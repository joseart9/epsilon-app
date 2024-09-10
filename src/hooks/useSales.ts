"use client";

import { useEffect, useState } from "react";
import Sale from "@/types/sale";
import { getSalesByStoreId } from "@/server/actions/sales";

const useSales = (storeId: number) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndSetSales = async () => {
    if (!storeId) {
      // No hacer peticiones si storeId es inválido
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getSalesByStoreId(storeId);

      console.log(data);

      setSales(data);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetSales();
  }, [storeId]);

  return [sales, loading, error] as const;
};

export default useSales;
