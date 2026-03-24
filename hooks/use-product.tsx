/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@/lib/api-error";
import {
  createProductService,
  fetchAllProductService,
} from "@/service/product.service";
import { IProduct, ProductCreateDto } from "@/types/product-response-dto";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProductService,
  });
};
export const useCreateProduct = (
  onSuccess?: (response: any) => void,
  onError?: (message: Error | ApiError | unknown | string) => void
) => {
  return useMutation({
    mutationFn: ({ data }: { data: ProductCreateDto }) =>
      createProductService(data),
    onSuccess: (data: any) => {
      console.log("dat is created");
      if (onSuccess) {
        console.log("with this data ", data);
        onSuccess(data);
      }
    },
    onError: (error: Error | ApiError | unknown | string) => {
      console.log("error happened");
      if (onError) {
        console.log(error);
        onError(error);
      }
    },
  });
};
