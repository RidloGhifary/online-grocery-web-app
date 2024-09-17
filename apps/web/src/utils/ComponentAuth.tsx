import { ReactNode } from "react";

export default function ComponentByPermission({
  permissionInput,
  permissionRequired,
  children,
}: {
  permissionInput?: string[] | string;
  permissionRequired?: string[] | string;
  children?: ReactNode;
}) {
  // Normalize permissions into arrays
  const inputPermissions = Array.isArray(permissionInput)
    ? permissionInput
    : [permissionInput];
  const requiredPermissions = Array.isArray(permissionRequired)
    ? permissionRequired
    : [permissionRequired];

  // Function to check if the permissionInput satisfies the permissionRequired or contains 'super'
  const hasPermission = () => {
    // If user has 'super', allow rendering
    if (inputPermissions.includes('super')) {
      return true;
    }

    // Otherwise, check if all required permissions are satisfied
    return requiredPermissions.every((requiredPermission) =>
      inputPermissions.includes(requiredPermission)
    );
  };

  // Render children if permission is fulfilled
  return hasPermission() ? <>{children}</> : null;
}
