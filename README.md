/*
# API Automation Testing Boilerplate

## Setup

1. Install dependencies:
   npm install

2. Configure environment variables:
   - Copy .env.example to .env
   - Update API_BASE_URL and API_KEY

3. Run tests:
   npm test

## Project Structure

- config/        - Configuration files
- utils/         - Utility functions (API client, assertions, test data)
- test/          - Test files
- .env           - Environment variables
- .mocharc.json  - Mocha configuration

## Available Scripts

- npm test              - Run all tests
- npm run test:watch    - Run tests in watch mode
- npm run test:report   - Generate HTML report

## Writing Tests

1. Create test files in the test/ directory
2. Use apiClient for API calls
3. Use Assertions utility for common validations
4. Use TestData for generating test data

## Best Practices

- Keep tests independent
- Use descriptive test names
- Clean up test data after tests
- Validate response time
- Check status codes and response schema
*/
