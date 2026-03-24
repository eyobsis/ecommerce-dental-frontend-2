/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useUsers.ts
import { registerEmployee, updateEmployee } from "@/app/service/user-service";
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/lib/api-error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => apiClient(`/client?page=${page}&limit=${limit}`),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient(`/client/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/client/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateEmployee = (
  onSuccess?: (message: any) => void,
  onError?: (message: Error | ApiError | unknown | string) => void
) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateEmployee(id, data),
    onSuccess: (data: any) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: Error | ApiError | unknown | string) => {
      if (onError) {
        onError(error);
      }
    },
  });
};

export const useCreateUser = (
  onSuccess?: (res: any) => void,
  onError?: (res: Error | ApiError | unknown | string) => void
) => {
  return useMutation({
    mutationFn: ({ data }: { data: any }) => registerEmployee(data),
    onSuccess: (data: any) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: Error | ApiError | unknown | string) => {
      if (onError) {
        onError(error);
      }
    },
  });
};
