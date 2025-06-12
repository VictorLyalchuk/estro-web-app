interface IOrderItems {
  name_en: string;
  name_uk: string;
  name_es: string;
  name_fr: string;
  description_en: string;
  description_uk: string;
  description_es: string;
  description_fr: string;
  price: number;
  step: number;
  status: string;
  imagePath: string;
  dueDate: string;
  article: string;
  size: number;
  quantity: number;
  productId: number;
  orderId: number;
  orderPayment: IOrderPayment
}

interface IOrderPayment {
  payment: string;
  paymentMethod: string;
  cardNumber: string;
  cardMonthExpires: string;
  cardYearExpires: string;
  cardHolderName: string;
}

interface DailyOrderTotalDTO {
  date: Date;
  totalOrders: number;
  totalAmount: number;
}