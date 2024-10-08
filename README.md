# Automation Builder

A web application built using [Next 14](https://nextjs.org/), designed to automate tasks with integrations to services like Google, Slack, and Notion. This project was inspired by [webprodigies fuzzie project](https://github.com/webprodigies/fuzzie-production/tree/main), but the code, workflow logic, and UI has been further improved to ensure that every component is usable and users are able to build custom workflows that actually function as desired.

## Features

- **Google API Integration**: Automate tasks with Google services such as Calendar, Drive, and more.
- **Slack API Integration**: Connect with Slack to send messages or interact with channels.
- **Notion API Integration**: Organize your workspace, create pages and databases.
- **Drag-and-Drop Workflow Builder**: Easily create and manage automation flows using an intuitive interface.
- **Custom Triggers and Actions**: Set up triggers based on events (e.g., new Google Calendar events) and actions to execute in response (e.g., sending a message in Slack).
- **User-friendly Interface**: No coding skills are needed to create powerful automations.

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

3. Copy URL from ngrok and update Clerk webhook endpoint

4. Make sure integration webhooks have ngrok URL

5. Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.

## DB Migrations

To create and apply new migration, run

```bash
bun db-migrate $migrationName
```

_Note: Migration is disabled, to enable, set the directUrl in Prisma setup_

To push changes without using migrations, run

```bash
bun db-push
```
