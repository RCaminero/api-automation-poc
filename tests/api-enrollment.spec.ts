import { test, expect } from '../fixtures/auth.fixture';
import { getSeriesOverview } from '../services/series.services';
import { enrollSeries } from '../services/enrollment.service';
import { credentials } from '../utils/env';

test.describe('POC: API Automation - Series Enrollment', () => {

  test('Authenticated user can enroll into a series', async ({ request, authToken }) => {

    await test.step('Get series overview', async () => {
      const series = await getSeriesOverview(request, authToken);
      expect(series).toBeDefined();
    });

    await test.step('Enroll user into series', async () => {
      const result = await enrollSeries(
        request,
        authToken,
        credentials.series_id
      );

      expect(result).toBeDefined();
      console.log('User enrolled successfully', result);

    });

  });

});
