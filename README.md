# CarpeMadrid Spanish Level Assessment

A browser-based, mobile-friendly Spanish assessment game for Carpe Diem Madrid. The verified application in this repository is the **B1/B2** game, `index.html`.

## What the game does

- Presents 36 multiple-choice questions, randomly drawn from a bank of 72 across nine everyday Madrid scenarios (café, metro, flat, friends, work, doctor, pharmacy, school and police).
- Calculates B1 and B2 percentage scores, an indicative level and gamified XP.
- Displays a short end-of-game report and collects optional qualitative feedback plus a 1–10 recommendation score.
- Lets the learner **manually** share the report and feedback with Virginia by email (`info@carpemadrid.com`), WhatsApp or the device share sheet.
- Includes a results-preview mode: append `?preview=results` to the page URL. **Preview data is fictional and is not a submitted result.**

## Where results are stored (important)

**There is currently no automatic persistent storage or central results register in the inspected B1/B2 code.**

The score and responses are held in JavaScript variables in the student's open browser page. The final report is assembled as text in `window.summary`. The code does not write to a database, Google Sheet, GitHub, localStorage or a server API.

The **Email results** button opens the student's email application with a prefilled message addressed to `info@carpemadrid.com`; the student must press **Send**. The **WhatsApp** button opens a share flow; the student must choose Virginia and send the message. Neither action confirms delivery to the game. The generic **Share my report** button uses the device share sheet or clipboard. Closing or refreshing the page loses the in-memory result.

Consequently, Virginia can only retrieve results that students actually send to her. GitHub hosts source code, **not student assessment submissions**.

## Limitations

- Indicative comprehension/grammar/vocabulary sampling, **not** an official or validated CEFR placement test.
- Does not assess speaking, listening or writing.
- No student identity capture, automatic submission, completion log, delivery confirmation or results dashboard.
- The XP number includes streak bonuses; it is not a percentage score.
- This README documents the verified B1/B2 `index.html` implementation. A separate B2/C1 game was discussed, but its implementation and storage behaviour have **not** been verified here.

## Recommended next step: central results collection

With Carpe Madrid's agreement, implement a consent-based submission flow to a protected endpoint (for example, a Google Apps Script web app writing to a restricted Google Sheet). Capture assessment version, timestamp, student identifier/contact details if needed, B1/B2 category percentages, indicative level, recommendation score and comments. Show a clear success/error message after submission, prevent duplicate entries and apply appropriate GDPR privacy notice, access control and retention rules. **Do not put private API credentials in this public repository or publish student data to GitHub.**

Until such a workflow is implemented and tested, tell students explicitly that they must send the report themselves.


## Google Sheets collection setup (prepared, not yet live)

A restricted results workbook has been created in the CarpeMadrid Google Drive folder:
https://docs.google.com/spreadsheets/d/1iw0iIDSsbS22cfnzKh18e-yZgCCrT9h5NInZpBQOVas/edit

The `Submissions` tab has columns for both assessment versions, learner identity, scores, NPS, comments, consent and duplicate-submission ID.

The server-side Google Apps Script source is at `google-apps-script/Code.gs`. It has **not been deployed**, and the existing game still uses manual email/WhatsApp sharing. Do not tell students that results are automatically recorded yet.

### To activate

1. In the Google account authorised to edit the results workbook, open **Extensions > Apps Script**.
2. Paste the contents of `google-apps-script/Code.gs` into `Code.gs` and save.
3. Deploy as a Web App, executing as the owner. Review carefully who can access the endpoint, because a public endpoint can receive unsolicited submissions. Configure access controls, anti-spam protection and GDPR privacy/retention policy before using real learner information.
4. Copy the deployment URL into the game frontend integration (still to be completed). Implement a learner name/email and consent form, send a JSON payload and display confirmed success or actionable failure. Test using a dummy learner and verify the corresponding Sheet row before launching.
5. Locate the separate B2/C1 game's source and integrate/test it independently.

**Note:** Cross-origin browser requests to Apps Script require careful testing. A JSON response from `ContentService` is not automatically accessible via CORS from every static hosting origin. Do not assume that deployment alone makes browser submission work.
