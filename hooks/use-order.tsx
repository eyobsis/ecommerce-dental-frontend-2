import { getOrderService } from "@/service/order.service";
import { useQuery } from "@tanstack/react-query";

export const useFetchOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrderService,
  });
};
