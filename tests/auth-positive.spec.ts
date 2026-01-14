import { test, expect } from '@playwright/test';
import { login } from '../services/auth.services';
import { authSuccessSchema } from '../utils/schemas';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv); // Prevents the "date-time" format error

test.describe('Auth API - Positive Path', () => {

  test('User can login with valid credentials', async ({ request }) => {
    const response = await login(request);
    const body = await response.json();

    console.log('Login Success Response:', JSON.stringify(body, null, 2));

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    expect(body.success).toBe(true);

    // Schema Validation
    const validate = ajv.compile(authSuccessSchema);
    const valid = validate(body);
    expect(valid, `Schema Validation Errors: ${JSON.stringify(validate.errors)}`).toBe(true);
    
    // Data check
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBeDefined();
  });
});