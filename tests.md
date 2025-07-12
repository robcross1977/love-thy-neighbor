"# Playwright Tests for Love Thy Neighbor App

## Overview

This document outlines a comprehensive set of Playwright tests to verify the functionality of the Love Thy Neighbor lawn care assistance application. Tests are organized by feature areas and cover key user flows, button interactions, request status changes, and edge cases. Each test includes a description, preconditions, steps, and expected outcomes.

The tests exercise:

- Authentication flows
- Request creation and editing
- Volunteer viewing and responding
- Admin approval and management
- My Requests management
- Status transitions (Pending → Approved → Open → In Progress → Completed)
- UI elements like buttons, filters, and badges
- Error handling and validations

## Test Environment Setup

- Use Playwright with TypeScript
- Run against local dev server (`http://localhost:3000`)
- Create test users: regular user, volunteer, admin
- Seed database with test data before runs
- Use headless mode for CI, headed for local debugging

## Tests by Feature

### 1. Authentication

**Test 1.1: Successful Login**

- Description: Verify user can log in and access protected pages
- Preconditions: Test user account exists
- Steps:
  1. Navigate to homepage
  2. Click Sign In button
  3. Enter credentials and submit
- Expected: Redirected to homepage with user menu visible

**Test 1.2: Unauthorized Access Redirect**

- Description: Ensure protected pages redirect to login
- Preconditions: Not logged in
- Steps:
  1. Navigate to /my-requests
- Expected: Redirected to signin page

**Test 1.3: Admin Access Control**

- Description: Non-admin cannot access admin dashboard
- Preconditions: Logged in as regular user
- Steps:
  1. Navigate to /admin
- Expected: Redirected or 403 error

### 2. Homepage

**Test 2.1: Homepage Loads**

- Description: Verify homepage elements and buttons
- Steps:
  1. Navigate to /
  2. Check for title, description, buttons
- Expected: All elements visible, buttons clickable

**Test 2.2: Navigation Buttons**

- Description: Test homepage navigation
- Steps:
  1. Click \"Volunteer to Help\"
  2. Verify redirect to /causes
  3. Go back, click \"Request Lawn Care Help\"
- Expected: Redirect to /create

### 3. Request Creation

**Test 3.1: Create New Request**

- Description: Submit a new lawn care request
- Preconditions: Logged in as regular user
- Steps:
  1. Navigate to /create
  2. Fill all required fields (title, description, address, etc.)
  3. Submit form
- Expected: Success message, redirect to /my-requests, request appears in list with Pending status

**Test 3.2: Form Validation**

- Description: Check required fields and error messages
- Steps:
  1. Submit empty form
  2. Check error messages
  3. Fill partially and submit
- Expected: Appropriate validation errors shown

**Test 3.3: Photo Upload**

- Description: Upload photo with request
- Steps:
  1. Fill form
  2. Upload image file
  3. Submit
- Expected: Photo URL saved, visible in request details

### 4. My Requests Page

**Test 4.1: View My Requests**

- Description: List user's requests with filters
- Preconditions: Logged in, has requests in different statuses
- Steps:
  1. Navigate to /my-requests
  2. Switch between filters (All, Pending, Approved, Open, Completed)
- Expected: Correct requests shown for each filter, status badges visible

**Test 4.2: Edit Request**

- Description: Edit existing request
- Steps:
  1. Click Edit button on a request
  2. Modify fields
  3. Submit
- Expected: Changes saved, visible in list

**Test 4.3: Manage Helpers**

- Description: Approve/Decline volunteer responses
- Preconditions: Request has pending responses
- Steps:
  1. Click Approve on a response
- Expected: Response status updated to Accepted, request status to In Progress

**Test 4.4: Complete Request**

- Description: Mark request as completed
- Steps:
  1. On open request with accepted helper, mark complete
- Expected: Status updated to Completed, review prompt shown

### 5. Volunteer Page (Causes)

**Test 5.1: View Available Requests**

- Description: Browse open lawn care requests
- Preconditions: Logged in as volunteer, approved requests exist
- Steps:
  1. Navigate to /causes
  2. Apply filters (All, Urgent, High, Medium)
- Expected: Filtered requests shown with details and urgency badges

**Test 5.2: Volunteer for Request**

- Description: Respond to a request
- Steps:
  1. Click Volunteer button
  2. Confirm submission
- Expected: Response created, notification to request owner

**Test 5.3: Empty State**

- Description: No requests available
- Preconditions: No open approved requests
- Steps:
  1. Navigate to /causes
- Expected: Empty state message shown with CTA to request help

### 6. Admin Dashboard

**Test 6.1: View Pending Requests**

- Description: Admin views and filters requests
- Preconditions: Logged in as admin, pending requests exist
- Steps:
  1. Navigate to /admin
  2. Switch filters
- Expected: Correct requests listed

**Test 6.2: Approve/Deny Request**

- Description: Change request approval status
- Steps:
  1. Click Approve on pending request
- Expected: Status updated to Approved, visible on volunteer page

**Test 6.3: Highlight Request**

- Description: Toggle highlight for approved request
- Steps:
  1. Click Highlight button
- Expected: Highlight badge shown, appears in featured section

### 7. Request Status Flows

**Test 7.1: Full Lifecycle**

- Description: End-to-end request flow
- Steps:
  1. User creates request (Pending)
  2. Admin approves (Approved, Open)
  3. Volunteer responds
  4. User approves volunteer (In Progress)
  5. User marks complete (Completed)
- Expected: All status changes reflected correctly in UI and DB

**Test 7.2: Denial Flow**

- Description: Admin denies request
- Steps:
  1. Create request
  2. Admin denies
- Expected: Status Denied, not visible to volunteers

### 8. Profile Management

**Test 8.1: Update Profile**

- Description: Edit user profile
- Preconditions: Logged in
- Steps:
  1. Navigate to /profile
  2. Update name, bio, etc.
  3. Save
- Expected: Changes persisted and visible

### 9. Error Handling

**Test 9.1: Network Errors**

- Description: Handle API failures gracefully
- Steps:
  1. Mock API failure on submit
- Expected: Error message shown, no crash

**Test 9.2: Invalid Inputs**

- Description: Test boundary conditions
- Steps:
  1. Enter invalid data (e.g., short description)
- Expected: Validation prevents submission

## Implementation Plan

- [x] Set up Playwright project (install, configure, add scripts)
  - Installed @playwright/test and dependencies
  - Created playwright.config.ts with basic config
  - Added test scripts to package.json
  - Created tests/homepage.test.ts and ran successfully
- [x] Build verification completed
  - Build completed successfully with warnings (expected for auth pages)
  - Dynamic server usage warnings are normal for authenticated routes
  - App is ready for deployment
- [ ] Create test utils (login helper, database seeder)
- [ ] Implement Authentication tests (1.1 - 1.3)
- [ ] Implement Homepage tests (2.1 - 2.2)
- [ ] Implement Request Creation tests (3.1 - 3.3)
- [ ] Implement My Requests tests (4.1 - 4.4)
- [ ] Implement Volunteer Page tests (5.1 - 5.3)
- [ ] Implement Admin Dashboard tests (6.1 - 6.3)
- [ ] Implement Full Lifecycle test (7.1 - 7.2)
- [ ] Implement Profile tests (8.1)
- [ ] Implement Error Handling tests (9.1 - 9.2)
- [ ] Add CI integration (run on pull requests)
- [ ] Document test running instructions

Progress: 0/12 completed"
