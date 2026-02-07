# API Contract

Base URL: `http://localhost:3000`

## POST /api/captions/generate
Generates platform-tuned caption.

## POST /api/media/process
Uploads source media to Cloudinary, archives source in Drive, and returns resized variants.

## POST /api/media/video-jobs
Creates async vertical promo video job.

## GET /api/media/video-jobs/:jobId
Returns current video job status and output URL when complete.

## POST /api/publish
Publishes one post using unified platform adapter.

## POST /api/publish/batch
Publishes multiple posts across platforms.

## POST /api/comments/webhook
Classifies intent and auto-replies with WhatsApp CTA if API allows.

## GET /api/reports/weekly
Returns posting, engagement, top-content, and recommendation summary.
