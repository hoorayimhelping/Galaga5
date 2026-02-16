# HCAP - LP Management Platform

An AI-powered platform for VC funds to manage Limited Partner relationships, track commitments, and streamline fundraising operations.

## 🎯 Overview

HCAP is a comprehensive LP management platform built specifically for VC funds. Track your LP relationships from prospect to active investor, manage capital calls, sync Gmail communications, and get AI-powered insights on your fundraising progress.

## ✅ Features

### LP Management
- **Complete LP CRM** with support for:
  - Individuals, Family Offices, Institutions, Fund of Funds
  - Financial tracking: commitments, capital called, distributions
  - Status pipeline: Prospect → Contacted → Interested → Committed → Active
  - Priority levels and custom notes
- **CSV Import** from Salesforce and Google Sheets
- **Advanced filtering** by type, status, and search
- **Individual LP profiles** with full history

### Pipeline Visualization
- **Kanban board** showing LPs across fundraising stages
- **Commitment totals** by stage
- **Drag-and-drop** interface (visual only, updates via profile page)
- **Search and filter** across the pipeline

### Gmail Integration
- **OAuth connection** to Gmail
- **Auto-sync emails** with LP records
- **Automatic matching** of emails to LPs
- **Email tracking** (sent/opened/replied)

### Interaction Tracking
- Log all touchpoints: emails, calls, meetings, LinkedIn, notes
- Track sentiment and outcomes
- Meeting scheduling with date/time
- Complete interaction timeline

### AI Insights
- Weekly progress analysis
- Smart follow-up recommendations
- Activity trend monitoring
- LP engagement scoring

### Dashboard & Analytics
- Total LPs and active LP counts
- Total commitments and capital called
- Weekly activity tracking
- Upcoming meetings

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this"

# Gmail OAuth (optional, for email integration)
GMAIL_CLIENT_ID="your-client-id"
GMAIL_CLIENT_SECRET="your-client-secret"
NEXT_PUBLIC_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and apply schema
npx prisma db push --force-reset
```

### 4. Load Sample Data

```bash
# Install tsx for running TypeScript
npm install -D tsx

# Run the sample data seeder
npx tsx scripts/seed-sample-lps.ts
```

This creates 13 sample LPs with:
- 3 Individuals
- 3 Family Offices
- 2 Institutions
- 2 Fund of Funds
- 3 Prospects at various stages
- Sample interactions for each

### 5. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

### 6. Create Your Account

1. Register at `/register`
2. Login at `/login`
3. Explore the sample data or import your own!

## 📊 Platform Features

### Dashboard (`/dashboard`)
- Overview of all LP metrics
- Total commitments and capital called
- Weekly activity summary
- Quick actions for common tasks

### LP Management (`/dashboard/lps`)
- View all LPs with advanced filtering
- Search by name, email, organization
- Filter by type (Individual, Family Office, etc.)
- Filter by status (Prospect → Active)
- See commitment amounts and activity counts

### Pipeline Board (`/dashboard/pipeline`)
- Visual Kanban board of LP stages
- Commitment totals per stage
- Quick LP overview cards
- Search across all stages

### LP Detail Page (`/dashboard/lps/[id]`)
- Complete LP profile
- Financial summary with progress bars
- Investment preferences
- Full interaction history
- Quick contact actions

### CSV Import (`/dashboard/lps/import`)
- Import from Salesforce or Google Sheets
- Flexible field mapping
- Validation and error handling
- Bulk upload with progress tracking

### Gmail Integration (`/dashboard/settings`)
- OAuth connection flow
- Auto-sync last 30 days of emails
- Automatic LP matching
- Email interaction tracking

## 🗄️ Database Schema

### Core Models

- **LP (Limited Partner)**: Full LP records with financial data
- **Commitment**: Capital calls and distributions
- **Interaction**: All touchpoints (emails, calls, meetings)
- **User**: Multi-user authentication
- **Integration**: OAuth tokens for Gmail, Calendar, etc.
- **PipelineStage**: Stage progression tracking
- **Insight**: AI-generated recommendations
- **EmailTemplate**: Reusable email templates

## 📥 Importing Your Data

### From Salesforce

1. Export Contacts/Accounts to CSV
2. Navigate to `/dashboard/lps/import`
3. Upload your CSV file
4. Required: `FirstName`, `LastName`
5. Optional: All other fields (flexible mapping)

### From Google Sheets

1. File → Download → CSV
2. Ensure columns: FirstName, LastName minimum
3. Upload at `/dashboard/lps/import`

### Supported Field Names

The importer handles various column name formats:
- **Names**: FirstName, First Name, firstName
- **Organization**: Company, Organization, AccountName
- **LP Type**: Type, lpType (values: individual, family_office, institution, fund_of_funds)
- **Financial**: Commitment, "Capital Called"
- **Status**: Status (values: prospect, contacted, interested, committed, active, inactive, exited)

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Gmail API (OAuth 2.0)
- **AI**: Rule-based insights (LLM integration ready)

## 🔐 Gmail OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/integrations/gmail/callback`
6. Copy Client ID and Secret to `.env`
7. Connect in `/dashboard/settings`

## 🎨 Sample Data Overview

The seeder creates realistic sample data:

**Active LPs:**
- Sarah Chen (Individual, $500K, Enterprise SaaS focus)
- David Patterson (Family Office, $5M, Anchor LP)
- Amanda Foster (University Endowment, $10M, Institutional)
- Emily Zhang (Global Ventures FoF, $8M, VC Fund investor)

**Prospects:**
- Rachel Kim (Interested, warm intro from Sarah)
- Marcus Johnson (Contacted, follow-up in 2 weeks)
- Patricia White (Prospect, target anchor LP)

Each active LP includes:
- 3-4 sample interactions
- Realistic financial commitments
- Notes and context

## 🚧 Future Enhancements

- [ ] Capital call management interface
- [ ] Distribution tracking and reporting
- [ ] Quarterly update email campaigns
- [ ] Document vault for LPAs and agreements
- [ ] Calendar integration (Google/Outlook)
- [ ] LinkedIn import and tracking
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Mobile responsive improvements

## 📝 License

Private - All Rights Reserved
