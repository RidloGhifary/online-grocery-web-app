import { PermissionInterface } from "./PermissionInterface";

export interface RoleInterface {
  id: number;
  name: string;
  display_name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  roles_permissions ?: RoleHasPermissionInterface[]
}

export interface RoleHasPermissionInterface {
  id: number;
  permission_id: number;
  role_id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  permission?: PermissionInterface
}
