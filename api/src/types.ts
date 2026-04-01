export interface ApiKeyRecord {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  environment: 'sandbox' | 'production';
  created_at: string;
  revoked_at: string | null;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export type AppVariables = {
  user_id: string;
  environment: 'sandbox' | 'production';
};

export interface ConsentRecord {
  id: string;
  user_id: string;
  phone: string;
  consented_at: string;
  revoked_at: string | null;
  ip_address: string | null;
  source: string;
}

export interface ConsentStore {
  record(user_id: string, phone: string, source: string, ip_address: string | null): Promise<ConsentRecord>;
  check(user_id: string, phone: string): Promise<ConsentRecord | null>;
  revoke(user_id: string, phone: string): Promise<ConsentRecord | null>;
}
