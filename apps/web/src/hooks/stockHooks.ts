import { useQuery } from "@tanstack/react-query";
import { StockAdjustment } from "@/interfaces/StockInterface";
import CommonPaginatedResultInterface from "@/interfaces/CommonPaginatedResultInterface";
import { getJournals } from "@/actions/stock";
import { queryKeys } from "@/constants/queryKeys";

export function useJournalsWithFilter({
  page = 1,
  limit = 20,
  store_id,
}: {
  page?: number;
  limit?: number;
  store_id?: number;
}) {
  let keys: {} | undefined = undefined;
  if (page || limit || store_id) {
    keys = {
      page: page ?? undefined,
      limit: limit ?? undefined,
      store_id: store_id ?? undefined,
    };
  }

  return useQuery<CommonPaginatedResultInterface<StockAdjustment[]>>({
    queryKey: [queryKeys.stockJournals, keys || undefined],
    queryFn: () => getJournals({ page, limit, store_id }),
  });
}
