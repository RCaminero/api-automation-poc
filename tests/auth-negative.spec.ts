import { test, expect } from '@playwright/test';
import { login } from '../services/auth.services';
import { credentials } from '../utils/env';

test.describe('Negative Testing - Auth API (Data Driven)', () => {

  test('Error 400: Unexpected property in request body', async ({ request }) => {
    const response = await login(request, { 
      email: credentials.email,
      password: credentials.password,
      prueba: "unexpected_value" // Adding the extra property here
    });
    
    const body = await response.json();
    console.log('Unexpected Property Response:', body);
    
    expect(response.status()).toBe(400);
    expect(body.message).toContain('property prueba should not exist');
    expect(body.error).toBe('Bad Request');
  });

  test('Error 400: Missing password in request body', async ({ request }) => {
    const response = await login(request, { 
      email: credentials.email 
    });
    
    console.log(`Missing Password Status: ${response.status()}`);
    console.log('Response Body:', await response.text());
    
    expect(response.status()).toBe(400);
  });

  test('Error 400: Invalid email format', async ({ request }) => {
    const response = await login(request, { 
        email: 'invalid-format-no-at', 
        password: credentials.password 
    });
    
    const body = await response.json();
    console.log('Invalid Email Response:', body);
    console.log('Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('Error 401/400: Correct format but unregistered user', async ({ request }) => {
    const fakeEmail = `nonexistent_${Date.now()}@pvolve.com`;
    
    const response = await login(request, { 
        email: fakeEmail, 
        password: credentials.password 
    });
    
    console.log(`Unregistered User Status: ${response.status()}`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Error 401: Incorrect password for existing user', async ({ request }) => {
    const response = await login(request, { 
        email: credentials.email, 
        password: 'WrongPassword_123!' 
    });
    
    console.log(`Wrong Password Status: ${response.status()}`);
    console.log('Response Body:', await response.text());
    expect(response.status()).toBe(400); 
  });
});