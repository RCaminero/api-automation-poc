import { APIRequestContext } from '@playwright/test';

export async function enrollSeries(
  request: APIRequestContext,
  token: string,
  seriesId: string
) {
  const response = await request.post('/v2/workouts/series/enroll', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { series_id: seriesId },
  });

  return response; // Devolvemos el objeto response completo para validar status en el test
}