import { OrderList, OrderStats } from "@/src/types/order.types";
import React, { createContext, useCallback, useContext, useState } from "react";
import { orderService } from "../services/order.service";
import { useVendor } from "./vendor-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderContextType = {
  orders: OrderList;
  stats: OrderStats;
  isLoadingOrder: boolean;
  refreshOrders: () => Promise<void>;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_ORDERS: OrderList = {
  newOrders: [],
  pickupOrders: [],
  ongoingOrders: [],
  readyOrders: [],
  deliveryOrders: [],
  completedOrders: [],
};

const DEFAULT_STATS: OrderStats = {
  totalNew: 0,
  totalPickup: 0,
  totalOngoing: 0,
  totalReady: 0,
  totalDelivery: 0,
  totalCompleted: 0,
  completedRevenue: 0,
};

// ─── Context ──────────────────────────────────────────────────────────────────

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id;

  const [orders, setOrders] = useState<OrderList>(DEFAULT_ORDERS);
  const [stats, setStats] = useState<OrderStats>(DEFAULT_STATS);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false); // ← false, not true

  const refreshOrders = useCallback(async () => {
    if (!vendorId) return;
    setIsLoadingOrder(true);
    try {
      const res = await orderService.getOrders(vendorId);
      setOrders(res.data.orders);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoadingOrder(false);
    }
  }, [vendorId]);

  return (
    <OrderContext.Provider
      value={{ orders, stats, isLoadingOrder, refreshOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within an OrderProvider");
  return ctx;
}
