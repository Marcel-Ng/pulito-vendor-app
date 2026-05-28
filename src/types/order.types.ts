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
