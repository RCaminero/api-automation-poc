import { test, expect } from '@playwright/test';
import { login } from '../services/auth.services';
import { credentials } from '../utils/env';
import { errorSchema } from '../utils/schemas';
import Ajv from 'ajv';

const ajv = new Ajv();

test.describe('Auth API - Negative & Error States', () => {

  /**
   * Helper function to validate that error responses follow the expected JSON Schema.
   * It also logs the body for easier debugging in the reports.
   */
  const validateErrorResponse = async (response: any) => {
    const body = await response.json();
    console.log(`Response Body [Status ${response.status()}]:`, JSON.stringify(body, null, 2));

    const validate = ajv.compile(errorSchema);
    const valid = validate(body);
    
    expect(valid, `Error Schema mismatch: ${JSON.stringify(validate.errors)}`).toBe(true);
    return body;
  };

  test('Error 400: Unexpected property "test" in request body', async ({ request }) => {
    const response = await login(request, { 
      email: credentials.email, 
      password: credentials.password, 
      test: "unexpected_value" 
    });

    expect(response.status()).toBe(400);
    const body = await validateErrorResponse(response);
    
    // Specific business logic validations
    expect(body.message).toContain('property test should not exist');
    expect(body.error).toBe('Bad Request');
  });

  test('Error 400: Messed up body structure (Wrong keys)', async ({ request }) => {
    const response = await login(request, { "wrong_key": 123 });
    
    expect(response.status()).toBe(400);
    await validateErrorResponse(response);
  });

  test('Error 400: Missing password in request body', async ({ request }) => {
    const response = await login(request, { 
      email: credentials.email 
    });

    expect(response.status()).toBe(400);
    await validateErrorResponse(response);
  });

  test('Error 400: Invalid email format', async ({ request }) => {
    const response = await login(request, { 
        email: 'invalid-format-no-at', 
        password: credentials.password 
    });

    expect(response.status()).toBe(400);
    await validateErrorResponse(response);
  });

  test('Error 401/400: Correct format but unregistered user', async ({ request }) => {
    const fakeEmail = `nonexistent_${Date.now()}@pvolve.com`;
    
    const response = await login(request, { 
        email: fakeEmail, 
        password: credentials.password 
    });

    // We expect a failure status code
    expect(response.status()).toBeGreaterThanOrEqual(400);
    await validateErrorResponse(response);
  });

  test('Error 401: Incorrect password for existing user', async ({ request }) => {
    const response = await login(request, { 
        email: credentials.email, 
        password: 'WrongPassword_123!' 
    });

    // Check status and schema
    expect(response.status()).toBeGreaterThanOrEqual(400); 
    await validateErrorResponse(response);
  });

  test('Error 404: Invalid endpoint', async ({ request }) => {
    const response = await request.post('/api/auth/sign-in/invalid-route', { 
      data: { email: credentials.email, password: credentials.password } 
    });
    
    console.log(`Response Status: ${response.status()}`);
    expect(response.status()).toBe(404);
    await validateErrorResponse(response);

  });
});