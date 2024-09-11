export default interface Corte {
  storeId: number;
  efectivo: {
    total: number;
    imageUrl: string;
  };
  tarjeta: {
    total: number;
    imageUrl: string;
  };
  gastos: {
    total: number;
    imageUrl: string;
  };
  date: Date;
  userId: number;
}
