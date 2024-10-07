'use client'
import React, { ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
 // Adjust the import path
import { flattenUserPermissions } from '@/utils/roleAndPermission';
import { useAtom } from 'jotai';
import { permissionsAtom } from '@/stores/permissionStores';
import { getAdmin } from '@/actions/user';
import { queryKeys } from '@/constants/queryKeys';
import { currentAdminAtom } from '@/stores/adminAccountStores';

export default function AdminProvider({ children }: { children: ReactNode }) {
  const { data: admin, isLoading, error } = useQuery({
    queryKey: [queryKeys.adminInfo],
    queryFn: ()=>getAdmin(),
  });

  const [, setPermissions] = useAtom(permissionsAtom);
  const [, setAdmin] = useAtom(currentAdminAtom)

  useEffect(() => {
    if (admin?.data) {
      const permissions = flattenUserPermissions(admin.data);
      setPermissions(permissions);
      setAdmin(admin.data)
    }
  }, [admin, setPermissions]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return <>{children}</>;
}
