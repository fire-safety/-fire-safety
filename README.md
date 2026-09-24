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

## The quiz

The green button above the guide opens a 21-question quiz built into
the app. It shows questions in whichever language is selected, scores
the 8 knowledge questions itself, and sends every answer straight to
your Google Form's spreadsheet — no one has to open the Form itself.

This works because each question in `SURVEY` (inside `index.html`)
carries the same `entry.xxxxxxx` number as the matching question in
your actual Google Form. **If you ever add, remove, or reorder
questions in the Google Form itself, those numbers change**, and
you'd need a fresh pre-filled link (⋮ menu on the form → "Get
pre-filled link" → answer everything → copy the link) to find the new
ones and update `SURVEY` to match. Editing wording only, with the same
questions in the same order, is safe and needs no changes here.

**Test it once before handing this to students**: submit the quiz
yourself through the real deployed link, then open your Google
Sheet and confirm a new row appeared with the right answers in the
right columns. The app can't confirm this for you — it can't read
Google's reply, so it always shows "thank you" whether or not the
submission actually landed.

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
| `#plans`, `#videos`, `#breathe` | those sections |

For example: `https://fire-safety.github.io/-fire-safety/#aid-burns`

## Before students use this

The safety text here follows RNIMU's own published instructions, but it has not been checked by anyone at the university. Take it to the fire safety department and ask them to review it. Their approval is what turns this from a student project into something the university can hand out.

The first aid section should also be read by a first aid instructor or a doctor from the university before it is handed out, for the same reason.

The floor plans must match the official plans posted on the walls, exactly.
