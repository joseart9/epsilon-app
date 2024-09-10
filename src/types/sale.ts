import Product from "@/types/product";

export default interface Sale {
  storeId: number;
  products: Product[];
  date: Date;
}
