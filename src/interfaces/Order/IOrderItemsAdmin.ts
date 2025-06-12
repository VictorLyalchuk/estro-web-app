export interface IOrderItemsAdmin {
  id: number;
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
  order: IOrderAdmin;
  product: IProductAdmin;
  orderPayment: IOrderPaymentAdmin
}

export interface IProductAdmin {
  id: number;
  name_en: string;
  name_uk: string;
  name_es: string;
  name_fr: string;
  season_en: string;
  season_uk: string;
  season_es: string;
  season_fr: string;
  color_en: string;
  color_uk: string;
  color_es: string;
  color_fr: string;
  price: number;
  article: string;
  imagesPath: string[] | null;
  subCategoryId: number;
  categoryId: number;
  categoryName_en: string;
  subCategoryName_en: string[] | null;
  mainCategoryName_en: string[] | null;
  storages: IStorages[] | null;
}

export interface IStorages {
  id: number;
  productId: number;
  productQuantity: number;
  size: string;
  inStock: boolean;
}

interface IOrderAdmin {
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

interface IOrderPaymentAdmin {
  payment: string;
  paymentMethod: string;
  cardNumber: string;
  cardMonthExpires: string;
  cardYearExpires: string;
  cardHolderName: string;
}