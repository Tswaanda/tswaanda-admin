import { Principal } from "@dfinity/principal";
import { OrderProduct } from "../../../declarations/marketplace_backend/marketplace_backend.did";

export interface ProductOrderType {
  status: string;
  userEmail: string;
  dateCreated: string;
  step: bigint;
  orderProducts: OrderProduct;
  taxEstimate: number;
  orderOwner: Principal;
  orderId: string;
  shippingEstimate: number;
  totalPrice: number;
  orderNumber: string;
  subtotal: number;
}
