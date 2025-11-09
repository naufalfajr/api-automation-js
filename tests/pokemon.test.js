const { expect } = require('chai');
const apiClient = require('../utils/apiClient');
const Assertions = require('../utils/assertions');
const TestData = require('../utils/testData');
const { loadSchemaAsync } = require('../utils/schemaLoader');

describe('Pokemon API Tests', () => {
  let pokemonId;

  describe('GET /pokemon - Get pokemon data', () => {
    let schema;
    const assertions = new Assertions();

    before(async () => {
      schema = await loadSchemaAsync('./schemas/pokemon.schema.json');
    });

    it('Should get pokemon data completely', async () => {
      const startTime = Date.now();
      const validData = TestData.validPokemonData();

      const response = await apiClient.get(`/api/v2/pokemon/${validData.id}`);
      
      assertions.validateStatusCode(response, 200);
      assertions.validateResponseTime(startTime);
      assertions.validateSchema(response, schema);
      expect(response.data).to.have.property('id');
      expect(response.data.name).to.equal(validData.name);
      expect(response.data.order).to.equal(validData.order);

      pokemonId = response.data.id;
    });

    it('should return 404 for invalid pokemon data', async () => {
      const invalidData = TestData.invalidPokemonData();

      try {
        await apiClient.get(`/api/v2/pokemon/${invalidData.id}`);
        expect.fail('Should have thrown an error');
      } catch (error) {
        assertions.validateStatusCode(error.response, 404);
      }
    });
  });
});
