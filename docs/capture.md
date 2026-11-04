# Adding posts

For X posts, pass the link:

```bash
npm run add-post -- https://x.com/someone/status/123 --label bait --reason "Admitted it the next day."
```

It fetches the text and photos, makes up a handle and links the original. Options:

- `--proof <x-link|image>` adds proof shown after the reveal. It can be repeated.
- `--no-source` hides the link to the original.
- `--no-media` imports only the text. Posts with video need it.

## Screenshots for other platforms

1. Open the post in desktop Chrome with DevTools device mode (Ctrl+Shift+M) at 390px wide, in the platform's dark mode if it has one.
2. In the Elements panel, replace the display name and handle with a made-up one, like `@quietlemon42`. Delete the profile picture, like, repost, reply and view counts, and anything else naming a real person. These edits only change your local copy.
3. Select the element that wraps the post (an `<article>` on X), right-click it and choose Capture node screenshot.
4. Import it:

```bash
npm run add-post -- ~/Downloads/post.png \
  --label bait \
  --alt "The post's full text, for screen readers" \
  --reason "One line on why it's bait or genuine" \
  --source https://link-to-the-original
```

The script resizes the image, strips metadata and adds the entry to `src/data/posts.json`.

## Before importing, check

- No real names, handles or profile pictures
- No engagement counts
- Nothing targets a private person (see the rules in [concept.md](./concept.md#content))
