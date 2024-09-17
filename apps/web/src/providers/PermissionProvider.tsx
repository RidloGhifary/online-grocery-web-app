'use client'
import React, { ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
 // Adjust the import path
import { flattenUserPermissions } from '@/utils/roleAndPermission';
import { useAtom } from 'jotai';
import { permissionsAtom } from '@/stores/permissionStores';
import { getAdmin } from '@/actions/user';

export default function PermissionsProvider({ children }: { children: ReactNode }) {
  const { data: admin, isLoading, error } = useQuery({
    queryKey: ['adminInfo'],
    queryFn: getAdmin,
  });

  const [, setPermissions] = useAtom(permissionsAtom);

  useEffect(() => {
    if (admin?.data) {
      const permissions = flattenUserPermissions(admin.data);
      setPermissions(permissions);
    }
  }, [admin, setPermissions]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading permissions</div>;

  return <>{children}</>;
}
