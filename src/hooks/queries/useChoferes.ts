// src/hooks/queries/useChoferes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { choferesService } from "@/services";
import type { ChoferFormData, PaginationParams } from "@/types";
import { toast } from "sonner";

export const choferesKeys = {
  all: ["choferes"] as const,
  lists: () => [...choferesKeys.all, "list"] as const,
  list: (empresaId: number, params?: PaginationParams & { search?: string }) =>
    [...choferesKeys.lists(), empresaId, params] as const,
  details: () => [...choferesKeys.all, "detail"] as const,
  detail: (id: number) => [...choferesKeys.details(), id] as const,
  stats: (id: number) => [...choferesKeys.all, "stats", id] as const,
};

export function useChoferes(
  empresaId: number,
  params?: PaginationParams & { search?: string; estado?: string }
) {
  return useQuery({
    queryKey: choferesKeys.list(empresaId, params),
    queryFn: () => choferesService.list(empresaId, params),
    enabled: empresaId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useChofer(id: number) {
  return useQuery({
    queryKey: choferesKeys.detail(id),
    queryFn: () => choferesService.getById(id),
    enabled: id > 0,
  });
}

export function useChoferStats(id: number) {
  return useQuery({
    queryKey: choferesKeys.stats(id),
    queryFn: () => choferesService.getStats(id),
    enabled: id > 0,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateChofer(empresaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChoferFormData) => choferesService.create(empresaId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: choferesKeys.lists() });
      toast.success(response.message || "Chofer creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear chofer");
    },
  });
}

export function useUpdateChofer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ChoferFormData> }) =>
      choferesService.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: choferesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: choferesKeys.detail(id) });
      toast.success(response.message || "Chofer actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar chofer");
    },
  });
}

export function useDeleteChofer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => choferesService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: choferesKeys.lists() });
      toast.success(response.message || "Chofer eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar chofer");
    },
  });
}

