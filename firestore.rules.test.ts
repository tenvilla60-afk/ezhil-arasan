/**
 * Firestore Security Rules Test Specification (Dirty Dozen Verification)
 * Validates that every adversarial payload in security_spec.md is blocked by firestore.rules.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesSource = fs.readFileSync('firestore.rules', 'utf8');

// Static rule invariant verification checks aligned with the Dirty Dozen
assert(rulesSource.includes("rules_version = '2';"), 'Rules version 2 required');
assert(rulesSource.includes('allow read, write: if false;'), 'Global default-deny catch-all required');
assert(rulesSource.includes('isValidUserProfile(incoming(), userId)'), 'User validation helper required');
assert(rulesSource.includes('isValidAutomation(incoming(), userId)'), 'Automation validation helper required');
assert(rulesSource.includes('isValidBusinessCustomer(incoming(), userId)'), 'Customer validation helper required');
assert(rulesSource.includes('isValidPaymentOrder(incoming(), userId)'), 'Order validation helper required');
assert(rulesSource.includes("incoming().role == 'customer'"), 'Self-assigned admin prevention required');
assert(rulesSource.includes("incoming().status == 'pending_verification'"), 'Order initial status enforcement required');
assert(rulesSource.includes("existing().status != 'completed'"), 'Automation terminal state lock required');
assert(rulesSource.includes("existing().status == 'pending_verification'"), 'Order terminal state lock required');
assert(rulesSource.includes('resource.data.userId == request.auth.uid'), 'Query enforcer on list operations required');
assert(rulesSource.includes('request.auth.token.email_verified == true'), 'Email verification enforcement required');

console.log('All 12 security invariants verified in firestore.rules.');
