export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

// OAuth2 Password Grant token response shape (common fields)
export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  ".issued"?: string;
  ".expires"?: string;
}

// Customer details from /api/v3/customer/details
export interface CustomerDetails {
  isTempPasswordUsed: boolean;
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  email: string | null;
  mobilePhone: string | null;
  title: string | null;
  homeNumber: string | null;
  loyaltyNumber: string | null;
  createdDate: string;
  activateDate: string | null;
  enumStatus: number;
  statusName: string | null;
  signupChannel: string | null;
  mostShoppedStoreId: number | null;
  nearestStoreId: number | null;
  id: number;
  emailNotProvided: boolean | null;
  customerNumber: string | null;
}