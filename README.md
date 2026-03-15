# One Timer

A web app for sharing sensitive information using one-time links. Create a secret, send the link to the recipient — once they open it, the secret is permanently deleted.

## How it works

1. Submit a secret via the web UI
2. The server encrypts it with AES-256-CBC and stores the ciphertext in SQLite
3. The encryption key is embedded in the shareable link (never stored server-side)
4. When the recipient opens the link, the secret is decrypted and immediately deleted
5. The link stops working after first access or after 24 hours, whichever comes first

## Stack

- [Bun](https://bun.sh) — runtime, server, bundler, test runner
- [React](https://react.dev) + [React Router](https://reactrouter.com) — frontend
- [SQLite](https://www.sqlite.org) via `bun:sqlite` — storage
- [Tailwind CSS](https://tailwindcss.com) — styling

## Development

```sh
bun install
bun run dev
```

## Tests

```sh
bun test
```

## Production

```sh
bun run build
bun run start
```
