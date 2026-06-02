import { VendorType } from "./vendor.types";

export type Order = {
  id: string;
  customerId: string;
  vendorId: string;
  orderNumber: string;
  scheduledDate: string;
  pickupDate: string;
  deliveryDate: string;
  orderType: string;
  itemCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderList = {
  newOrders: Order[];
  pickupOrders: Order[];
  ongoingOrders: Order[];
  readyOrders: Order[];
  deliveryOrders: Order[];
  completedOrders: Order[];
};

export type OrderStats = {
  totalNew: number;
  totalPickup: number;
  totalOngoing: number;
  totalReady: number;
  totalDelivery: number;
  totalCompleted: number;
  completedRevenue: number;
};

export type OrdersResponse = {
  orders: OrderList;
  stats: OrderStats;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
};

export type OrderStatus =
  | "new"
  | "pickup"
  | "ongoing"
  | "ready"
  | "delivery"
  | "completed";

export type OrderDetailResponse = {
  id: string;
  customerName: string;
  orderCompletionDate: string;
  createdAt: string;
  currentStatus: OrderStatus;
  serviceType: VendorType;
  items: OrderItem[];
  pickupFee: number;
  deliveryFee: number;
};

export const NEXT_STATUS_MAP: Record<OrderStatus, OrderStatus> = {
  new: "ongoing",
  pickup: "ongoing",
  ongoing: "ready",
  ready: "delivery",
  delivery: "completed",
  completed: "completed",
};
