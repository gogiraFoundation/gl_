# Testing Guide

This document provides comprehensive information about testing the portfolio website application.

## Overview

The application uses:
- **Backend**: pytest and pytest-django for Django/DRF testing
- **Frontend**: Jest and React Testing Library for Next.js/React testing

## Backend Testing

### Setup

Backend tests use pytest with pytest-django. Dependencies are already in `requirements.txt`:
- `pytest==7.4.3`
- `pytest-django==4.7.0`

### Running Backend Tests

```bash
# Run all tests
cd gogir-labs-be
pytest

# Run tests for a specific app
pytest apps/blog/

# Run tests with coverage
pytest --cov=apps --cov-report=html

# Run specific test file
pytest apps/blog/tests.py

# Run specific test
pytest apps/blog/tests.py::PostModelTest::test_post_creation

# Run with verbose output
pytest -v
```

### Test Structure

Backend tests are organized by app:
- `apps/blog/tests.py` - Blog model tests
- `apps/blog/test_api.py` - Blog API endpoint tests
- `apps/contact/tests.py` - Contact model tests
- `apps/contact/test_api.py` - Contact API endpoint tests
- `apps/newsletter/tests.py` - Newsletter model tests
- `apps/newsletter/test_api.py` - Newsletter API endpoint tests
- `apps/notifications/tests.py` - Notification model tests
- `apps/portfolio/tests.py` - Portfolio model tests
- `config/test_auth.py` - Authentication API tests

### Test Coverage

Backend tests cover:
- Model functionality and edge cases
- API endpoint behavior
- Permission checks
- Input validation
- Error handling
- Security (XSS, SQL injection attempts)

## Frontend Testing

### Setup

Frontend tests use Jest and React Testing Library. Install dependencies:

```bash
cd gogir-labs-fe
npm install
```

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Frontend tests are organized by component:
- `components/contact/__tests__/ContactForm.test.tsx` - Contact form tests
- `components/newsletter/__tests__/NewsletterForm.test.tsx` - Newsletter form tests
- `components/ui/__tests__/ThemeToggle.test.tsx` - Theme toggle tests
- `lib/__tests__/api.test.ts` - API client tests

### Test Coverage

Frontend tests cover:
- Component rendering
- User interactions
- Form validation
- API integration
- Error handling
- Edge cases

## Test Categories

### 1. Model Tests

Test Django model functionality:
- Field validation
- Slug auto-generation
- Unique constraints
- Relationships
- Custom methods
- Edge cases (very long inputs, special characters, etc.)

### 2. API Endpoint Tests

Test REST API endpoints:
- HTTP methods (GET, POST, PUT, DELETE)
- Response status codes
- Response data structure
- Permission checks
- Filtering and search
- Pagination
- Error handling

### 3. Component Tests

Test React components:
- Rendering
- User interactions
- State management
- Props handling
- Conditional rendering
- Error states

### 4. Integration Tests

Test end-to-end flows:
- Authentication flow
- Form submission flow
- File upload flow
- API communication

### 5. Edge Cases

Test boundary conditions:
- Empty inputs
- Very long inputs
- Special characters
- Invalid data types
- Network failures
- Concurrent requests

### 6. Security Tests

Test security measures:
- XSS prevention
- SQL injection prevention
- Authentication/authorization
- Input sanitization
- Token handling

## Running All Tests

### Backend Only

```bash
cd gogir-labs-be
pytest
```

### Frontend Only

```bash
cd gogir-labs-fe
npm test
```

### Both (from project root)

```bash
# Backend
cd gogir-labs-be && pytest && cd ..

# Frontend
cd gogir-labs-fe && npm test && cd ..
```

## Continuous Integration

Tests should be run in CI/CD pipeline:
- On every commit
- On pull requests
- Before deployment

Example GitHub Actions workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run backend tests
        run: |
          cd gogir-labs-be
          pip install -r requirements.txt
          pytest

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run frontend tests
        run: |
          cd gogir-labs-fe
          npm install
          npm test
```

## Coverage Goals

- **Backend**: >80% coverage
- **Frontend**: >70% coverage
- **Critical paths**: 100% coverage

## Writing New Tests

### Backend Test Example

```python
def test_example(self):
    """Test description."""
    # Arrange
    obj = Model.objects.create(field='value')
    
    # Act
    result = obj.method()
    
    # Assert
    self.assertEqual(result, expected_value)
```

### Frontend Test Example

```typescript
it('should render component', () => {
  render(<Component />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

## Debugging Tests

### Backend

```bash
# Run with pdb debugger
pytest --pdb

# Run with verbose output
pytest -vv

# Run with print statements
pytest -s
```

### Frontend

```bash
# Run with debug output
npm test -- --verbose

# Run specific test file
npm test -- ContactForm.test.tsx
```

## Common Issues

### Backend

1. **Database not found**: Run migrations first
2. **Import errors**: Check PYTHONPATH
3. **Permission errors**: Check test database permissions

### Frontend

1. **Module not found**: Run `npm install`
2. **Type errors**: Run `npm run type-check`
3. **Mock errors**: Check jest.setup.js configuration

## Test Data

- Use factories for creating test data
- Clean up after tests
- Use fixtures for common data
- Mock external services (email, file storage)

## Best Practices

1. **Test one thing at a time**
2. **Use descriptive test names**
3. **Arrange-Act-Assert pattern**
4. **Test edge cases**
5. **Mock external dependencies**
6. **Keep tests independent**
7. **Clean up after tests**
8. **Write tests before fixing bugs**

