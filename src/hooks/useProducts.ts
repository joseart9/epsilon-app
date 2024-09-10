"use client";

import { useEffect, useState } from "react";
import Product from "@/types/product";
import { getProductsByStoreId } from "@/server/actions/product";

const useProducts = (storeId: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndSetProducts = async () => {
    if (storeId <= 0) {
      // No hacer peticiones si storeId no es válido
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getProductsByStoreId(storeId);

      console.log(data);

      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetProducts();
  }, [storeId]);

  return [products, loading, error, fetchAndSetProducts] as const;
};

export default useProducts;
