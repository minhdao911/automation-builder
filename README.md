## Development

1. Run ngrok

```bash
npm run ngrok
# or
bun ngrok
```

2. Run the development server:

```bash
npm run dev
# or
bun dev
```

3. Update local variables

```bash
# App
SERVER_URL=$ngRokUrl
```

4. Copy URL from ngrok and update Clerk webhook endpoint

5. Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.

## DB Migrations

To create and apply new migration, run

```bash
bun db-migrate $migrationName
```

To push changes without using migrations, run

```bash
bun db-push
```
