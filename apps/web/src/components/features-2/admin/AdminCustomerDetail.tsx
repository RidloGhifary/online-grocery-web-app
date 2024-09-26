"use client";
import { currentDetailCustomerAtom } from "@/stores/customerStores";
import { useAtom } from "jotai";

export default function AdminCustomerDetail() {
  const [currentCustomer] = useAtom(currentDetailCustomerAtom);

  const customer = currentCustomer;
  

  if (!customer) {
    return <></>;
  }

  return (
    <div className="w-full max-w-3xl">
      {/* <div className="flex justify-center pb-2">
        <h1 className="mt-5 text-center text-3xl font-bold text-gray-800 lg:text-4xl">
          Customer Detail
        </h1>
      </div> */}

      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-full flex-col p-6">
          <table className="mb-8 w-full text-gray-800">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">First Name</td>
                <td className="py-2 text-right text-sm">{customer.first_name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Last Name</td>
                <td className="py-2 text-right text-sm">{customer.last_name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Middle Name</td>
                <td className="py-2 text-right text-sm">{customer.middle_name??'-'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Username</td>
                <td className="py-2 text-right text-sm">{customer.username}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Email</td>
                <td className="py-2 text-right text-sm">{customer.email}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Phone Number</td>
                <td className="py-2 text-right text-sm">{customer.phone_number??'-'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Gender</td>
                <td className="py-2 text-right text-sm">{customer.gender}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Referal</td>
                <td className="py-2 text-right text-sm">{customer.referral}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Google Linked</td>
                <td className="py-2 text-right text-sm">{customer.is_google_linked?'yes':'no'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Validated At</td>
                <td className="py-2 text-right text-sm">
                {new Date(
                  customer.validated_at as unknown as string,
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
