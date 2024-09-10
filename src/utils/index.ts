export function saveSalesConverter(sales: any, storeId: number) {
  // Convert sales to a format that can be saved to db
  // sales schema: {
  // cantidad: string;
  // key: string;
  // producto: string;
  // sku: string;
  // }

  // prodcut schema: {
  // name: string;
  // stock: number;
  // sku: string;
  // }

  // db schema: {
  // storeId: number;
  // products: Product[];

  // convert sales to db schema and return an Object

  const products = sales.map((sale: any) => {
    return {
      name: sale.producto,
      stock: parseInt(sale.cantidad),
      sku: sale.sku,
    };
  });

  return {
    storeId: storeId,
    products,
  };
}
