# Working studio — second motion draft

The requested revision replaces the single-client monitor preview with Quinn's own
website and gives the entire scene an entrance. This is a local review asset; the
normal website layout and existing static social images are unchanged.

## Sequence

- 0–1.5s: empty blue desk; name and underline reveal; monitor rises into place.
- 0.65–2.3s: “Websites.”, “Business tools.” and “Built for you.” arrive separately.
- 1–3s: editor, keyboard and switches enter; the portfolio homepage appears.
- 2.35–3.5s: supporting service copy reveals.
- 3.35–5.8s: switches turn on while code types and the portfolio grid takes over.
- 4.9–8.1s: the screen scrolls through the captured project grid.
- 7.1–8.4s: battersby.ca and its underline reveal.
- 8.1–10.9s: the screen returns to the opening projects and the composition holds.
- 10.9–12s: the layers leave, returning to the same empty desk for the loop.

The poster uses the completed scene at 9.5 seconds. The first video frame is
intentionally the empty desk, in accordance with the requested build-up.

## Source assets

- `img/social-studio/empty-desk.jpg`: background plate edited from the approved
  `img/social-share-2026-10-15.jpg` using the built-in image-generation tool.
- `img/social-studio/portfolio-intro.jpg`: actual local homepage at 1440 × 900.
- `img/social-studio/portfolio-work.jpg`: actual local Selected work section after
  loading six more entries, captured with all twelve images rendered. Cropped to
  the content panel; no card ordering or website styling was changed for capture.
- `scripts/fonts/Montserrat-*.ttf`: static regular, semibold and bold exports from
  [Google Fonts](https://fonts.googleapis.com/css?family=Montserrat:400,600,700).
  The accompanying `OFL.txt` is from the Google Fonts Montserrat source directory.

The empty-desk edit used this prompt:

> Edit the supplied 1200x630 blue desktop advertising artwork into a CLEAN BACKGROUND PLATE for a motion-design animation. Keep the exact camera angle, the full composition, the deep navy/royal-blue atmospheric wall, the original soft studio lighting and the desk across the lower-right and bottom. Remove ALL typography and ALL objects: the name, headline, description, underline, website address, monitor and stand, code editor floating panel, task panel, plants and pots, books, pen cup, keyboard, mouse and the objects at far right. Reconstruct the unobstructed wall and the empty desk behind everything with natural photographic texture and lighting. The desk should stay exactly where it is in the reference, with its perspective and dark-blue surface. Result: completely empty blue desktop, clean blue wall, absolutely no objects, no panels, no screens, no letters, no text, no logos. No new decorative elements. Preserve the original blue palette and visual mood. Landscape 1200x630 composition. This is an edit target, not merely a style reference.

The monitor, keyboard, editor, switches and text are independently animated canvas
layers. Their timing is reproducible; the AI-generated background does not change
from frame to frame. No client data appears in the illustrative tools panel.

## Local verification

- ffprobe: H.264, yuv420p, 1200 × 630, 30 fps, 12 seconds, no audio; 1,575,575 bytes.
- The MP4 `moov` header precedes its media payload, allowing progressive playback.
- Opening and closing rendered states match; ten sampled storyboard states differ.
- All seven canonical pages have the v2 video metadata and retain their static
  Open Graph and X image fallbacks.
- Chrome at `https://qbattersby.test/social-preview/`: playback advances; replay
  restarts it; finished-frame control pauses at 9.5 seconds.
- At 390 × 844 there is no horizontal overflow. Reduced motion leaves the poster
  paused until the viewer chooses to play. No console warnings or errors appeared.
- Browser emulation settings were reset after verification. No publication or
  third-party message/share test was performed.
