"use client";

import { useQuery } from "@tanstack/react-query";
import { StoreProps } from "@/interfaces/store";
import { getCookies } from "@/actions/cookies";
import axios from "axios";
import Store from "./Store";

export default function StoreLists({ api_url }: { api_url: string }) {
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

  return (
    <div className="max-h-[100vh] w-full space-y-3 overflow-y-auto md:max-h-[80vh]">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        !isLoading &&
        stores?.map((store) => <Store store={store} key={store.id} />)
      )}
    </div>
  );
}
