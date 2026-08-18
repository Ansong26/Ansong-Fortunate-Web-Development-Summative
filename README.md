# BSE Specialisation Advisor

An interactive, client-side reflection tool for incoming BSc (Hons) Software Engineering students. It suggests a starting specialisation after an eight-question, timed quiz. The four possible profiles are Low-Level Programming, AR/VR, Full-Stack Web Development, and Machine Learning.

## Live project

- Repository: [Ansong-Fortunate_Summative_Web-Development](https://github.com/Ansong26/Ansong-Fortunate_Summative_Web-Development)
- GitHub Pages:  https://ansong26.github.io/Ansong-Fortunate-Web-Development-Summative/
- Video Link:
- Documentation and Attribution Link: https://docs.google.com/document/d/1uHyOoz9NZIOdhLvxXMKZg8Y-rby6nRBtREYXxNyGIc4/edit?usp=sharing

## Features

- Semantic landing, quiz, results and contact views.
- Real-time inline validation for names, a BSE institutional email, Mauritian phone number, goal and feedback form.
- Eight-question quiz with selectable answer cards, keyboard-friendly controls and a progress indicator.
- Two interactive media types: an original SVG specialisation-map hotspot and a CC0 HTML5 video that pauses at a scripted decision point.
- Two-minute `setInterval()` countdown, automatic timeout locking and partial-answer scoring.
- Multi-category scoring with a transparent consecutive-profile streak bonus and a speed bonus.
- Responsive, animated Canvas 2D radar chart; no external JavaScript libraries.
- Responsive CSS, hover/focus feedback and a reduced-motion alternative.

## Run locally

Open `index.html` in a modern browser. The video scenario requires an internet connection because its CC0 source is hosted by MDN. All other features work without a server.

## File guide

| File | Purpose |
| --- | --- |
| `index.html` | Semantic structure for the four views, forms and Canvas. |
| `styles.css` | Responsive layout, validation states, visual feedback and animation. |
| `script.js` | Validation, quiz state, media listeners, timer, scoring and Canvas rendering. |
| `assets/images/specialisation-map.svg` | Original interactive SVG used by the hotspot question. |
| `Sources-Credits-AI-Transparency.pdf` | Asset credits, technical references and AI-use disclosure. |

## Media attribution

- The video scenario uses MDN Web Docs' CC0 `flower.mp4` media example: https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4
- `assets/images/specialisation-map.svg` is an original illustration created for this project.

## Demonstration checklist

1. Enter an invalid profile value and show the inline error and red state.
2. Correct it and show the green state; submit the profile form.
3. Select an answer, move back/forward, and show progress changing.
4. Use the specialisation-map hotspot with a mouse or keyboard.
5. Play the video to its automatic pause point; select an answer.
6. Explain that the timer uses `setInterval()` and timeout locks/scorers current answers.
7. Submit and explain the profile recommendation, bonuses and animated Canvas chart.
8. Validate the feedback form and explain that it is local because GitHub Pages has no server-side mail service.

## GitHub Pages deployment

1. Push this project so `index.html` is in the repository root.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main`, then `/(root)`, and save.
4. Wait for the deployment banner, open the generated URL, and test every item in the checklist above.
5. Replace the GitHub Pages placeholder in `index.html`, this README and the sources document only after verifying the link.

## Rubric evidence

| Requirement | Evidence in this project |
| --- | --- |
| Visual polish | Responsive grid/flex layouts, hover/focus feedback, entry and state transitions, reduced-motion query. |
| Regex validation | `RULES`, `validateField()` and `.is-valid` / `.is-invalid` in the JavaScript and CSS. |
| Interactive media | `renderMedia()` produces SVG hotspot buttons and timestamp-paused HTML5 video. |
| Timer/scoring | `startTimer()`, `finishByTimeout()` and `calculateScores()`. |
| Canvas | `animateChart()` uses the Canvas 2D API to draw/animate a radar chart. |
| Documentation | Functional HTML/CSS/JS blocks use comments; this README and sources document support the walkthrough. |
