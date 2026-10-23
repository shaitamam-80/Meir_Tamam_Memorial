# Memorial release readiness — updated 23 October 2026

The family authorized publishing and merging the current version on 23 October 2026. Photo choices will be revised afterwards according to their instructions. The film remains a visual draft pending the family's soundtrack.

## Prepared locally

- 42 selected photographs in five albums, with separate 480px thumbnails.
- Real photographs on the home and story pages; original source files are untouched.
- A five-minute, 1280×720 H.264 visual film draft: 36 unique photos and four video excerpts. No audio track has been added; the family will provide the soundtrack.
- Native film controls, no autoplay or preload, and an explicit download link for offline viewing.
- Keyboard-accessible photo dialog with focus restoration, RTL arrow navigation and swipe support.
- The original memorial letter is unchanged; its author appears before the text.
- Eight grandchildren during Meir's lifetime; the ninth granddaughter was born afterwards, as confirmed by the family.
- Shell-only PWA precaching; viewed images use a bounded cache. The film is not precached.
- Sharing metadata and a real family share image. Portable Windows-compatible build.

## Validation completed

- `npm run lint` and `npm run build` pass.
- Built and checked both the GitHub Pages base and the Vercel root base.
- Verified canonical and share-image URLs with a configured URL containing a pathname.
- All 84 full-image/thumbnail references exist; each WebP is below 300 KB.
- Browser checks at 390×844 and 1365×900: no horizontal overflow, hero image loads, film plays and reports 300 seconds.
- Verified album direct-route reload, all six wedding photos, next-image keyboard navigation, Tab/Shift+Tab wrapping, Escape and return of focus to the originating thumbnail.
- Simulated an unavailable film file: the friendly error message appears. Restored the file afterwards.
- Inspected 13 film frames spanning the introduction, chapters, all four video excerpts and the closing title.
- Read-only TypeScript review findings were addressed: URL pathname preservation and source-element media errors.

## Remaining family review and plaque preparation

1. Family review of the photo choices, captions and four video excerpts. Captions describe scenes without guessing unidentified relatives.
2. Receive the chosen soundtrack and make the final edit. Original video audio has not been reviewed for inclusion.
3. Export the final ceremony file from the original media at the required projection resolution, and test playback on the actual equipment.
4. Verify the merged release on the public Vercel address. Publication and merge of this version are authorized; the permanent domain is still pending.
5. Connect the family's permanent domain. Set `VITE_PUBLIC_SITE_URL` to its full HTTPS address and rebuild so sharing metadata uses the permanent address.
6. Generate the final QR only after the permanent address is live, then test the supplier's physical proof using multiple phones before producing the metal plaque.

## Local review

The branch is `codex/memorial-ready-2026`. To preview a Vercel build locally in PowerShell:

```powershell
$env:VERCEL = '1'
npm run build
npm run preview -- --host 127.0.0.1 --port 4179 --strictPort
```

The visual draft lives at `public/media/memorial-film.mp4`. Family source-path manifests and intermediate media processing remain outside the repository.
