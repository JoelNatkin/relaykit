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
