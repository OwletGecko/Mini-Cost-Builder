# CLAUDE.md

## Tech Stack

- Plain HTML, CSS and JavaScript only.
- No frameworks and no build step: files open directly in a browser.

## Project Structure

The repository is nearly empty for now.

- `README.md`: project readme.
- `CLAUDE.md`: this file.

Add new files here as the project grows and keep this list up to date.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure

One long scrolling page (`index.html`), built from 3-5 slides.

- Each slide becomes one lesson section: heading, short text, key image or diagram.
- Each lesson ends with a short "Remember" box (steps or checklist), since the goal is recall.
- A sticky mini menu or progress bar lets students jump between lessons.
- Students scroll down the page, or tap a menu item to jump to a lesson.
- Designed phone-first; audience is 2nd and 3rd year polytechnic students (Train Operation).

### Phases

**Phase 1: Course from the slides**
- Get the slides (PDF or PowerPoint) from the user. Do not start without them.
- Outline each slide's heading, key points and images; show the outline before building.
- Build the scrolling page, lesson sections, "Remember" boxes, menu and light/dark toggle.
- Keep it light for weak Wi-Fi: compressed images, no heavy libraries, system fonts.
- Review with the user and fix what they flag.

**Phase 2: Later (not planned yet)**
- Possible additions, such as a self-check quiz. Decide with the user first.
