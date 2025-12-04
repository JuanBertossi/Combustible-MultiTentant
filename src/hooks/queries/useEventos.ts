// src/hooks/queries/useEventos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventosService } from "@/services";
import type { EventoFormData, EventoFilters, ValidarEventoData } from "@/types";
import { toast } from "sonner";

// Query Keys
export const eventosKeys = {
  all: ["eventos"] as const,
  lists: () => [...eventosKeys.all, "list"] as const,
  list: (filters?: EventoFilters) => [...eventosKeys.lists(), filters] as const,
  pendientes: (empresaId?: number) => [...eventosKeys.all, "pendientes", empresaId] as const,
  details: () => [...eventosKeys.all, "detail"] as const,
  detail: (id: number) => [...eventosKeys.details(), id] as const,
  resumen: (empresaId?: number) => [...eventosKeys.all, "resumen", empresaId] as const,
};

/**
 * Hook para listar eventos
 */
export function useEventos(filters?: EventoFilters) {
  return useQuery({
    queryKey: eventosKeys.list(filters),
    queryFn: () => eventosService.list(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para listar eventos pendientes
 */
export function useEventosPendientes(empresaId?: number) {
  return useQuery({
    queryKey: eventosKeys.pendientes(empresaId),
    queryFn: () => eventosService.listPendientes(empresaId),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 2, // Refetch cada 2 minutos
  });
}

/**
 * Hook para obtener evento por ID
 */
export function useEvento(id: number) {
  return useQuery({
    queryKey: eventosKeys.detail(id),
    queryFn: () => eventosService.getById(id),
    enabled: id > 0,
  });
}

/**
 * Hook para obtener resumen de eventos
 */
export function useEventosResumen(empresaId?: number) {
  return useQuery({
    queryKey: eventosKeys.resumen(empresaId),
    queryFn: () => eventosService.getResumen(empresaId),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para crear evento
 */
export function useCreateEvento(empresaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventoFormData) => eventosService.create(data, empresaId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.pendientes() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.resumen() });
      toast.success(response.message || "Evento creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear evento");
    },
  });
}

/**
 * Hook para actualizar evento
 */
export function useUpdateEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventoFormData> }) =>
      eventosService.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventosKeys.resumen() });
      toast.success(response.message || "Evento actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar evento");
    },
  });
}

/**
 * Hook para eliminar evento
 */
export function useDeleteEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventosService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.pendientes() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.resumen() });
      toast.success(response.message || "Evento eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar evento");
    },
  });
}

/**
 * Hook para validar/rechazar evento
 */
export function useValidarEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ValidarEventoData) => eventosService.validar(data),
    onSuccess: (response, { accion }) => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.pendientes() });
      queryClient.invalidateQueries({ queryKey: eventosKeys.resumen() });
      toast.success(
        accion === "validar" ? "Evento validado exitosamente" : "Evento rechazado"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al procesar evento");
    },
  });
}

