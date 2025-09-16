import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse, Customer, Order, ApiError, TokenResponse, CustomerDetails } from '@/types/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'X-API-Key': API_KEY,
    };
  }

  private async fetchWithAuth(input: string, init: RequestInit = {}, retry = true): Promise<Response> {
    const isAbsolute = /^https?:\/\//i.test(input);
    const url = isAbsolute ? input : `${API_URL}${input.startsWith('/') ? '' : '/'}${input}`;

    const headersFromAuth = await this.getAuthHeaders();
    const mergedHeaders: HeadersInit = {
      ...headersFromAuth,
      ...(init.headers || {} as any),
    };

    const response = await fetch(url, { ...init, headers: mergedHeaders });
    if (response.status !== 401 || !retry) return response;

    // Try refresh token once
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (!refreshToken) return response;

    try {
      const refreshed = await this.refreshAccessToken({ refresh_token: refreshToken, client_id: 'mobileapp' });
      if (refreshed?.access_token) {
        await AsyncStorage.setItem('jwt_token', refreshed.access_token);
        if (refreshed.refresh_token) await AsyncStorage.setItem('refresh_token', refreshed.refresh_token);
        const retryHeadersFromAuth = await this.getAuthHeaders();
        const retryMergedHeaders: HeadersInit = {
          ...retryHeadersFromAuth,
          ...(init.headers || {} as any),
        };
        return fetch(url, { ...init, headers: retryMergedHeaders });
      }
    } catch (_) {}

    return response;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Network error occurred',
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(credentials),
    });

    const result = await this.handleResponse<LoginResponse>(response);
    
    // Store JWT token
    if (result.token) {
      await AsyncStorage.setItem('jwt_token', result.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(result.user));
    }
    
    return result;
  }

  // OAuth2 password grant token endpoint
  async getTokenWithPasswordGrant(params: {
    username: string;
    password: string;
    client_id: string;
    scope?: string;
  }): Promise<TokenResponse> {
    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('username', params.username);
    body.append('password', params.password);
    body.append('client_id', params.client_id);
    if (params.scope) body.append('scope', params.scope);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: body.toString(),
    });

    return this.handleResponse<TokenResponse>(response);
  }

  async getCustomer(): Promise<Customer> {
    const response = await this.fetchWithAuth('/customer', { method: 'GET' });
    return this.handleResponse<Customer>(response);
  }

  async getCustomerDetails(): Promise<CustomerDetails> {
    const response = await this.fetchWithAuth('/api/v3/customer/details', { method: 'GET' });
    return this.handleResponse<CustomerDetails>(response);
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.fetchWithAuth('/orders', { method: 'GET' });
    return this.handleResponse<Order[]>(response);
  }

  async refreshAccessToken(params: { refresh_token: string; client_id: string; scope?: string; }): Promise<TokenResponse> {
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', params.refresh_token);
    body.append('client_id', params.client_id);
    if (params.scope) body.append('scope', params.scope);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: body.toString(),
    });

    return this.handleResponse<TokenResponse>(response);
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['jwt_token', 'user_data']);
  }

  async getStoredToken(): Promise<string | null> {
    return AsyncStorage.getItem('jwt_token');
  }

  async getStoredUser(): Promise<any> {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}

export const apiService = new ApiService();