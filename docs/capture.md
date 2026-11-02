# Capturing posts

Every post is a screenshot taken in Chrome DevTools at phone width, with real names and counts removed, then imported with `npm run add-post`. Doing it the same way each time keeps posts looking consistent in the game.

## 1. Open the post at phone width

1. Open the post in desktop Chrome.
2. Open DevTools (F12) and turn on device mode (Ctrl+Shift+M).
3. Pick a 390px wide phone, like iPhone 12 Pro, and reload so the site switches to its mobile layout.
4. Use the platform's dark mode if it has one, so posts match the game.

## 2. Remove what identifies people

In the Elements panel:

- Double-click the display name and handle text and replace it with a made-up one, like `@quietlemon42`.
- Select the profile picture and press Delete to remove it.
- Delete like, repost, reply and view counts. The game hides engagement on purpose.
- Delete anything else that names a real person, like "Replying to @..." lines.

These edits only change your local copy of the page. Reload to undo them.

## 3. Capture the post

1. In the Elements panel, select the element that wraps the whole post. On X it's an `<article>`. Hover elements until the highlight covers exactly the post.
2. Right-click it and choose Capture node screenshot. Chrome saves a PNG to Downloads.

## 4. Import it

```bash
npm run add-post -- ~/Downloads/post.png \
  --label bait \
  --alt "The post's text, copied as is" \
  --reason "One line on why it's bait or genuine" \
  --source https://link-to-the-original \
  --proof ~/Downloads/proof.png
```

`--source` and `--proof` are optional. Capture proof screenshots the same way as posts, including removing names.

`--alt` is what screen readers read out, so paste the post's full text.

The script resizes the image, strips metadata and adds the entry to `src/data/posts.json`. Check the post in `npm run dev` afterwards.

## Before importing, check

- No real names, handles or profile pictures
- No engagement counts
- Text is readable at phone size
- Nothing targets a private person (see the rules in [concept.md](./concept.md#content))
