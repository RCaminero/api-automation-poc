import { test as base, expect } from '@playwright/test';
import { login } from '../services/auth.services';

type Fixtures = {
  authToken: string;
};

export const test = base.extend<Fixtures>({
  authToken: async ({ request }, use) => {
    const response = await login(request);
    const body = await response.json();
    await use(body.token);
  },
});

export { expect };