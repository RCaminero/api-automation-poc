import { APIRequestContext, expect } from '@playwright/test';

export async function getSeriesOverview(request: APIRequestContext, token: string) {
  const response = await request.get('/tsapi/series_overview_page', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(200);
  return response.json();
}