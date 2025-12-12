import { useQuery } from "@tanstack/react-query";
import {
  fetchPerformanceList,
  fetchPerformance,
  fetchRanking,
  type PerformanceSummary,
  type PerformanceDetail,
} from "../../api/performances";

export function usePerformanceList(params?: {
  page?: number; size?: number; keyword?: string; region?: string; genre?: string;
}) {
  return useQuery<PerformanceSummary[]>({
    queryKey: ["performances", params],
    queryFn: () => fetchPerformanceList(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function usePerformance(id: string) {
  return useQuery<PerformanceDetail>({
    queryKey: ["performance", id],
    queryFn: () => fetchPerformance(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useRanking(params?: { country?: string; genre?: string }) {
  return useQuery<PerformanceSummary[]>({
    queryKey: ["ranking", params],
    queryFn: () => fetchRanking(params),
    staleTime: 60_000,
  });
}
