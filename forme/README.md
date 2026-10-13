# FORME Architecture

## Scroll motion

The hero video expands with native scrolling from its original frame to the full viewport, holds briefly using sticky positioning, and releases into the next section. Scrolling upward reverses the expansion. Reduced motion retains the original still and normal document flow. The video asset is unchanged.

The hero heading arrives in 620ms and its image follows at 160ms, completing within 810ms. A reserved header space prevents layout jumps as the fixed navigation becomes compact and translucent beyond the hero. Desktop project hover and keyboard focus gently brighten imagery and shift titles 4px, leaving project numbers stationary. The hero caption fades in once when playback starts, with an autoplay/loading fallback. All added animation respects reduced motion.

Sections reveal once with 20px travel and 720ms easing. Heading lines are staggered by 85ms, with supporting content following gently. Desktop project images drift through 5% of their frame height, and a fixed 2px yellow line shows reading progress. Native project disclosures open and close with interruptible 360ms height animation. Keyboard focus exposes content immediately. Reduced motion disables reveals, parallax, and disclosure animation; mobile layouts omit parallax. No scroll interception is used.

Single-page fictional architecture studio website. Static HTML, CSS, and JavaScript; no dependencies or build required.

## Preview

Run `python3 -m http.server 4187 --directory dist` from this directory.

## Design

Based on the supplied AlterG design system: grayscale primary, secondary, and neutral scales; yellow accent scale; provided typography, spacing, radii, and shadow tokens. Generous whitespace, oversized headings, asymmetric project placement, and restrained reveal transitions. Motion respects the system reduced-motion preference.

Sequel Sans and Inter are declared in the font stacks. No font files were supplied; Arial is the available fallback. Add licensed Sequel Sans files and Inter assets with @font-face to reproduce the original font faces exactly.

## Content and functionality

FORME and all projects are fictional. The three architectural images were generated for this example. Project summaries expand inline. The enquiry form validates required fields and email formatting, then generates a downloadable text brief. It does not submit, store, or transmit enquiries. Connect a real enquiry service before use by an actual practice.

## Checks

JavaScript syntax checked; local HTTP response successful; all four image placements loaded; project disclosure expanded; form completed and its result verified via keyboard submission; 390px mobile viewport checked without horizontal overflow.

## Hero video

The silent 10-second hero animation was generated with Higgsfield (Kling 2.6) from the unchanged courtyard.png first-frame reference. The compressed H.264 MP4 is 1536×1024 with fast-start metadata, muted looping playback, and a text-only play/pause control. The original still remains beneath the video as the loading/error fallback and is shown without video loading when reduced motion is enabled. The project gallery still uses the original image.

Higgsfield job: c670b397-1e04-4be9-b575-a9d54d9e1f5e.
Original image SHA-256: c0a772d7e7633115a404e6cb7207cbf4b3a6d08be75dc78065e83902400edbaf.
