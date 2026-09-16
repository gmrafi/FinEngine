# Code Review Guidelines for FinEngine

## Overview
This repository contains a deterministic financial computation library for fintech applications. Code reviews ensure mathematical correctness, performance, maintainability, and alignment with the project's financial computation principles.

## General Review Principles

### 1. Financial Correctness
- **Mathematical Integrity**: Verify all calculations are deterministic and avoid floating-point errors
- **Precision Safety**: Ensure integer-scaled arithmetic for monetary values (BDT Poisha primitives)
- **Edge Cases**: Review boundary conditions, zero values, and extreme inputs
- **Unit Consistency**: Validate all monetary units are properly scaled and consistent

### 2. Code Quality
- **Determinism**: Code should produce identical outputs for identical inputs
- **Zero Dependencies**: No external runtime packages or third-party financial libraries
- **Performance**: Efficient algorithms for large datasets and recursive calculations
- **Readability**: Clear, self-documenting code with minimal comments

### 3. Testing & Validation
- **Comprehensive Coverage**: Every function must have thorough unit tests
- **Regression Protection**: Tests must cover edge cases and error conditions
- **Financial Validation**: Test against known mathematical results and industry standards

## Detailed Review Checklist

### A. Financial Logic
- [ ] Verify integer-scaled arithmetic implementation
- [ ] Check for floating-point drift mitigation
- [ ] Validate safe integer boundaries (≤ 2⁵³ - 1)
- [ ] Ensure terminal reconciliation rules are correctly implemented
- [ ] Review rounding specifications (Half-Away-From-Zero vs Half-To-Even)
- [ ] Validate currency primitive conversions (BDT → Poisha)

### B. Mathematical Functions
- [ ] **Amortization Calculations**
  - Verify EMI formula implementation
  - Check periodic interest accrual calculations
  - Validate principal liquidation logic
  - Test terminal reconciliation constraints

- [ ] **Advanced Solvers**
  - XIRR/IRR algorithm correctness
  - Convergence criteria validation
  - Boundary condition handling

- [ ] **Risk & Stress Testing**
  - DBR calculation accuracy
  - Stress scenario validation
  - Regulatory compliance checks

### C. Code Structure & Conventions
- [ ] **Module Organization**
  - `core`: Money types and ledger validation
  - `math`: Repayment calculations and solvers
  - `ui`: Finance display models

- [ ] **Function Signatures**
  - Clear input validation
  - Consistent return types
  - Proper error handling

- [ ] **Error Handling**
  - Safe integer overflow detection
  - Proper exception types
  - Clear error messages

### D. Testing Requirements
- [ ] **Unit Tests**
  - Every public function has tests
  - Edge cases covered (zero, extreme values)
  - Regression test suite included

- [ ] **Integration Tests**
  - Cross-module validation
  - End-to-end scenario testing
  - Performance benchmarks

### E. Documentation & Comments
- [ ] **API Documentation**
  - JSDoc comments for public functions
  - Parameter and return type documentation
  - Examples where appropriate

- [ ] **Financial Documentation**
  - Formula explanations
  - Assumptions and limitations
  - Regulatory references

### F. Performance & Security
- [ ] **Performance**
  - Algorithmic complexity review
  - Memory usage validation
  - Browser compatibility checks

- [ ] **Security**
  - No sensitive data exposure
  - Input sanitization
  - Sandbox safety validation

### G. Code Style & Conventions
- [ ] **JavaScript Standards**
  - ESLint/formatter compliance
  - Consistent naming conventions
  - Proper module imports/exports

- [ ] **TypeScript Usage**
  - Proper type annotations
  - Interface definitions
  - Generics usage where appropriate

## Review Process

### Phase 1: Initial Screening
- Verify repository structure integrity
- Check for required configuration files
- Validate test coverage and build processes

### Phase 2: Deep Dive Analysis
- Financial logic validation
- Code complexity review
- Performance and security assessment

### Phase 3: Final Approval
- Comprehensive validation completion
- Documentation review
- Documentation review

## Special Considerations

### Financial Regulations
- [ ] Verify compliance with local banking regulations
- [ ] Validate DBR (Debt-to-Income Ratio) calculation accuracy
- [ ] Check interest rate calculation compliance
- [ ] Ensure consumer protection provisions

### Internationalization
- [ ] Currency format validation (BDT localization)
- [ ] Number formatting (3-2-2 South Asian grouping)
- [ ] Date/time zone handling
- [ ] Accessibility compliance

### Client-Side Computation
- [ ] Zero network egress verification
- [ ] Offline capability validation
- [ ] Security sandbox compliance
- [ ] Browser compatibility testing

## Tools & Resources

### Development Tools
- TypeScript compiler (`tsc.base.json`)
- Package manager (npm)
- Build automation (scripts/)
- Testing framework (smoke tests)

### Validation Resources
- Live demo surfaces for manual testing
- Documentation examples
- Package examples (scripts/run-package-examples.mjs)

## Template for Review Comments

### Constructive Feedback
```
✅ [Feature/Improvement] Added [specific feature] with [approach]
✅ [Bug Fix] Fixed [issue] at [file:location]
✅ [Documentation] Updated [documentation] for [function]
⚠️ [Performance] Consider optimizing [function] for large datasets
⚠️ [Edge Case] Add test case for [scenario]
❌ [Issue] Block merge until [problem] is resolved
```

## Escalation Process

1. **Minor Issues**: Add comments and request changes
2. **Major Concerns**: Request pull request updates
3. **Critical Problems**: Block merge with explanation
4. **Disagreements**: Escalate to repository maintainer

## Continuous Improvement

- Regularly review review guidelines
- Update based on team feedback
- Incorporate new testing methodologies
- Adapt to changing financial regulations
- Include security best practices
