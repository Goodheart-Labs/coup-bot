# Coup-bot Project

## Purpose

A chatbot that discusses historical events related to January 6th, 2021, using sourced information.

## Architecture

- Next.js application with API routes
- Uses Claude 3.5 Sonnet (20241022) via Anthropic API for chat responses
- React frontend with real-time chat interface

## Key Components

- `/app/api/chat/route.ts`: API endpoint for chat interactions
- `/app/page.tsx`: Main chat interface
- `/app/api/chat/constants.ts`: System prompt and configuration

## Development Guidelines

- Keep responses concise and focused
- Include source links for claims
- Maintain conversational tone
- Handle errors gracefully

## Project Tools

- `scratch.md`: Used for storing long content that might break manicode. Ignored by version control.

## Prompt

- The prompt, which is extremely long and generally doesn't contain useful coding information, is in `/app/api/chat/constants.ts`
