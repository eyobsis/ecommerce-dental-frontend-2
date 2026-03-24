/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSettingInfo, updateSettingInfo } from "@/app/service/setting-service";
import { ApiError } from "@/lib/api-error";
import { useMutation } from "@tanstack/react-query";

export const useCreateSetting = (onSuccess?: (response: any) => void, onError?: (message: Error | ApiError | unknown | string) => void) => {


    return useMutation({
        mutationFn: ({ data }: { data: any }) =>
            createSettingInfo(data),
        onSuccess: (data: any) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: (error: Error | ApiError | unknown | string) => {
            if (onError) {
                onError(error);
            }
        }
    });
};


export const useSettingUpdate = (onSuccess?: (response: any) => void, onError?: (message: Error | ApiError | unknown | string) => void) => {


    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) =>
            updateSettingInfo(id, data),
        onSuccess: (data: any) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: (error: Error | ApiError | unknown | string) => {
            if (onError) {
                onError(error);
            }
        }
    });
};

