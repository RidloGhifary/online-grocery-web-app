"use client";
import React, { MouseEvent } from "react";
import Image from "next/image";
// import { customerDefault as customers } from "@/mocks/customerData";
import { FaInfoCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import ButtonWithAction from "../ui/ButtonWithAction";
import { useAtom } from "jotai";
import PermissionWrapper from "../auth/PermissionWrapper";
import { UserInterface } from "@/interfaces/user";
import { currentCustomerOperation, currentDetailCustomerAtom } from "@/stores/customerStores";

export default function AdminCustomerTable({ customers }: { customers: UserInterface[] }) {
  const [, setCurrenctCustomer] = useAtom(currentDetailCustomerAtom);
  const [, setCustomerOperation] = useAtom(currentCustomerOperation);
  function handleDetail(e: MouseEvent) {
    e.preventDefault();
    const currentId = Number(e.currentTarget.id);
    const currentData = customers.filter(
      (customer) => customer.id == currentId,
    )[0];
    setCurrenctCustomer(currentData);
    setCustomerOperation("detail");
  }
  // function handleEdit(e: MouseEvent) {
  //   e.preventDefault();
  //   const currentId = Number(e.currentTarget.id);
  //   const currentData = customers.filter(
  //     (customer) => customer.id == currentId,
  //   )[0];
  //   setCurrenctProduct(currentData);
  //   setProductOperation("edit");
  // }
  // function handleDelete(e: MouseEvent) {
  //   e.preventDefault();
  //   const currentId = Number(e.currentTarget.id);
  //   const currentData = customers.filter(
  //     (customer) => customer.id == currentId,
  //   )[0];
  //   setCurrenctProduct(currentData);
  //   setProductOperation("delete");
  // }
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Image</th>
            <th className="text-lg font-extrabold">First Name</th>
            <th className="text-lg font-extrabold">Last Name</th>
            <th className="text-lg font-extrabold">Middle Name</th>
            <th className="text-lg font-extrabold">Email</th>
            {/* <th className="text-lg font-extrabold">Phone Number</th>
            <th className="text-lg font-extrabold">Gender</th>
            <th className="text-lg font-extrabold">Referal</th>
            <th className="text-lg font-extrabold">Google Linked</th>
            <th className="text-lg font-extrabold">Validated At</th> */}
            <th className="text-lg font-extrabold">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="">
                <Image
                  src={
                    customer.image
                      ? customer.image
                      : "https://via.placeholder.com/150"
                  }
                  alt={customer.first_name}
                  width={50}
                  height={50}
                  className="aspect-square rounded-md object-scale-down"
                />
              </td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.middle_name??'-'}</td>
              <td>{customer.email}</td>
              {/* <td>{customer.phone_number??'-'}</td>
              <td>{customer.gender}</td>
              <td>{customer.referral}</td>
              <td>{customer.is_google_linked?'yes':'no'}</td>
              <td>
                {new Date(
                  customer.validated_at as unknown as string,
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td> */}

              <td>
                <div className="flex flex-wrap gap-2">
                  {/* action */}
                  <PermissionWrapper
                    permissionRequired={"admin_customer_detail"}
                  >
                    <ButtonWithAction
                      action={handleDetail}
                      replaceTWClass="btn btn-info btn-sm"
                      eventType="onClick"
                      type="button"
                      id={customer.id}
                    >
                      <FaInfoCircle />
                    </ButtonWithAction>
                  </PermissionWrapper>
                  {/* <PermissionWrapper
                    permissionRequired={"admin_customer_update"}
                  >
                    <ButtonWithAction
                      replaceTWClass="btn btn-accent btn-sm"
                      action={handleEdit}
                      eventType="onClick"
                      type="button"
                      id={customer.id}
                    >
                      <FaEdit />
                    </ButtonWithAction>
                  </PermissionWrapper>
                  <PermissionWrapper
                    permissionRequired={"admin_customer_delete"}
                  >
                    <ButtonWithAction
                      replaceTWClass="btn btn-error btn-sm"
                      id={customer.id}
                      action={handleDelete}
                      eventType="onClick"
                      type="button"
                    >
                      <FaTrash />
                    </ButtonWithAction>
                  </PermissionWrapper> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default ProductTable;
