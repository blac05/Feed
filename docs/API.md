# Feed API

Base URL:

```text
http://localhost:8080
```

## Auth

`POST /api/auth/request-verification`

```json
{
  "email": "ari@example.com",
  "phone": "+2348012345678"
}
```

`POST /api/auth/register`

```json
{
  "name": "Ari Johnson",
  "handle": "ari_feed",
  "dateOfBirth": "2000-01-01",
  "email": "ari@example.com",
  "phone": "+2348012345678",
  "emailCode": "123456",
  "phoneCode": "654321",
  "password": "feedpassword",
  "wallpaperUrl": "https://example.com/wallpaper.jpg"
}
```

## User

- `GET /api/me`
- `PATCH /api/me`

Use:

```text
Authorization: Bearer YOUR_TOKEN
```

## Posts

- `GET /api/posts`
- `POST /api/posts`
- `POST /api/posts/:postId/like`
- `POST /api/posts/:postId/repost`
- `POST /api/posts/:postId/share`
- `POST /api/posts/:postId/comments`

## Pages

- `GET /api/pages`
- `POST /api/pages/:pageId/follow`

## Events

- `GET /api/events`
- `POST /api/events/:eventId/tickets`
- `POST /api/events/:eventId/updates`

## Notifications

- `GET /api/notifications`
