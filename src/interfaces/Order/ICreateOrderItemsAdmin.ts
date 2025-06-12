export interface ICreateOrderItemsAdmin {
    id: number;
    step: number;
    status: string;
    size: number;
    quantity: number;
    productId: number;
    orderId: number;
  }