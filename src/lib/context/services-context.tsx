import { ServiceItem, ServiceItemInput } from "@/src/types/service.types";
import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { vendorServicesService } from "../services/services-service";
import { useVendor } from "./vendor-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServicesState {
  items: ServiceItem[];
  loading: boolean;
  /** Granular in-flight keys e.g. 'create' | 'update:123' | 'delete:123' */
  mutating: Set<string>;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ServiceItem[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "MUTATE_START"; key: string }
  | { type: "MUTATE_END"; key: string }
  | { type: "ITEM_CREATED"; payload: ServiceItem }
  | { type: "ITEM_UPDATED"; payload: ServiceItem }
  | { type: "ITEM_DELETED"; id: string }
  | { type: "CLEAR_ERROR" };

interface ServicesContextValue extends ServicesState {
  groups: { category: string; items: ServiceItem[] }[];
  fetchItems: () => Promise<void>;
  createItem: (input: ServiceItemInput) => Promise<ServiceItem | null>;
  updateItem: (
    id: string,
    input: ServiceItemInput,
  ) => Promise<ServiceItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  clearError: () => void;
  isMutating: (key: string) => boolean;
}

// ─── Error helper ─────────────────────────────────────────────────────────────

/** Extracts a readable message from an axios error or unknown throw. */
function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // Server sent a response with error body
    const serverMsg = (err.response?.data as any)?.message;
    if (serverMsg) return serverMsg;
    // Network / timeout
    if (err.code === "ECONNABORTED")
      return "Request timed out. Check your connection.";
    if (!err.response) return "Network error. Check your connection.";
    return `Server error (${err.response.status})`;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: ServicesState = {
  items: [],
  loading: false,
  mutating: new Set(),
  error: null,
};

function reducer(state: ServicesState, action: Action): ServicesState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "MUTATE_START": {
      const mutating = new Set(state.mutating);
      mutating.add(action.key);
      return { ...state, mutating };
    }

    case "MUTATE_END": {
      const mutating = new Set(state.mutating);
      mutating.delete(action.key);
      return { ...state, mutating };
    }

    case "ITEM_CREATED":
      return { ...state, items: [...state.items, action.payload] };

    case "ITEM_UPDATED":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? action.payload : i,
        ),
      };

    case "ITEM_DELETED":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ServicesContext = createContext<ServicesContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// Change this to vendors service Provider
export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeVendor } = useVendor(); // get active vendor
  const vendorId = activeVendor?.id;

  // ── GET /vendor/service-items ─────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    if (!vendorId) return; // guard
    dispatch({ type: "FETCH_START" });
    try {
      const data = await vendorServicesService.getAll(vendorId);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: extractError(err) });
    }
  }, [vendorId]); // re-fetch when vendor switches

  // ── POST /vendor/service-items ────────────────────────────────────────────
  const createItem = useCallback(
    async (input: ServiceItemInput): Promise<ServiceItem | null> => {
      console.log("Starting item creation with input:", input);
      console.log("Creating item with input:", input);
      if (!vendorId) return null;
      const key = "create";
      dispatch({ type: "MUTATE_START", key });
      try {
        const data = await vendorServicesService.create(vendorId, input);
        dispatch({ type: "ITEM_CREATED", payload: data });
        return data;
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: extractError(err) });
        return null;
      } finally {
        dispatch({ type: "MUTATE_END", key });
      }
    },
    [vendorId],
  );

  // ── PUT /vendor/service-items/:id ─────────────────────────────────────────
  const updateItem = useCallback(
    async (
      id: string,
      input: ServiceItemInput,
    ): Promise<ServiceItem | null> => {
      if (!vendorId) return null;
      const key = `update:${id}`;
      dispatch({ type: "MUTATE_START", key });
      try {
        const data = await vendorServicesService.update(vendorId, id, input);
        dispatch({ type: "ITEM_UPDATED", payload: data });
        return data;
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: extractError(err) });
        return null;
      } finally {
        dispatch({ type: "MUTATE_END", key });
      }
    },
    [vendorId],
  );

  // ── DELETE /vendor/service-items/:id ──────────────────────────────────────

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      if (!vendorId) return false;
      const key = `delete:${id}`;
      dispatch({ type: "MUTATE_START", key });
      try {
        await vendorServicesService.remove(vendorId, id);
        dispatch({ type: "ITEM_DELETED", id });
        return true;
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: extractError(err) });
        return false;
      } finally {
        dispatch({ type: "MUTATE_END", key });
      }
    },
    [vendorId],
  );

  // ── Derived state ─────────────────────────────────────────────────────────

  const groups = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const item of state.items) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    }
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [state.items]);

  const isMutating = useCallback(
    (key: string) => state.mutating.has(key),
    [state.mutating],
  );

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  // Fetch items on mount and when vendor changes
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <ServicesContext.Provider
      value={{
        ...state,
        groups,
        fetchItems,
        createItem,
        updateItem,
        deleteItem,
        clearError,
        isMutating,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext);
  if (!ctx)
    throw new Error("useServices must be used inside <ServicesProvider>");
  return ctx;
}
