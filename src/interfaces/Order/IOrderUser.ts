interface IOrderUser {
  id: number;
  orderDate: string;
  firstName: string;
  lastName: string;
  orderItems: IOrderItems[];
  phoneNumber: number;
  email: string;
  payment: string;
  address: IAddress;
  orderTotal: number;
  tax: number;
  subtotal: number;
  discount: number;
}