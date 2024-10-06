"use server";

import CommonResultInterface from "@/interfaces/CommonResultInterface";

const RAJA_ONGKIR_API_KEY = "9b5ac7bd48ba7e0e6d3b3faf14577dff";

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
    // Log the request parameters
    // console.log("Request Parameters: ", {
    //   origin,
    //   destination,
    //   weight,
    //   courier,
    // });

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

    // Log response status and headers
    // console.log("Response Status: ", response.status);
    // console.log("Response Headers: ", response.headers);

    // Parse response body
    let responseData;
    try {
      responseData = await response.json(); // Attempt to parse JSON
      // console.log("Full API Response: ", responseData);
    } catch (jsonError) {
      // console.error("Error parsing JSON: ", jsonError);
      result.error = "Failed to parse response body";
      return result;
    }

    if (!response.ok) {
      result.error = `Failed to fetch product list: ${response.statusText}`;
      return result;
    }

    result.data = responseData.rajaongkir;
    result.ok = true;
    result.message = "Data fetched successfully";
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Failed to fetch product list";
    // console.log("Fetch error: ", error);
  }

  return result;
}
