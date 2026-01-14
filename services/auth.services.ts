import { APIRequestContext } from '@playwright/test';
import { credentials } from '../utils/env';

export async function login(
  request: APIRequestContext, 
  customData?: object 
) {
  // Si customData existe, lo usa (para pruebas negativas). 
  // Si no, usa las credenciales válidas por defecto.
  const payload = customData || {
    email: credentials.email,
    password: credentials.password,
  };

  const response = await request.post('/api/auth/sign-in/email', {
    data: payload,
  });

  return response;
}