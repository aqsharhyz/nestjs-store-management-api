import { OrderResponse } from 'src/order/order.model';

export class ShipperResponse {
  id: number;
  name: string;
  phone: string;
  // phone?: string;
  // address: string;
  orders?: OrderResponse[];
}

export class CreateShipperRequest {
  name: string;
  phone: string;
  // address?: string;
}

export class UpdateShipperRequest {
  name?: string;
  phone?: string;
  // address?: string;
}
