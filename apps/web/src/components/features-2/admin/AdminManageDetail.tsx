"use client";
import { currentDetailAdminAtom } from "@/stores/adminStores";
import { useAtom } from "jotai";

export default function AdminManageDetail() {
  const [currentAdminData] = useAtom(currentDetailAdminAtom);

  const admin = currentAdminData;

  if (!admin) {
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
                <td className="py-2 text-right text-sm">{admin.first_name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Last Name</td>
                <td className="py-2 text-right text-sm">{admin.last_name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Middle Name</td>
                <td className="py-2 text-right text-sm">
                  {admin.middle_name ?? "-"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Username</td>
                <td className="py-2 text-right text-sm">{admin.username}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Email</td>
                <td className="py-2 text-right text-sm">{admin.email}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Phone Number</td>
                <td className="py-2 text-right text-sm">
                  {admin.phone_number ?? "-"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Gender</td>
                <td className="py-2 text-right text-sm">{admin.gender}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Referal</td>
                <td className="py-2 text-right text-sm">{admin.referral}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Google Linked</td>
                <td className="py-2 text-right text-sm">
                  {admin.is_google_linked ? "yes" : "no"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Validated At</td>
                <td className="py-2 text-right text-sm">
                  {new Date(
                    admin.validated_at as unknown as string,
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-sm font-bold">Role</td>
                <td className="py-2 text-right text-sm">
                  {admin.role && admin.role[0].role?.display_name}
                </td>
              </tr>
              <tr className="w-full border-b max-[768px]:hidden">
                <td className="py-2 text-sm font-bold">Permission</td>
                <td className="flex w-full max-w-full flex-wrap justify-end py-2 text-right text-sm gap-2">
                  {/* <h1 className="text-center text-sm font-bold">Permission</h1> */}
                  {admin.role &&
                    admin.role[0].role?.roles_permissions &&
                    admin.role &&
                    admin.role[0].role?.roles_permissions.map((e, i) => (
                      <div
                        key={i}
                        className="badge badge-outline badge-lg ml-2 h-full text-center md:text-sm text-[0.6rem]"
                      >
                        {e.permission?.display_name}
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="md:hidden">
            <h1 className="pb-2 text-center text-sm font-bold ">Permission</h1>
            <div className="flex flex-wrap justify-center gap-2">
              {admin.role &&
                admin.role[0].role?.roles_permissions &&
                admin.role &&
                admin.role[0].role?.roles_permissions.map((e, i) => (
                  <div
                  key={i}
                  className="badge badge-outline badge-lg ml-2 h-full text-center md:text-sm text-xs"
                >
                  {e.permission?.display_name}
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
