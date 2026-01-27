# TalentMatch AI - Premium Job Matching Platform

A modern, AI-powered talent matching platform that connects job seekers with their perfect opportunities through intelligent resume analysis and job matching algorithms.

## Features

### 🎯 Core Features
- **AI-Powered Resume Analysis**: Upload and parse resumes with advanced AI technology
- **Smart Job Matching**: Get job recommendations with precise match percentages
- **Advanced Filtering**: Filter by location, experience, industry, company, and salary
- **Google OAuth Authentication**: Seamless sign-in with Google accounts
- **Freemium Model**: Free basic features with premium upgrades available

### 💼 Job Seeker Features
- **Resume Upload**: Support for PDF, DOC, and DOCX formats
- **Skill Extraction**: AI automatically identifies and categorizes skills
- **Experience Analysis**: Parses work experience and education
- **Job Search**: Comprehensive search with multiple filters
- **Match Scoring**: Percentage-based job compatibility scoring
- **Apply Integration**: Direct application links with top and bottom placement

### 💰 Monetization
- **Free Plan**: 
  - Upload up to 3 resumes
  - Basic AI analysis
  - 5 job matches per day
  - Basic filtering
  - Email support

- **Premium Plan ($29/month or $290/year)**:
  - Unlimited resume uploads
  - Advanced AI analysis
  - Unlimited job matches
  - Advanced filtering
  - Resume optimization
  - Interview preparation
  - Priority email support
  - Career insights dashboard

- **Enterprise Plan ($99/month)**:
  - Everything in Premium
  - Team collaboration tools
  - Custom integrations
  - Dedicated account manager
  - API access
  - Custom reporting
  - White-label options
  - Phone support

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **React Query**: Data fetching and state management
- **Framer Motion**: Smooth animations
- **React Hot Toast**: Beautiful notifications

### Backend & Services
- **Firebase**: Authentication, database, and storage
- **Stripe**: Payment processing
- **OpenAI API**: AI-powered resume parsing and job matching
- **Job APIs**: Indeed, LinkedIn integration for job listings

### UI/UX
- **Minimalistic Design**: Clean, modern interface
- **Responsive Layout**: Mobile-first design
- **Premium Aesthetics**: Professional color scheme with gold accents
- **Smooth Animations**: Micro-interactions and transitions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Stripe account
- OpenAI API key (optional for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talent-match-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your API keys in `.env.local`:
   - Firebase configuration
   - Stripe keys
   - OpenAI API key
   - Job search API keys

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── AuthProvider.tsx  # Firebase auth context
│   ├── Footer.tsx        # Site footer
│   ├── Features.tsx      # Features section
│   ├── Hero.tsx          # Hero section
│   ├── JobList.tsx       # Job listings
│   ├── JobSearch.tsx     # Job search interface
│   ├── Navbar.tsx        # Navigation bar
│   ├── Pricing.tsx       # Pricing plans
│   ├── QueryProvider.tsx # React Query provider
│   ├── ResumeUpload.tsx  # Resume upload component
│   └── StatsCards.tsx    # Dashboard statistics
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication functions
│   ├── firebase.ts      # Firebase configuration
│   ├── jobService.ts    # Job search and matching
│   └── resumeService.ts # Resume upload and parsing
└── public/              # Static assets
```

## Key Components

### Resume Upload & Parsing
- Drag-and-drop interface
- File validation (PDF, DOC, DOCX)
- AI-powered content extraction
- Real-time parsing feedback
- Skills and experience categorization

### Job Matching Algorithm
- Semantic search capabilities
- Skill-based matching
- Experience level analysis
- Location preferences
- Industry-specific matching

### Search & Filtering
- Full-text search
- Multi-criteria filtering
- Real-time results
- Saved searches
- Search history

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Other Platforms
Ensure your platform supports:
- Next.js 14
- Serverless functions
- Environment variables

## API Integration

### Resume Parsing API
```typescript
POST /api/parse-resume
Content-Type: multipart/form-data
Body: resume file
Response: {
  skills: string[]
  experience: string[]
  education: string[]
  summary: string
}
```

### Job Search API
```typescript
POST /api/search-jobs
Content-Type: application/json
Body: {
  query: string
  location: string
  experience: string
  industry: string
  company: string
  salary: string
}
Response: Job[]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact:
- Email: support@talentmatch.ai
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
