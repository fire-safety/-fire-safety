# Fire Safety PWA — how to run it, publish it, and change it

Five files. That is the whole app.

| File | What it does |
|---|---|
| `index.html` | Everything the user sees: the text, the design, the language switch |
| `manifest.json` | Tells the phone the name and icon, so it can be installed |
| `sw.js` | The service worker — makes it work with no internet |
| `icon-192.png`, `icon-512.png` | The icon on the home screen |

---

## 1. Look at it on your computer

Double-clicking `index.html` opens it, and that is fine for checking text and layout. But the offline part will not work that way — browsers only allow it over a real address.

To test it properly, open Terminal, go to this folder, and run:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Press Ctrl+C in Terminal to stop.

To prove the offline part works: load the page, then open the browser's developer tools (F12), go to the Network tab, tick **Offline**, and reload. Everything should still be there.

---

## 2. Put it on the internet, free

A PWA needs `https://` to be installable. GitHub Pages gives you that for nothing.

1. Make a free account at github.com
2. Click **New repository**. Name it `fire-safety`. Set it to **Public**. Create it.
3. On the repository page click **Add file → Upload files**, drag in all five files, and click **Commit changes**.
4. Go to **Settings → Pages**. Under *Branch*, choose `main` and `/ (root)`. Save.
5. Wait about a minute. Your address appears at the top of that page — something like `https://yourname.github.io/fire-safety/`

That link is the whole product. Send it to students.

---

## 3. Install it on a phone

**Android (Chrome):** open the link, tap the three dots, tap *Install app* or *Add to Home screen*.

**iPhone (Safari only — this does not work in Chrome on iOS):** open the link, tap the share button, tap *Add to Home Screen*.

After that it opens like an app, with no browser bars, and works with no signal.

Tell students to open it once while on wifi. That first visit is what saves it to the phone.

---

## 4. Change the text

Open `index.html` in any text editor. Near the middle you will find:

```
const CONTENT = {
```

Everything the app says is below that line, grouped by language (`en`, `ru`, `fa`). Change the words between the quote marks and nothing else. Keep every comma and bracket where it is.

**To add a section:** copy one whole block that looks like

```
{ title: "...", html: `...` },
```

paste it after another one, and change the words.

**To add a language:** copy an entire language block, change the two-letter code at the top of it, translate the text, and add one more line to the language menu near the top of the file:

```
<option value="ar">العربية</option>
```

---

## 5. Add the floor plans

Put the image files in the same folder. Then, inside the "Your building" section, add:

```
<img src="floor-2.jpg" alt="Evacuation plan, floor 2" style="width:100%;border-radius:10px">
```

**Then add the filename to the `FILES` list in `sw.js`**, or it will not be saved for offline use.

---

## 6. The one rule people forget

Every time you change any file, open `sw.js` and change the version number:

```
const VERSION = 'fire-safety-v1';   ->   'fire-safety-v2'
```

That number is how phones know a new version exists. If you do not change it, people keep seeing the old version and you will think your edits did not save.

---

## The questionnaires

The two green buttons under the emergency numbers open the questionnaires.
Each one sends its answers straight into its own Google Form — no one has
to open the Form itself. The questions show in whichever language is
selected; the answers are always saved in English.

| Button | Google Form | What it asks |
|---|---|---|
| 📝 Level 1 | "Fire Safety Questionnaire — Level 1" | code, year, languages, 8 knowledge questions, 4 readiness questions |
| 🔥 Level 2 | "Fire Safety Quest — Level 2 (October 2026)" | code · how useful each part of the site was (6 parts, 1–5 or "Didn't use") · 2 real-life tasks · the evacuation drill in the main building |

The first version of Level 2 ("Fire Safety Quest — Level 2", with its 17
answers from September) was left untouched; nothing new is sent there.

**"TEST — Fire Safety Quest Level 2 (simulated data)"** is a practice copy
filled with 100 made-up answers (their language says "Simulated"), to see
how the results and charts look. The website never sends real answers
there — use it only for practice, never as study data.

**Level 2, in detail**

- *Mission 1* rates: In a fire · First aid · What to say when you call 112 ·
  Floor plans · Evacuation videos · Breathing exercise.
- *Mission 2* has two "tick every right action" tasks. Right answers:
  - Task 1 (night alarm): leave right away · stay low, go to the stairs and
    close doors · go to the assembly point and stay.
  - Task 2 (burn + smoke): cool water for 20 minutes · take off rings and
    watch · call 112 / 103.
  Every option is worth one point (ticked if right, left empty if wrong),
  so the score is out of 12. The website also writes that score into the
  form ("Task score") together with the language the student used.
- *Mission 3* asks whether the student was at the drill; only those who
  say yes are asked whether the website helped, and what helped or was
  missing.
- After submitting, students see their score, a rank, and for every
  mistake the reason and a link to the card that explains it.

**How the website talks to the forms**

Each question in `SURVEY_L1` / `SURVEY_L2` (inside `index.html`) carries
the same `entry.xxxxxxx` number as the matching question in the Google
Form, and every option's `value` is copied exactly from the form. **If
you add, remove or retype questions or options in a Google Form, those
numbers or values no longer match** and those answers are lost. Get the
new numbers from the form (⋮ menu → "Get pre-filled link" → answer
everything → copy the link) and update the survey to match. Editing a
question's wording only, with the same options, is safe.

Keep every question in the Google Forms **not required** — the website
checks that the student answered, and a required question the website
skips (for example the drill follow-ups) would make Google throw the
whole answer away.

**Nothing gets lost**

- Answers in progress are kept on the phone. If a student closes the
  page halfway, they continue where they stopped (or tap "Start over").
- Finished answers wait in an "outbox" on the phone until they have been
  sent. With no internet the student is told so, and the answers go by
  themselves when the phone is back online.
- The secret code is tidied (`el 7` → `EL07`, Persian digits → 0–9) and
  checked (2 letters + a day from 01 to 31). Once a student has entered
  it, it is filled in for them next time on the same phone.

**Test it once after any change**: submit through the real deployed link,
then open the form's Responses tab and check that the answer arrived in
the right questions. Then delete that test response. Google does not let
the page read its reply, so the website cannot check this for you.

## First aid

Below the fire guide there is a **First aid** section with seven topics:
burns, smoke and toxic fumes, unresponsive but breathing (recovery
position), CPR, chemical burns and eyes, electric shock, and heavy
bleeding. Each topic has a moving picture, short steps with the reason
for each step, a red "never" box and a yellow "call if / danger signs" box.

- **The words** are in `CONTENT`, like the rest of the guide: look for
  `aid: [` in each language (`en`, `ru`, `fa`). Each topic has an `id`,
  a `title`, a one-line `tag` and the `html`.
- **The pictures** are in `AID_ART` further down `index.html`, one per
  topic `id`. They are drawings written as SVG and moved with CSS, so they
  are tiny, sharp on every screen and work offline. Phones set to "reduce
  motion" show them still.
- **The icons** in the list are in `AID_ICONS`, with the same `id`s.

To add a topic, add it to `aid: [` in every language, then add a picture
and an icon under the same `id` (a topic without a picture still works).

The medical content follows: the Russian Ministry of Health order on first
aid (Приказ Минздрава России № 220н от 03.05.2024 «Об утверждении Порядка
оказания первой помощи»), the 2025 guidelines of the European
Resuscitation Council and Resuscitation Council UK, and NHS advice.

## The tools

- **Cooling timer** (in Burns): counts 20 minutes, keeps the screen on,
  and rings at the end. It keeps counting if the window is closed; the
  button in the Burns card shows the time left.
- **CPR rhythm coach** (in CPR): beeps 110 times a minute (the middle of
  100–120), with a 30 : 2 count for people trained in rescue breaths, and
  a reminder to swap every 2 minutes.
- **What to say when you call** (the dashed button under the phone
  numbers): the student taps what happened and where they are, and gets
  the Russian sentence to say, with Latin letters under it. It can read
  the sentence aloud with the phone's own Russian voice, or show it in big
  letters to hand to a Russian speaker. The address is remembered on that
  phone only. The Russian pieces are in `SAY_RU`, the dormitory house
  numbers (ulitsa Akademika Volgina 35, 37, 39, 41) in `SAY_DORMS`.
- **Install card**: on phones that can install the app, a small card
  offers to install it (on iPhone it explains Share → Add to Home Screen).
  It can be hidden with ✕.
- **Am I ready? checklist** (under the quick links): ten things every
  student should have done, each with a button that opens the part of
  the guide that helps. Ticks stay on that phone only. Some tick
  themselves: saving the numbers to contacts, opening "What to say",
  playing all three videos, installing the app. The items are in
  `READY_ITEMS`.
- **Save to contacts** (in the checklist): downloads one contact card
  with 112, 101, 103 and the RNIMU duty dispatcher, labelled in the
  chosen language.
- **Share this guide** (above the footer): the phone's share menu, a QR
  code a friend can scan straight from the screen, or copy the link.
- **"New version ready"**: when a phone has saved a newer version of the
  guide, a small bar offers to reload, so nobody keeps an old copy.

All of them work with no internet.

## Links to one topic (for QR codes)

Every card has its own address, so a poster can point straight at it.
Opening the link opens that card:

| Link ends with | Opens |
|---|---|
| `#first-aid` | the First aid section |
| `#aid-burns`, `#aid-smoke`, `#aid-recovery`, `#aid-cpr`, `#aid-chemical`, `#aid-electric`, `#aid-bleeding` | one first aid topic |
| `#guide` | the fire guide |
| `#fire-alarm`, `#fire-see`, `#fire-smoke`, `#fire-trapped`, `#fire-clothing`, `#fire-extinguisher`, `#fire-banned` | one fire guide card, in order |
| `#say` | the "what to say when you call" helper |
| `#plans`, `#videos`, `#breathe`, `#share` | those sections |
| `#ready` | the "Am I ready?" checklist, opened |

For example: `https://fire-safety.github.io/-fire-safety/#aid-burns`

## Before students use this

The safety text here follows RNIMU's own published instructions, but it has not been checked by anyone at the university. Take it to the fire safety department and ask them to review it. Their approval is what turns this from a student project into something the university can hand out.

The first aid section should also be read by a first aid instructor or a doctor from the university before it is handed out, for the same reason.

The floor plans must match the official plans posted on the walls, exactly.
