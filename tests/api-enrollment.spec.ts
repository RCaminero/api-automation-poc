import { test, expect } from '../fixtures/auth.fixture';
import { getSeriesOverview } from '../services/series.services';
import { enrollSeries } from '../services/enrollment.service';
import { enrollmentSchema } from '../utils/schemas'; // Import the schema
import Ajv from 'ajv';
import addFormats from 'ajv-formats'

const ajv = new Ajv();
addFormats(ajv);

test.describe('API Series Enrollment - Dynamic Data', () => {

  test('Should enroll to a random series from the overview page', async ({ request, authToken }) => {
    let selectedSeriesId: string;

    await test.step('Get series overview and pick random ID', async () => {
      const data = await getSeriesOverview(request, authToken);
      const allSeries = data.seriesCategoriesList.flatMap((category: any) => category.series);
      
      if (allSeries.length === 0) {
        throw new Error('No series found in the API response!');
      }

      const randomIndex = Math.floor(Math.random() * allSeries.length);
      const randomSeries = allSeries[randomIndex];
      
      selectedSeriesId = randomSeries.id;
      console.log(`Targeting Series: "${randomSeries.name}" with ID: ${selectedSeriesId}`);
    });

    await test.step('Enroll and verify', async () => {
      const response = await enrollSeries(request, authToken, selectedSeriesId);
      const body = await response.json();

      console.log('Enrollment response:', body);

      // schema validation
      const validate = ajv.compile(enrollmentSchema);
      const valid = validate(body);
      
      if (!valid) {
        console.error('AJV Schema Errors:', validate.errors);
      }
      
      expect(valid, 'Response should match enrollment JSON schema').toBe(true);
      // ------------------------------------

      expect(response.status()).toBe(200);
      expect(body).toBeDefined();
    });
  });
});