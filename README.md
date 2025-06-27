# Automation Builder

A web application built using [Next 14](https://nextjs.org/), designed to automate repetitive tasks with integrations to services like Google, Slack, and Notion. Featuring an intuitive drag-and-drop interface, it allows for the creation of complex, multi-step workflows without the need to write any code.

## Features

- **Seamless Integrations**: Provides native connections to a variety of services, including:
  - Google: Automate tasks with Google services such as Calendar, Drive, and more.
  - Slack: Send messages, and interact with channels.
  - Notion: Create pages, update databases, and more.
  - ...and more to come!
- **No-Code, Drag-and-Drop Builder**: A visual canvas where users can create and manage their workflows. Components are dragged onto the canvas and connected to build the automation logic.
- **Multi-Step Workflows**: Supports the creation of sophisticated, sequential, and conditional workflows to handle complex processes beyond simple "if this, then that" logic.
- **Powerful Scheduling**: Workflows can be run on a schedule. Triggers can be set to run every minute, hour, day, or on specific dates.

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

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## DB Migrations

To create and apply new migration, run

```bash
bun db-migrate $migrationName
```

To push changes without using migrations, run

```bash
bun db-push
```
