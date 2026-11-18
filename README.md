# SainsLab XR

An XR science lab for Malaysian secondary (SPM, Form 4–5) students. This is the high-fidelity alpha prototype built for **ITS63504 Human Computer Interaction – Extended Reality (XR)**.

**Live prototype:** https://jovan104.github.io/SainsLab-XR/ (open on a phone or a laptop, and turn the sound on)

## What it does

Ten interactive 3D models, grouped by subject:

| Subject | Models |
|---|---|
| Biology | Human heart, Photosynthesis (pondweed experiment) |
| Chemistry | Electrolysis of copper(II) sulphate |
| Physics | Electric (d.c.) motor, Solar system and Kepler's laws, Car engine (heat and gas laws) |
| Engineering (extension) | Motorcycle engine, Jet engine, Boat outboard, Bullet train traction |

Each model has six tabs: **Notes** (textbook-style theory with EN/BM key terms), **Explore** (3D/AR with labels, cutaway, X-ray, exploded view), **Simulate** (live particles, gauges, graphs and sound), **Lab** (VR practical: build apparatus or dissect), **Investigate** (evidence-based inquiry) and **Quiz** (quest).

Also included:

- **Live MR class**: the teacher's voice, a synchronised 3D model, English and BM captions, a live poll and raise-hand questions
- **Quests**: XP, ranks and badges
- **Study planner**: week view, adjustable sessions, weekly goal and auto-plan
- **Progress passport and preferences**: accessibility, sound and privacy settings
- **Two layouts**: phone and laptop/PC, chosen at sign-in

## The five XR features (assignment Q1)

1. AR model explorer
2. Live science simulation
3. VR science lab
4. Virtual investigation
5. Live MR class

## Repository layout

```
index.html        built, self-contained prototype (served by GitHub Pages)
src/              source: core, 3D viewer, models (src/engines), features, notes, planner, live class
vendor/           three.js r147 + OrbitControls (MIT) and the Archivo font (OFL)
build.py          bundles src/ + vendor/ into index.html
docs/             report (.docx), architecture and data-flow diagrams
```

## Build

```
python3 build.py
```

This writes `index.html`. No other dependencies are needed.

## Notes

- AR placement uses WebXR where the device supports it (Chrome on Android, or a headset). Elsewhere the app shows a 3D preview.
- The live class is scripted (Wizard of Oz). The teacher's voice uses the browser's speech synthesis.
- Third-party licences: `vendor/THREE-LICENSE` and `vendor/ARCHIVO-OFL.txt`.
