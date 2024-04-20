export class OrderResponse {
  id: number;
  username: string;
  shippingPrice: number;
  comment: string;
  status: OrderStatus;
  shipperId: number;
  orderDate: Date;
  requiredDate: Date;
  shippedDate: Date;
  orderDetail: OrderDetailResponse[];
}

export class CreateOrderRequest {
  shippingPrice: number;
  comment?: string;
  status?: OrderStatus;
  shipperId: number;
  orderDate: Date;
  requiredDate: Date;
  shippedDate?: Date;
  orderDetail: OrderDetailRequest[];
}

export class OrderDetailRequest {
  productId: number;
  quantityOrdered: number;
  priceEach: number;
}

export class UserUpdateOrderRequest {
  // shippingPrice?: number;
  comment?: string;
  // status?: OrderStatus;
  // shipperId?: number;
  // orderDate?: Date;
  // requiredDate?: Date;
  // shippedDate?: Date;
}

export class ShippingUpdateOrderRequest {
  // shippingPrice?: number;
  shippedDate?: Date;
  status?: OrderStatus;
}

export class OrderDetailResponse {
  // id: number;
  // orderId: number;
  productId: number;
  quantityOrdered: number;
  priceEach: number;
}

enum OrderStatus {
  In_Process = 'In Process',
  Shipped = 'Shipped',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}
