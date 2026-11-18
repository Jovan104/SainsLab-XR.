# SainsLab VR

A virtual reality science lab for Taylor's Foundation in Science students. This is the high-fidelity alpha prototype built for **ITS69004 Human Computer Interaction (WBL) – Case study on Virtual Reality (VR)**.

**Live prototype:** https://jovan104.github.io/SainsLab-XR./ (open on a phone, a laptop or a VR headset browser, and turn the sound on)

## What it does

Ten interactive 3D models, grouped by subject:

| Subject | Models |
|---|---|
| Biology | Human heart, Photosynthesis (pondweed experiment) |
| Chemistry | Electrolysis of copper(II) sulphate |
| Physics | Electric (d.c.) motor, Solar system and Kepler's laws, Car engine (heat and gas laws) |
| Engineering (extension) | Motorcycle engine, Jet engine, Boat outboard, Bullet train traction |

Each model has six tabs: **Notes**, **Explore**, **Simulate**, **Lab**, **Investigate** and **Quiz**.

## The five VR features (assignment Q1)

1. **VR model explorer**: step inside the model; phone VR in a Cardboard viewer (split-screen stereo, head tracking, gaze to select) or a WebXR headset
2. **Live VR simulation**: change one variable and watch the process respond, with sound
3. **VR practical lab**: dissect or set up apparatus step by step
4. **VR investigation**: run tests, collect evidence, choose the cause
5. **Shared VR classroom**: classmates as avatars around one model, the lecturer's laser pointer, polls, raise hand, English and BM captions

Also included: notes, a study planner, quests (XP, ranks, badges), a progress passport and preferences (including VR comfort mode).

## Repository layout

```
index.html        built, self-contained prototype (served by GitHub Pages)
src/              source: core, 3D/VR viewer, models (src/engines), features, notes, planner, VR class
vendor/           three.js r147 + OrbitControls (MIT) and the Archivo font (OFL)
build.py          bundles src/ + vendor/ into index.html
docs/             report (.docx) and diagrams
```

## Build

```
python3 build.py
```

This writes `index.html`. No other dependencies are needed.

## Notes

- Headset VR uses the WebXR Device API (Meta Quest Browser, or Chrome/Edge with a PC headset). It has not yet been tried on physical hardware.
- The VR class is scripted (Wizard of Oz) and the classmates are simulated avatars. The lecturer's voice uses the browser's speech synthesis.
- Third-party licences: `vendor/THREE-LICENSE` and `vendor/ARCHIVO-OFL.txt`.
