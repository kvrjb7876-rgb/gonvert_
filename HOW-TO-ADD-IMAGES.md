# How to add photos to the website

You do **not** need to touch any code. Every photo on the site is just a file
sitting in a folder. Put your photo in the right folder, give it the right
name, and it shows up on the website.

## The rule

> **Find the file you want to replace → rename your photo to *exactly* that
> name → drop it in, replacing the old one.**

That's it. Three things must match: the **folder**, the **file name**, and the
**`.jpg` ending**.

## How to know which file is which

Every placeholder currently on the site has its **own file path printed on it**.
Open any page, look at the grey image, and you'll see something like:

```
/pharma/assets/images/services/cleanroom-hvac.jpg          1600 x 900
```

That is the exact file to replace, and the size the photo should be.

## The full list

### GONVERT Pharma Technology

| Where it shows on the site | File to replace | Best size |
| --- | --- | --- |
| Home page, big panel on the right | `pharma/assets/images/hero.jpg` | 1200 × 1500 (tall) |
| Overview page, square panel | `pharma/assets/images/overview.jpg` | 1200 × 1200 (square) |
| Cleanroom & HVAC Systems page | `pharma/assets/images/services/cleanroom-hvac.jpg` | 1600 × 900 (wide) |
| Commissioning & Qualification page | `pharma/assets/images/services/commissioning-qualification.jpg` | 1600 × 900 |
| Conceptual & Basic Design page | `pharma/assets/images/services/conceptual-basic-design.jpg` | 1600 × 900 |
| Detailed Engineering page | `pharma/assets/images/services/detailed-engineering.jpg` | 1600 × 900 |
| GMP Compliance & Validation page | `pharma/assets/images/services/gmp-compliance-validation.jpg` | 1600 × 900 |
| Process & Clean Utilities page | `pharma/assets/images/services/process-clean-utilities.jpg` | 1600 × 900 |

### GONVERT Renewable Energy

| Where it shows on the site | File to replace | Best size |
| --- | --- | --- |
| Home page, big panel on the right | `energy/assets/images/hero.jpg` | 1200 × 1500 (tall) |
| Overview page, square panel | `energy/assets/images/overview.jpg` | 1200 × 1200 (square) |
| Project Development page | `energy/assets/images/services/project-development.jpg` | 1600 × 900 (wide) |
| Engineering & Design page | `energy/assets/images/services/engineering-design.jpg` | 1600 × 900 |
| Procurement page | `energy/assets/images/services/procurement.jpg` | 1600 × 900 |
| EPCM Delivery page | `energy/assets/images/services/epcm.jpg` | 1600 × 900 |
| Commercial Structuring page | `energy/assets/images/services/commercial-structuring.jpg` | 1600 × 900 |

### Main GONVERT landing page

The front page uses a short background video, not a photo:

- Video: `assets/video/hero-ambient.mp4`
- Still image shown while the video loads: `assets/video/hero-ambient.jpg`

Replace either the same way.

## Rules for the photos themselves

1. **Save as JPG.** The file must end in `.jpg`. If your photo is a PNG or HEIC,
   open it and "Export as JPEG" first — simply renaming a `.png` to `.jpg` can
   cause problems.
2. **Match the shape.** The sizes in the table are the shape the slot expects.
   A photo of a different shape still works, but the sides or the top and bottom
   get cropped off to fit.
3. **Keep files under about 500 KB.** Large photos make the site slow. On a Mac,
   open the photo in Preview → Tools → Adjust Size, or use
   [squoosh.app](https://squoosh.app) in a browser.
4. **Keep the exact file name**, including lower-case letters and the hyphens.
   `Cleanroom-HVAC.jpg` and `cleanroom_hvac.jpg` will **not** work —
   it must be `cleanroom-hvac.jpg`.

## Putting the change live

After replacing the files, the change has to be published:

```sh
vercel --prod
```

(Or, if the site is connected to GitHub, commit and push — it publishes itself.)

## If something goes wrong

- **The old placeholder is still showing.** Your browser is remembering the old
  picture. Hard-refresh with **Cmd + Shift + R**.
- **The image area is now blank/grey with no picture.** The file name doesn't
  match. Check the spelling and that it ends in `.jpg`. The site is built so a
  wrong name never shows a broken-image icon — it just falls back to the plain
  panel — so this is safe, not broken.
- **The photo looks cropped oddly.** Its shape doesn't match the slot. Crop it
  to the size in the table first.

## Adding a brand-new image somewhere else

That one does need a small code change — ask, and it takes a minute.
