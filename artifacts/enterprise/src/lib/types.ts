export interface MeResponse {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  roles: string[];
  permissions: string[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string[];
}

export interface UserListResponse {
  users: UserResponse[];
}

export interface RoleResponse {
  name: string;
  permissions: string[];
}

export interface RoleListResponse {
  roles: RoleResponse[];
}
