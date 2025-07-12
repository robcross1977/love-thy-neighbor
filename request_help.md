# Request Help Feature Plan

## Overview

Allow users to submit help requests for essential needs (food, medical, elderly care, financial assistance) with location data and proper categorization.

## Core Requirements

- [ ] Form validation and error handling
- [ ] Location detection and address input
- [ ] Category selection (food, medical, elderly, financial)
- [ ] Urgency level selection
- [ ] Photo upload capability
- [ ] Contact method preferences
- [ ] Database integration with Prisma
- [ ] Authentication requirement
- [ ] Email notifications to nearby helpers

## Detailed Tasks

### Form Components

- [x] Basic form structure with React Hook Form
- [x] Category selection with icons
- [x] Urgency level selection
- [x] Title and description fields
- [x] Location input with geolocation
- [ ] Photo upload component
- [ ] Contact method selection (in-app, phone, email)
- [ ] Estimated duration field
- [ ] Skills needed field
- [ ] Maximum helpers field
- [ ] Recurring request option

### Validation & Error Handling

- [x] Zod schema for form validation
- [ ] Client-side validation messages
- [ ] Server-side validation
- [ ] Error boundary for form crashes
- [ ] Loading states during submission
- [ ] Success confirmation page
- [ ] Handle geolocation errors gracefully

### Database Integration

- [ ] Create API route `/api/help-requests`
- [ ] Implement POST handler for new requests
- [ ] Connect to Prisma database
- [ ] Handle database errors
- [ ] Generate unique request IDs
- [ ] Store location coordinates
- [ ] Link to authenticated user

### Location Features

- [x] Get current location button
- [ ] Address autocomplete with Google Places API
- [ ] Validate address exists
- [ ] Convert address to coordinates
- [ ] Display location on mini map
- [ ] Allow manual coordinate adjustment
- [ ] Privacy settings for location precision

### Photo Upload

- [ ] Image upload component
- [ ] File size validation (max 5MB)
- [ ] Image format validation (jpg, png, webp)
- [ ] Image compression/resizing
- [ ] Cloud storage integration (AWS S3 or similar)
- [ ] Multiple photo support (max 3)
- [ ] Photo preview and removal

### Notifications

- [ ] Find users within radius of request
- [ ] Send email notifications to nearby helpers
- [ ] In-app notification system
- [ ] SMS notifications (optional)
- [ ] Notification preferences per user
- [ ] Unsubscribe functionality

### User Experience

- [ ] Progress indicator for multi-step form
- [ ] Save draft functionality
- [ ] Form auto-save every 30 seconds
- [ ] Mobile-responsive design
- [ ] Accessibility compliance
- [ ] Clear instructions and help text
- [ ] Example requests for guidance

### Security & Privacy

- [ ] Rate limiting for requests (max 5 per day)
- [ ] Content moderation for descriptions
- [ ] Report inappropriate content
- [ ] User verification requirements
- [ ] Location privacy controls
- [ ] Data retention policies

### Testing

- [ ] Unit tests for form validation
- [ ] Integration tests for API routes
- [ ] E2E tests for full request flow
- [ ] Test geolocation scenarios
- [ ] Test photo upload edge cases
- [ ] Performance testing for large forms

## API Endpoints Needed

- [ ] `POST /api/help-requests` - Create new request
- [ ] `GET /api/users/nearby` - Find helpers in radius
- [ ] `POST /api/notifications/send` - Send notifications
- [ ] `POST /api/upload/images` - Handle photo uploads

## Database Schema Updates

- [ ] Ensure HelpRequest model has all needed fields
- [ ] Add photo URLs array field
- [ ] Add contact preferences
- [ ] Add privacy settings
- [ ] Create indexes for location queries
- [ ] Add audit fields (created_at, updated_at)

## Environment Variables Needed

- [ ] `GOOGLE_PLACES_API_KEY` - For address autocomplete
- [ ] `AWS_S3_BUCKET` - For photo storage
- [ ] `SENDGRID_API_KEY` - For email notifications
- [ ] `TWILIO_API_KEY` - For SMS notifications (optional)

## Success Criteria

- [ ] User can submit a help request in under 3 minutes
- [ ] Form works on mobile and desktop
- [ ] Location detection works 95% of the time
- [ ] Photos upload successfully
- [ ] Nearby helpers receive notifications within 5 minutes
- [ ] Request appears in "Find Help" feed immediately
- [ ] User receives confirmation of submission

## Future Enhancements

- [ ] Request templates for common needs
- [ ] Bulk request creation for organizations
- [ ] Integration with local food banks
- [ ] Calendar scheduling for help delivery
- [ ] Real-time chat with potential helpers
- [ ] Request status tracking and updates
