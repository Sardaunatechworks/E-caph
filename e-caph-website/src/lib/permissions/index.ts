export type RoleName =
  | 'super_admin'
  | 'content_admin'
  | 'editor'
  | 'programme_manager'
  | 'media_officer'
  | 'viewer';

export const ROLE_HIERARCHY: Record<RoleName, number> = {
  super_admin: 100,
  content_admin: 80,
  programme_manager: 60,
  editor: 40,
  media_officer: 30,
  viewer: 10,
};

export const PERMISSIONS = {
  MANAGE_USERS: ['super_admin'],
  MANAGE_SETTINGS: ['super_admin'],
  MANAGE_HOMEPAGE: ['super_admin', 'content_admin'],
  MANAGE_PROGRAMMES: ['super_admin', 'content_admin', 'programme_manager'],
  MANAGE_PROJECTS: ['super_admin', 'content_admin', 'programme_manager'],
  MANAGE_POSTS: ['super_admin', 'content_admin', 'editor'],
  MANAGE_OPPORTUNITIES: ['super_admin', 'content_admin', 'programme_manager'],
  MANAGE_MEDIA: ['super_admin', 'content_admin', 'media_officer'],
  MANAGE_MESSAGES: ['super_admin', 'content_admin'],
  MANAGE_SUBSCRIBERS: ['super_admin', 'content_admin'],
  VIEW_DASHBOARD: [
    'super_admin',
    'content_admin',
    'editor',
    'programme_manager',
    'media_officer',
    'viewer',
  ],
} as const;

export function hasPermission(userRole: RoleName | undefined, permission: keyof typeof PERMISSIONS): boolean {
  if (!userRole) return false;
  const allowedRoles = PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(userRole);
}

export function isRoleAtLeast(userRole: RoleName | undefined, minimumRole: RoleName): boolean {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minimumRole] || 0);
}
