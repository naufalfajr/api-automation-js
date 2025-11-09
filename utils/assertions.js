const { expect } = require('chai');
const Ajv = require('ajv');
const draft6MetaSchema = require('ajv/dist/refs/json-schema-draft-06.json');
const addFormats = require('ajv-formats');

class Assertions {
  constructor() {
    // Initialize Ajv with JSON Schema Draft-06 support
    this.ajv = new Ajv({
      strict: false,
      allErrors: true,
      verbose: true,
      validateFormats: true
    });
    this.ajv.addMetaSchema(draft6MetaSchema);
    addFormats(this.ajv);
  }

  /**
   * Validate response against JSON Schema Draft-06
   */
  validateSchema(response, schema) {
    const validate = this.ajv.compile(schema);
    // Validate against response.data since that contains the actual Pokemon data
    const valid = validate(response.data);

    if (!valid) {
      const errors = validate.errors.map(err => {
        // Improve error messages with more context
        return `${err.instancePath || 'root'} ${err.message} (${JSON.stringify(err.params)})`;
      }).join('\n');
      
      console.error('Validation errors:', errors);
      console.error('Received data:', JSON.stringify(response.data, null, 2));
      throw new Error(`Schema validation failed:\n${errors}`);
    }

    return true;
  }

  validateStatusCode(response, expectedStatus) {
    expect(response.status).to.equal(expectedStatus, 
      `Expected status ${expectedStatus} but got ${response.status}`);
  }

  validateResponseTime(startTime, maxTime = 2000) {
    const responseTime = Date.now() - startTime;
    expect(responseTime).to.be.below(maxTime, 
      `Response time ${responseTime}ms exceeded ${maxTime}ms`);
  }

  validateNotEmpty(data) {
    expect(data).to.not.be.empty;
  }

  validateContains(array, value) {
    expect(array).to.include(value);
  }

  validateArrayLength(array, length) {
    expect(array).to.have.lengthOf(length);
  }
}

module.exports = Assertions;
