import { APIRequestContext, expect } from '@playwright/test';

export async function enrollSeries(
  request: APIRequestContext,
  token: string,
  seriesId: string
) {
  const response = await request.post('/v2/workouts/series/enroll', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      series_id: seriesId,
    },
  });

  if (response.status() !== 200) {
    console.log('Enroll error:', await response.text());
  }

  expect(response.status()).toBe(200);
  return response.json();
}
