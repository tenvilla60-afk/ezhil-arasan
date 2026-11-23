# Security Specification — EZ AI WORLD

## 1. Data Invariants
1. **Strict Ownership**: Every document under `/users/{userId}` and its subcollections (`automations`, `customers`, `orders`) belongs strictly to `userId == request.auth.uid`. No user may read, list, create, update, or delete another user's PII, CRM contacts, workflows, or orders.
2. **Role Escalation Prevention**: On `/users/{userId}` creation, `role` MUST equal `'customer'`. Users cannot self-assign `'admin'` or alter `role` or `aiCreditsLimit` on update unless authenticated as a verified admin (`ezhil0331@gmail.com` with `email_verified == true`).
3. **Master Gate Sync**: Subcollections (`automations`, `customers`, `orders`) require `exists(/databases/$(database)/documents/users/$(userId))` on `create` so orphaned subcollection records cannot exist without an initialized customer profile.
4. **Temporal & Immutable Field Integrity**: `createdAt` must equal `request.time` on creation and remain immutable on updates. `updatedAt` must equal `request.time` on both creation and update. Ownership fields (`uid`, `userId`) are immutable.
5. **Terminal State Locking**: Orders reaching `status == 'fulfilled'` and automations reaching `status == 'completed'` cannot be mutated by non-admin users.
6. **PII Isolation & Query Enforcement**: `/users` blocks blanket list queries by non-admins. Subcollection `list` operations enforce `resource.data.userId == request.auth.uid` directly in the rule without `get()`/`exists()` calls.

## 2. The "Dirty Dozen" Payloads (All Must Return PERMISSION_DENIED)
1. **Unauthenticated Profile Read**: Anonymous `get(/users/userA)`.
2. **Cross-Tenant PII Snooping**: User B attempting `get(/users/userA)` or `list(/users)`.
3. **Self-Assigned Admin Role**: User A creating `/users/userA` with `{ role: 'admin' }`.
4. **Shadow Field Injection (Ghost Field)**: User A creating `/users/userA` with an unexpected `{ isVerified: true }` field.
5. **Unverified Email Write**: User with `email_verified: false` attempting `create` on `/users/userA/orders/ord1`.
6. **ID Poisoning**: User A creating `/users/userA/orders/<1500-char-invalid-id>` with non-alphanumeric characters or oversized length.
7. **Timestamp Forgery**: User A creating `/users/userA/automations/auto1` with a backdated `createdAt` instead of server `request.time`.
8. **Quota Tampering**: User A updating `/users/userA` to set `aiCreditsLimit: 9999999` or `role: 'admin'`.
9. **Array Flood Attack**: User A updating `activeServices` on `/users/userA` with 50 array elements (> 5 max).
10. **Order Payment Spoofing**: User A creating `/users/userA/orders/ord1` with `status: 'verified'` or `status: 'fulfilled'` instead of `'pending_verification'`.
11. **Terminal State Reversal**: User A updating an order whose existing `status == 'fulfilled'` back to `'pending_verification'`.
12. **Orphaned Subcollection Write / Ownership Spoof**: User A creating `/users/userB/customers/cust1` or setting `userId: 'userB'` inside `/users/userA/customers/cust1`.
