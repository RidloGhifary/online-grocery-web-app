import { UserInterface } from "@/interfaces/user";

export function flattenUserPermissions(user?: UserInterface): string[] {
  return user?.role
    ?.flatMap((userHasRole) => userHasRole.role?.roles_permissions || [])
    .map((rolePerm) => rolePerm.permission?.name)
    .filter((name): name is string => !!name) || [];
}

