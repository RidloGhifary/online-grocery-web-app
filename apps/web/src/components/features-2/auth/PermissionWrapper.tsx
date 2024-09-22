import React, { ReactNode } from "react";
import { useAtom } from "jotai";
import { permissionsAtom } from "@/stores/permissionStores";

export default function PermissionWrapper({
  permissionRequired,
  children,
}: {
  permissionRequired: string[] | string;
  children: ReactNode;
}) {
  const [permissions] = useAtom(permissionsAtom);

  // Normalize permissions into arrays
  const requiredPermissions = Array.isArray(permissionRequired)
    ? permissionRequired
    : [permissionRequired];

  // Function to check if the permissionInput satisfies the permissionRequired or contains 'super'
  const hasPermission = () => {
    // If user has 'super', allow rendering
    
    if (permissions.includes('super')) {
      return true;
    }

    // Otherwise, check if all required permissions are satisfied
    return requiredPermissions.every((requiredPermission) =>
      permissions.includes(requiredPermission)
    );
  };

  // Render children if permission is fulfilled
  return hasPermission() ? <>{children}</> : null;
}