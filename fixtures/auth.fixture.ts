import { test as base } from '@playwright/test';
import { login } from '../services/auth.services';

type Fixtures = {
  authToken: string;
};

export const test = base.extend<Fixtures>({
  authToken: async ({ request }, use) => {
    const token = await login(request);
    await use(token);
  },
});

export { expect } from '@playwright/test';
