import { APIRequestContext, expect } from '@playwright/test';
import { credentials } from '../utils/env';

export async function login(
  request: APIRequestContext
): Promise<string> {
  const response = await request.post('/api/auth/sign-in/email', {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.token).toBeTruthy();

  return body.token;
}
