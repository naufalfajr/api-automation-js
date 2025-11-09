const { expect } = require('chai');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

class Assertions {
  constructor() {
    // Initialize Ajv with JSON Schema Draft-06 support
    this.ajv = new Ajv2020({
      strict: false,
      allErrors: true,
      verbose: true,
      validateFormats: true
    });
    
    // Add format validators (uri, email, date-time, etc.)
    addFormats(this.ajv);
  }

  /**
   * Validate response against JSON Schema Draft-06
   */
  validateSchema(response, schema) {
    // Add draft-04 flag to schema if not present
    if (!schema.$schema) {
      schema.$schema = 'http://json-schema.org/draft-04/schema#';
    }

    const validate = this.ajv.compile(schema);
    const valid = validate(response);

    if (!valid) {
      const errors = validate.errors.map(err => {
        return `${err.instancePath || 'root'} ${err.message}`;
      }).join(', ');
      
      throw new Error(`Schema validation failed: ${errors}`);
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
