export interface ServiceItem {
  id: string;
  category: string;
  name: string;
  amount: string;
}

export type ServiceItemInput = Omit<ServiceItem, "id">;
export type ModalMode = "create" | "edit" | null;
