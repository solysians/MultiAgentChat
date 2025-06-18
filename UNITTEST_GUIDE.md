
# Unit Testing Guide

This guide covers unit testing for the NextChat application, including specific tests for Razorpay subscription functionality.

## Test Setup

The project uses Jest as the testing framework with TypeScript support.

### Configuration Files
- `jest.config.ts` - Main Jest configuration
- `jest.setup.ts` - Test setup and global configurations
- `tsconfig.json` - TypeScript configuration for tests

## Running Tests

### All Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Specific Test Categories

#### Vision Model Tests
```bash
# Run vision model checker tests
npm test -- test/vision-model-checker.test.ts

# Run model availability tests
npm test -- test/model-available.test.ts

# Run model provider tests
npm test -- test/model-provider.test.ts
```

#### Razorpay Subscription Tests
```bash
# Run all Razorpay-related tests
npm test -- --testPathPattern="razorpay"

# Run subscription store tests
npm test -- app/store/subscription.test.ts

# Run subscription component tests
npm test -- app/components/subscription-plans.test.ts
npm test -- app/components/subscription-status.test.ts

# Run Razorpay API tests
npm test -- app/api/razorpay/
```

#### Utility Tests
```bash
# Run utility function tests
npm test -- test/sum-module.test.ts

# Run authentication tests
npm test -- app/utils/auth-settings-events.test.ts
```

## Test Structure

### Example Test File Structure
```typescript
import { jest } from "@jest/globals";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("Component/Function Name", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should handle specific scenario", () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Razorpay Testing Scenarios

### Subscription Plans Component Tests
```bash
# Test subscription plan selection
npm test -- --testNamePattern="subscription plan"

# Test plan pricing display
npm test -- --testNamePattern="pricing"
```

### Subscription Status Component Tests
```bash
# Test subscription status display
npm test -- --testNamePattern="subscription status"

# Test subscription renewal
npm test -- --testNamePattern="renewal"
```

### Razorpay API Integration Tests
```bash
# Test plan creation
npm test -- --testNamePattern="create plan"

# Test subscription creation
npm test -- --testNamePattern="create subscription"

# Test payment verification
npm test -- --testNamePattern="verify payment"

# Test webhook handling
npm test -- --testNamePattern="webhook"
```

## Writing Razorpay Tests

### Mock Razorpay Instance
```typescript
// Mock Razorpay for testing
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    plans: {
      create: jest.fn().mockResolvedValue({ id: 'plan_test123' }),
      fetch: jest.fn().mockResolvedValue({ id: 'plan_test123' })
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({ id: 'sub_test123' }),
      fetch: jest.fn().mockResolvedValue({ id: 'sub_test123' })
    }
  }));
});
```

### Environment Variables for Testing
```typescript
beforeEach(() => {
  process.env.RAZORPAY_KEY_ID = 'test_key_id';
  process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
  process.env.RAZORPAY_WEBHOOK_SECRET = 'test_webhook_secret';
});
```

## Test Commands by Feature

### Client-Side Tests
```bash
# Test React components
npm test -- app/components/

# Test store/state management
npm test -- app/store/

# Test utility functions
npm test -- app/utils/
```

### Server-Side Tests
```bash
# Test API routes
npm test -- app/api/

# Test configuration
npm test -- app/config/
```

### Integration Tests
```bash
# Test end-to-end subscription flow
npm test -- --testNamePattern="subscription flow"

# Test payment processing
npm test -- --testNamePattern="payment flow"
```

## Debugging Tests

### Verbose Output
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debug info
npm test -- --testNamePattern="test name" --verbose
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## Continuous Integration

### Pre-commit Testing
```bash
# Run linting and tests before commit
npm run lint && npm test
```

### Test in CI Environment
```bash
# Run tests in CI mode (single run, no watch)
npm test -- --ci --watchAll=false --coverage
```

## Common Test Patterns

### Testing Async Functions
```typescript
test("should handle async operations", async () => {
  const result = await asyncFunction();
  expect(result).toEqual(expectedValue);
});
```

### Testing Error Handling
```typescript
test("should handle errors gracefully", async () => {
  await expect(functionThatThrows()).rejects.toThrow("Error message");
});
```

### Testing React Components
```typescript
import { render, screen, fireEvent } from "@testing-library/react";

test("should render component correctly", () => {
  render(<Component />);
  expect(screen.getByText("Expected Text")).toBeInTheDocument();
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies (APIs, databases, third-party services)
3. **Descriptive Names**: Use clear, descriptive test names
4. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
5. **Environment Cleanup**: Always clean up environment variables and mocks

## Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure test environment variables are set correctly
2. **Module Mocking**: Check that mocks are properly configured
3. **Async Operations**: Use proper async/await or promise handling
4. **TypeScript Errors**: Ensure types are properly configured for test files

### Debug Commands
```bash
# Run tests with Node.js debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test file in debug mode
npm test -- --testPathPattern="specific-test.test.ts" --runInBand
```

This guide should help you effectively test the Razorpay integration and other components of the NextChat application.
