# API reference

Development API: `http://localhost:5000/api`. The React app calls `/api` through the Vite proxy.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | /health | No | Backend liveness |
| GET | /ready | No | Database connection readiness |
| POST | /auth/register | No | Create user; does not log in automatically |
| POST | /auth/login | No | Set HTTP-only session cookie |
| GET | /auth/me | Yes | Read current account |
| PATCH | /auth/me | Yes | Change display name |
| POST | /auth/logout | Cookie if present | Revoke session and clear cookie |
| GET | /examples | Yes | Latest 50 records owned by the current user |
| GET | /examples/:id | Yes | One owned record |
| POST | /examples | Yes | Create a record |
| PATCH | /examples/:id | Yes | Update title and/or description |
| PUT | /examples/:id | Yes | Replace editable fields; title required, omitted description becomes empty |
| DELETE | /examples/:id | Yes | Delete record; returns 204 |

Every mutation requires `X-App-Request: mern-base`. JSON payloads also need `Content-Type: application/json`.
For cross-origin development use the exact configured Origin and include cookies.

## Bodies

```json
{"name":"Test Student","email":"student@example.com","password":"a-long-test-passphrase"}
```

```json
{"email":"student@example.com","password":"a-long-test-passphrase"}
```

```json
{"title":"My first record","description":"A sample record"}
```

## Success

```json
{"success":true,"data":{"item":{"id":"...","title":"My first record","description":"A sample record","createdAt":"..."}},"message":"Record created."}
```

## Error

```json
{"success":false,"error":{"code":"VALIDATION_ERROR","message":"title must have 1-100 characters."},"requestId":"..."}
```

`lib/api.js` returns only the `data` object on success and throws `ApiError` for a failed HTTP response.
A request ID connects a UI/network error to a backend log. Passwords, cookies and JWTs are not logged.

## Status codes

200 OK; 201 created; 204 deleted; 400 invalid input/ID; 401 not signed in; 403 origin/request protection;
404 route or owned record not found; 409 duplicate email; 413 too large; 415 content type; 429 rate limit;
500 unexpected backend failure; 503 database unavailable on readiness endpoint.
