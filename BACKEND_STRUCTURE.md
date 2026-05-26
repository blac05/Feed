# Feed Backend Structure

```text
backend
|-- package.json
|-- server.js
`-- src
    |-- app.js
    |-- config
    |   `-- env.js
    |-- controllers
    |   |-- auth.controller.js
    |   |-- event.controller.js
    |   |-- notification.controller.js
    |   |-- page.controller.js
    |   |-- post.controller.js
    |   `-- user.controller.js
    |-- middleware
    |   |-- auth.middleware.js
    |   `-- logger.middleware.js
    |-- models
    |   |-- post.model.js
    |   |-- seed.model.js
    |   |-- store.model.js
    |   `-- user.model.js
    |-- routes
    |   |-- auth.routes.js
    |   |-- event.routes.js
    |   |-- notification.routes.js
    |   |-- page.routes.js
    |   |-- post.routes.js
    |   `-- user.routes.js
    `-- utils
        |-- http.js
        `-- security.js
```

The `backend/data/db.json` file is created automatically when the backend starts.
