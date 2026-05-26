# Feed Backend

Node.js backend API for Feed.

## Start

```bash
npm start
```

The API runs at:

```text
http://localhost:8080
```

## Structure

```text
src
|-- config
|-- controllers
|-- middleware
|-- models
|-- routes
`-- utils
```

## Notes

- Email and phone verification are mocked for development.
- Data is stored in `backend/data/db.json`.
- Replace JSON storage with a production database before public launch.
- Replace SHA-256 password hashing with bcrypt or Argon2 before public launch.
