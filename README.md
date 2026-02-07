# DishNet Africa AI Social Marketing Automation

Production-ready Node.js + TypeScript automation backend for multi-platform lead generation and brand awareness campaigns for DishNet Africa Fiber Internet (up to 20 Mbps from $50/month).

## Features
- AI caption generation with platform-specific formatting.
- Cloudinary media ingestion and platform-native transformations.
- Async vertical promo video generation workflow.
- Unified publishing across Facebook, Instagram, LinkedIn, X, TikTok, and YouTube Shorts.
- Comment intent detection and WhatsApp CTA auto-replies where APIs allow.
- Lead + engagement tracking in local JSON store (Google integrations supported).
- n8n-compatible webhook workflows.
- Dockerized deployment.

## Setup
```bash
cp .env.example .env
npm install
npm run dev
```

Production:
```bash
npm run build
npm start
```

Docker:
```bash
docker compose up --build -d
```

## API Keys and Permissions
- OpenAI: Responses API access.
- Cloudinary: Media upload + delivery transformations.
- Facebook Graph API: `pages_manage_posts`, `pages_read_engagement`, `instagram_content_publish`, `instagram_manage_comments`.
- Instagram Graph API: Business account linked to Facebook Page.
- LinkedIn Marketing API: Organization posting scope (`w_organization_social`).
- X API v2: Tweet create scope.
- TikTok Content Posting API: Video upload/publish access.
- YouTube Data API v3: Upload + channel access.
- Google Drive API: Service account with folder write access.

## Endpoints
- `GET /health`
- `POST /api/media/process`
- `POST /api/media/video-jobs`
- `GET /api/media/video-jobs/:jobId`
- `POST /api/captions/generate`
- `POST /api/publish`
- `POST /api/publish/batch`
- `POST /api/comments/webhook`
- `GET /api/reports/weekly`

## Posting Matrix
| Platform | Supported | Media | Caption Style | Notes |
|---|---|---|---|---|
| Facebook Pages | Yes | Image | Short paragraph + CTA | Uses Graph Page photo endpoint |
| Instagram Feed + Reels | Yes | Image + Video | Emoji + hashtag optimized | Uses media container + publish flow |
| LinkedIn Pages | Yes | Image | Professional short paragraph + CTA | Requires organization URN |
| X (Twitter) | Yes | Image URL in text payload | <= 280 chars | Token-gated |
| TikTok | Yes | Video | Casual + hashtag driven | Pull-from-URL publish init |
| YouTube Shorts | Yes | Video | Hook + CTA | Upload endpoint integration |

## Example Payloads
Caption request:
```json
{
  "offer": "Fiber internet up to 20 Mbps from $50/month",
  "theme": "price",
  "platform": "instagram"
}
```

Media process request:
```json
{
  "filePath": "/absolute/path/to/asset.jpg"
}
```

Publish request:
```json
{
  "platform": "facebook",
  "mediaUrl": "https://res.cloudinary.com/...",
  "caption": "Stay connected with DishNet Africa...",
  "mediaType": "image"
}
```

Comment webhook request:
```json
{
  "platform": "facebook",
  "postId": "12345",
  "commentId": "c_987",
  "commentText": "How much is monthly package?"
}
```

## n8n Integration Guide
1. Import workflows from `src/workflows/*.json`.
2. Set n8n env var `API_BASE_URL` to this service URL.
3. Trigger `/dishnet/media-intake` when creative assets arrive.
4. Trigger `/dishnet/video` for vertical promo render jobs.
5. Trigger `/dishnet/publish` with prebuilt batch payload for scheduled posting.

## Scheduling
Use `SchedulerService` in automation runners:
- `scheduleAt(date, payloads)` for timed campaigns.
- `scheduleRecurring('daily' | 'weekly', payloads)` for recurring campaigns.

## Platform Limitations and Fallbacks
- APIs requiring elevated review are auto-mocked when credentials are absent.
- Comment auto-replies degrade to `manual_review` response when endpoint capabilities are unavailable.
- Publishing is isolated per platform; one failure does not block others.
- Retry with exponential backoff is applied to external API requests.

## Repository Layout
```
/src
 ├─ api
 │   ├─ media.controller.ts
 │   ├─ publish.controller.ts
 │   ├─ comments.controller.ts
 │   └─ reports.controller.ts
 ├─ platforms
 │   ├─ facebook.service.ts
 │   ├─ instagram.service.ts
 │   ├─ linkedin.service.ts
 │   ├─ twitter.service.ts
 │   ├─ tiktok.service.ts
 │   ├─ youtube.service.ts
 │   └─ platform.interface.ts
 ├─ services
 │   ├─ openai.service.ts
 │   ├─ cloudinary.service.ts
 │   ├─ media.service.ts
 │   ├─ whatsapp.service.ts
 │   └─ scheduler.service.ts
 ├─ workflows
 ├─ utils
 ├─ config
 └─ index.ts
```
