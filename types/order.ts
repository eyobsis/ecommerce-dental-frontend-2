export interface IOrder {
  id: string;
  name: string; //customer name
  cost: number;
  paymentImage: string; //payment screenshot
  detail: IOrderDetail[];
  status: string;
  createdAt: string;
}

export interface IOrderDetail {
  productId: string;
  productName: string;
  productCost: number;
}
