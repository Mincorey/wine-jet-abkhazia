# Security Spec for Wine Jet Web App

## 1. Data Invariants

- **Admins Collection**: The `admins` collection contains document IDs that map to user UIDs. Only these users have write access to `wines` and `news`.
- **Public Read Access**: Anyone can read `wines` and `news` collections, without needing to be signed in.
- **Strict Schema for Wines**: A wine must have specific fields like `name`, `type`, `price`, etc.
- **Strict Schema for News**: A news item must have `title`, `date`, `preview`, `content`, `image`.
- **Immutable Timestamps**: `createdAt` must match `request.time` on creation and cannot be changed on update. `updatedAt` must be updated on every change.
- **No Self-Assigned Admins**: Users cannot write to the `admins` collection ever. It must be manually bootstrapped or synced from a trusted server context. Since there's no server context here, the Firebase Rules will bootstrap the first user (the developer's email) or we will just use `email_verified` check against a hardcoded list temporarily, or strictly enforce read-only from client and rely on initial bootstrap using get(). Actually, the rule requires `admins` to be unmodifiable by the client. So `allow write: if false;` for `admins`.

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Write**: Creating a wine without being signed in.
2. **Non-Admin Write**: Creating a wine while signed in as a non-admin.
3. **Shadow Field Injection**: Creating a wine with an extra `isFeatured: true` field not in schema.
4. **Missing Required Field**: Creating a wine without `grapes`.
5. **Type Violation**: Setting `price` to a boolean instead of string.
6. **Size Exhaustion**: Setting `name` to a string 1MB long.
7. **Timestamp Tampering**: Trying to set `createdAt` to a time in the past.
8. **Updating Immutable Field**: Trying to change `createdAt` on update.
9. **Role Escalation**: Trying to create a document in `admins` to make oneself an admin.
10. **ID Poisoning**: Using a 1.5KB string or path traversal for a document ID.
11. **Malicious Image URL**: URL exceeding reasonable length (e.g., > 2000 chars) for `imageUrl`.
12. **Blanket PII Leak**: (N/A here since no PII is stored, but tested against `admins` collection read access).

## 3. The Test Runner

Written in `firestore.rules.test.ts`.
