// config/roles.js

// Role -> static permissions
export const ROLE_PERMISSIONS = {
  Admin: [
    "manage_users",
    "delete_any_post",
    "edit_any_post",
    "view_reports",
    "moderate_comments",
    "create_post",
    "edit_own_post",
    "delete_own_post"
  ],
  Moderator: [
    "delete_any_post",
    "moderate_comments",
    "view_reports",
    "create_post",
    "edit_own_post",
    "delete_own_post"
  ],
  User: [
    "create_post",
    "edit_own_post",
    "delete_own_post"
  ]
};

// Optional role hierarchy order (higher index = more privilege)
export const ROLE_ORDER = ["User", "Moderator", "Admin"];
