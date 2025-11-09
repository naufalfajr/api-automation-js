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

      const response = await apiClient.get(`/api/v2/berry/${validData.id}`);
      
      assertions.validateStatusCode(response, 200);
      assertions.validateResponseTime(startTime);
      // assertions.validateSchema(response, schema);
      expect(response.data).to.have.property('id');
      expect(response.data.name).to.equal(validData.name);

      pokemonId = response.data.id;
    });

    it('should return 404 for invalid pokemon data', async () => {
      const invalidData = TestData.invalidPokemonData();

      try {
        await apiClient.get(`/api/v2/pokemon/${invalidData.id}`);
        expect.fail('Should have thrown an error');
      } catch (error) {
        console.log(`error response: ${JSON.stringify(error.response)}`);
        assertions.validateStatusCode(error.response, 404);
      }
    });

    // it('should return 409 for duplicate email', async () => {
    //   const userData = {
    //     name: "Test User",
    //     email: "duplicate@example.com"
    //   };

    //   await apiClient.post('/users', userData);

    //   try {
    //     await apiClient.post('/users', userData);
    //     expect.fail('Should have thrown an error');
    //   } catch (error) {
    //     expect(error.response.status).to.equal(409);
    //   }
    // });
  });

  // describe('GET /users - Get All Users', () => {
  //   it('should retrieve all users', async () => {
  //     const startTime = Date.now();

  //     const response = await apiClient.get('/users');

  //     Assertions.validateStatusCode(response, 200);
  //     Assertions.validateResponseTime(startTime);
  //     expect(response.data).to.be.an('array');
  //     Assertions.validateNotEmpty(response.data);
  //   });

  //   it('should filter users by query parameters', async () => {
  //     const response = await apiClient.get('/users', { age: 25 });

  //     Assertions.validateStatusCode(response, 200);
  //     expect(response.data).to.be.an('array');
  //     response.data.forEach(user => {
  //       expect(user.age).to.equal(25);
  //     });
  //   });
  // });

  // describe('GET /users/:id - Get User by ID', () => {
  //   it('should retrieve a user by id', async () => {
  //     const response = await apiClient.get(`/users/${userId}`);

  //     Assertions.validateStatusCode(response, 200);
  //     expect(response.data).to.have.property('id', userId);
  //     expect(response.data).to.have.property('name');
  //     expect(response.data).to.have.property('email');
  //   });

  //   it('should return 404 for non-existent user', async () => {
  //     try {
  //       await apiClient.get('/users/99999');
  //       expect.fail('Should have thrown an error');
  //     } catch (error) {
  //       expect(error.response.status).to.equal(404);
  //     }
  //   });
  // });

  // describe('PUT /users/:id - Update User', () => {
  //   it('should update user successfully', async () => {
  //     const updateData = {
  //       name: "Updated Name",
  //       age: 30
  //     };

  //     const response = await apiClient.put(`/users/${userId}`, updateData);

  //     Assertions.validateStatusCode(response, 200);
  //     expect(response.data.name).to.equal(updateData.name);
  //     expect(response.data.age).to.equal(updateData.age);
  //   });
  // });

  // describe('DELETE /users/:id - Delete User', () => {
  //   it('should delete user successfully', async () => {
  //     const response = await apiClient.delete(`/users/${userId}`);

  //     Assertions.validateStatusCode(response, 204);
  //   });

  //   it('should return 404 when deleting non-existent user', async () => {
  //     try {
  //       await apiClient.delete('/users/99999');
  //       expect.fail('Should have thrown an error');
  //     } catch (error) {
  //       expect(error.response.status).to.equal(404);
  //     }
  //   });
  // });
});
