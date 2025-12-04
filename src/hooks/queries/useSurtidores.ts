// src/hooks/queries/useSurtidores.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { surtidoresService } from "@/services";
import type { SurtidorFormData, PaginationParams } from "@/types";
import { toast } from "sonner";

export const surtidoresKeys = {
  all: ["surtidores"] as const,
  lists: () => [...surtidoresKeys.all, "list"] as const,
  list: (empresaId: number, params?: PaginationParams & { search?: string }) =>
    [...surtidoresKeys.lists(), empresaId, params] as const,
  details: () => [...surtidoresKeys.all, "detail"] as const,
  detail: (id: number) => [...surtidoresKeys.details(), id] as const,
  stats: (id: number) => [...surtidoresKeys.all, "stats", id] as const,
};

export function useSurtidores(
  empresaId: number,
  params?: PaginationParams & { search?: string; tipo?: string; estado?: string }
) {
  return useQuery({
    queryKey: surtidoresKeys.list(empresaId, params),
    queryFn: () => surtidoresService.list(empresaId, params),
    enabled: empresaId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSurtidor(id: number) {
  return useQuery({
    queryKey: surtidoresKeys.detail(id),
    queryFn: () => surtidoresService.getById(id),
    enabled: id > 0,
  });
}

export function useSurtidorStats(id: number) {
  return useQuery({
    queryKey: surtidoresKeys.stats(id),
    queryFn: () => surtidoresService.getStats(id),
    enabled: id > 0,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateSurtidor(empresaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SurtidorFormData) => surtidoresService.create(empresaId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: surtidoresKeys.lists() });
      toast.success(response.message || "Surtidor creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear surtidor");
    },
  });
}

export function useUpdateSurtidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SurtidorFormData> }) =>
      surtidoresService.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: surtidoresKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surtidoresKeys.detail(id) });
      toast.success(response.message || "Surtidor actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar surtidor");
    },
  });
}

export function useDeleteSurtidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => surtidoresService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: surtidoresKeys.lists() });
      toast.success(response.message || "Surtidor eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar surtidor");
    },
  });
}

