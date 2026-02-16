# HCAP Integrations Framework

This directory contains integration modules for connecting HCAP with external services.

## Planned Integrations

### 1. Email Integration (Gmail/Outlook)
**Files to create:**
- `lib/integrations/email/gmail.ts`
- `lib/integrations/email/outlook.ts`

**Features:**
- OAuth authentication
- Auto-log sent/received emails with contacts
- Track email open rates and responses
- Sync email conversations
- Create contacts from email addresses

**APIs to use:**
- Gmail API: https://developers.google.com/gmail/api
- Microsoft Graph API: https://learn.microsoft.com/en-us/graph/api/overview

### 2. Calendar Integration
**Files to create:**
- `lib/integrations/calendar/google-calendar.ts`
- `lib/integrations/calendar/outlook-calendar.ts`

**Features:**
- OAuth authentication
- Auto-create interaction records for meetings
- Set follow-up reminders
- Show availability
- Sync meeting notes

**APIs to use:**
- Google Calendar API: https://developers.google.com/calendar/api
- Microsoft Graph Calendar: https://learn.microsoft.com/en-us/graph/api/resources/calendar

### 3. LinkedIn Integration
**Files to create:**
- `lib/integrations/linkedin/api.ts`

**Features:**
- Import investor profiles
- Track LinkedIn messages and connection requests
- Auto-populate contact information
- Monitor profile views

**APIs to use:**
- LinkedIn API: https://docs.microsoft.com/en-us/linkedin/
- Note: May require LinkedIn Premium for full access

### 4. Document Storage
**Files to create:**
- `lib/integrations/storage/google-drive.ts`
- `lib/integrations/storage/dropbox.ts`

**Features:**
- Store pitch decks and fundraising materials
- Version control for documents
- Share documents with contacts
- Track document views

**APIs to use:**
- Google Drive API: https://developers.google.com/drive/api
- Dropbox API: https://www.dropbox.com/developers

## Implementation Guide

### OAuth Flow
1. Register application with each service
2. Store client ID and secret in `.env`
3. Implement OAuth callback route in `app/api/integrations/[service]/callback`
4. Store access tokens securely in database
5. Implement token refresh logic

### Database Schema Addition
Add to `prisma/schema.prisma`:
```prisma
model Integration {
  id           String   @id @default(cuid())
  userId       String
  service      String   // gmail, outlook, linkedin, etc.
  accessToken  String
  refreshToken String?
  expiresAt    DateTime?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, service])
}
```

### Environment Variables
Add to `.env`:
```env
# Gmail
GMAIL_CLIENT_ID=""
GMAIL_CLIENT_SECRET=""
GMAIL_REDIRECT_URI="http://localhost:3000/api/integrations/gmail/callback"

# Outlook
OUTLOOK_CLIENT_ID=""
OUTLOOK_CLIENT_SECRET=""
OUTLOOK_REDIRECT_URI="http://localhost:3000/api/integrations/outlook/callback"

# LinkedIn
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# Google Drive
GDRIVE_CLIENT_ID=""
GDRIVE_CLIENT_SECRET=""

# Dropbox
DROPBOX_APP_KEY=""
DROPBOX_APP_SECRET=""
```

## Testing Integrations

1. Create test accounts for each service
2. Use OAuth Playground to test authentication
3. Test token refresh before expiration
4. Handle rate limits gracefully
5. Test error scenarios (expired tokens, revoked access, etc.)

## Security Considerations

1. **Never log or expose tokens**
2. Encrypt tokens at rest in database
3. Use HTTPS for all OAuth callbacks
4. Implement CSRF protection
5. Validate webhook signatures
6. Use minimal OAuth scopes needed
7. Implement token rotation
8. Add rate limiting for API calls

## Future Enhancements

- Webhook support for real-time updates
- Batch operations for syncing
- Background jobs for periodic syncs
- Conflict resolution for data conflicts
- Integration health monitoring
- Usage analytics and quotas
