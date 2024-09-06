"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";

const RAJA_ONGKIR_API_KEY = process.env.RAJA_ONGKIR_API_KEY;

export async function getDeliveryOptions({
  origin,
  destination,
  weight,
  courier,
}: {
  origin: number | string;
  destination: number | string;
  weight: number;
  courier: string;
}): Promise<CommonResultInterface<any>> {
  const result = {
    ok: false,
  } as CommonResultInterface<any>;

  try {
    const body = new URLSearchParams({
      origin: origin.toString(),
      destination: destination.toString(),
      weight: weight.toString(),
      courier: courier,
    });

    const response = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        key: RAJA_ONGKIR_API_KEY as string,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      result.error = `Failed to fetch product list: ${response.statusText}`;
      return result;
    }

    const data = await response.json();
    result.data = data.rajaongkir;
    result.ok = true;
    result.message = "Data fetched successfully";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to fetch product list";
    console.log(error);
  }

  return result;
}
