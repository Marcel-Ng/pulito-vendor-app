import { useQuery } from "@tanstack/react-query";
import { useVendor } from "../context/vendor-context";
import { vendorService } from "../services/vendor.service";

async function fetchBalance(vendorId: string) {
  console.log("started now");
  const data = await vendorService.getBalance(vendorId);
  console.log("balancee", data.data);
  return data.data;
}

export function useVendorBalance() {
  const { activeVendor } = useVendor();
  const vendorId = activeVendor?.id;
  return useQuery({
    queryKey: ["vendorBalance"],
    queryFn: () => fetchBalance(vendorId!),
    enabled: !!vendorId,
    staleTime: 1000 * 60 * 2,
  });
}
