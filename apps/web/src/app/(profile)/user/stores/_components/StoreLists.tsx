"use client";

import { useQuery } from "@tanstack/react-query";
import { StoreProps } from "@/interfaces/store";
import { getCookies } from "@/actions/cookies";
import axios from "axios";
import Store from "./Store";
import { useSearchParams } from "next/navigation";
import EditStore from "./EditStore";

export default function StoreLists({ api_url }: { api_url: string }) {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const storeId = (action && Number(action?.split("-")[1])) || null;

  const { data: stores, isLoading } = useQuery<StoreProps[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const token = await getCookies("token");
      if (!token) return;
      const { data } = await axios.get(`${api_url}/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.data;
    },
  });

  const storeWithStoreId =
    !isLoading &&
    storeId !== null &&
    stores?.filter((store) => store?.id === storeId);

  return (
    <>
      {storeId || storeWithStoreId ? (
        <EditStore
          id={Number(storeId)}
          api_url={api_url}
          store={storeWithStoreId && storeWithStoreId[0]}
        />
      ) : (
        <div className="max-h-[100vh] w-full space-y-3 overflow-y-auto md:max-h-[80vh]">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            !isLoading &&
            stores?.map((store) => (
              <Store store={store} api_url={api_url} key={store.id} />
            ))
          )}
        </div>
      )}
    </>
  );
}
