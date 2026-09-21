import { useQuery } from "@tanstack/react-query";
import { getStores, getUpdateMeta } from "@/lib/firebase/stores";

export const useStores = () => {
  const query = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    staleTime: 1000 * 60 * 5,
  });
  return {
    stores: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useUpdateMeta = () =>
  useQuery({
    queryKey: ["update-meta"],
    queryFn: getUpdateMeta,
  });
