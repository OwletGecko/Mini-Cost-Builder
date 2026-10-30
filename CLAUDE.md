# CLAUDE.md

## Tech Stack

- Plain HTML, CSS and JavaScript only.
- No frameworks and no build step: files open directly in a browser.

## Project Structure

- `index.html`: the single page; one `<section class="lesson">` per slide.
- `styles.css`: the "Handbook" design (EB Garamond + Nunito Sans, forest green and gold) with light and dark theme variables.
- `script.js`: the three tabs, one lesson at a time, check-in questions and the theme toggle.
- `quiz.js`: the 8-question course quiz with score.
- `simulator.js`: the signalling simulator (block working with red, yellow and green signals).
- `images/`: compressed images taken from the slides.
- `README.md`: project readme.
- `CLAUDE.md`: this file.

The slide deck itself is not stored in the repository. Keep this list up to date.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure

One page (`index.html`) with three tabs: **Lesson** (22 lessons built from the slides, shown one at a time), **Quiz** (8 questions with a score) and **Simulator** (signalling simulator). JavaScript switches tabs and lessons; no new pages.

- Each slide becomes one lesson section: heading, short text, key image or diagram.
- Students move with Previous/Next buttons or a "Jump to lesson" menu; the URL hash (`#lesson-3`) links to a lesson.
- Each content lesson ends with a short "Remember" box, then one check-in question (multiple choice or short answer) answered inline. It shows right or wrong, then locks. Next is never blocked.
- Previous/Next cards at the bottom show the neighbouring lesson titles.
- Designed phone-first; audience is 2nd and 3rd year polytechnic students (Train Operation).

### Phases

**Phase 1: Course from the slides**
- Done: built from the Module 0 deck (22 slides, one lesson each), with menu, buttons and light/dark toggle, in plain styling.
- Done: "Handbook" visual design applied. Fonts load from Google Fonts, with Georgia and system fonts as fallback.
- Done: Lesson, Quiz and Simulator tabs.
- Next: the two video slides (not included yet).
- Keep it light for weak Wi-Fi: compressed images, no heavy libraries, system fonts.

**Phase 2: Later (not planned yet)**
- Possible additions, such as a self-check quiz. Decide with the user first.
