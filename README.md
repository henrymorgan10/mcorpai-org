# VitalGuard AI — Infrastructure‑Independent Survival Framework (v4.1.5)


**VitalGuard AI v4.1.5** is a **single‑file, offline‑first** _Infrastructure‑Independent Survival Framework_ built for continuity when power and connectivity are disrupted.

It is deliberately packaged as one self‑contained HTML file so decision‑makers and reviewers can validate the concept quickly—no build system, no external JS libraries, and no hidden uploads.

### Main-screen pillars

1) **Extreme S&R (Avalanche/Landslide)** — Bluetooth beacon proximity + on‑device stability logic to support a **radar‑like life‑locator workflow** when responders are operating off‑grid.
2) **Upcycling E‑Waste (ESG & SDGs)** — repurpose retired / abandoned smartphones into offline relief nodes, aligning with ESG and UN SDG objectives.
3) **Off‑Grid Agriculture & Asset Protection** — practical patterns for livestock and asset safety in rangeland/desert environments with no coverage.
4) **Arabic & Global Ready** — multilingual UI is built in (7 languages), including **Arabic (RTL)** for immediate field deployment.

> Note: This project is a technology demonstration and decision‑support tool. It does not replace certified emergency equipment, medical advice, or formal incident command systems.

A **single‑file, offline‑only** web demo that combines:

- **Bluetooth Low Energy (BLE) proximity** (RSSI from advertisement scanning)
- A tiny **on‑device “micro‑AI” engine** (signal smoothing + stability logic + optional local learning)
- **Emergency/SOS** UX that still works when the network/cloud is unavailable

This repository is intentionally built so that a reviewer can open **one HTML file** and understand what it does — no build system, no external JS libraries, and no hidden telemetry.

**Live / source:** https://github.com/jekymin8232/luckyvicky-homepage  
**Contact:** Morgan J. (Gyumin Jeon) · contact@mcorpai.org · mcorpai.org

---

## Why the UI looks like a “Pet Safety Leash”

To test the offline AI engine and BLE proximity system **in everyday environments**, the prototype is skinned as a **“Pet Safety Leash”** — a universal, non‑sensitive use case.

The **same underlying offline engine** can be re‑skinned for humanitarian and disaster contexts such as:

- evacuation / muster guidance,
- search & rescue assistance,
- field operations in low‑connectivity environments,
- disaster response coordination *without cloud dependencies*.

(Important: this demo uses **BLE proximity**, not GPS.)

---

## What it does (high level)

### 1) Offline BLE proximity tracking (Advertisement RSSI)
- Uses **Web Bluetooth LE Scanning** (`requestLEScan` + `advertisementreceived`) to read RSSI repeatedly.
- Tracks one or many BLE tags with a **registration wizard** (name the tag, save a signature, verify by moving).
- Includes **scan health** monitoring (events/sec + watchdog restart when the scan stalls).

### 2) Decision stability (“AI core”)
BLE RSSI is noisy. VitalGuard focuses on **stable decisions**, not fake precision.

The core engine includes:
- **Kalman filtering** to smooth RSSI and estimate trend/velocity.
- **Hysteresis + anti‑flapping zone logic** so alerts don’t bounce rapidly.
- **Lost detection** when signal is absent for a configured window.

Optional “local learning” modules are included (all on‑device, no cloud):
- **k‑NN Lite** (learns from user feedback samples)
- **IsolationForest Lite** (baseline anomaly scoring from SAFE windows)
- **Q‑learning Lite** (small threshold adjustments from feedback)
- **RLS calibration** (optional calibration of RSSI→distance mapping)

### 3) SOS / Emergency UX (offline)
- **SOS Finder**: a focused UI to assist locating a selected tag.
- **Emergency Mode**: loud siren / strobe / big on‑screen message.
- **Rescue Assist**: share an offline **“Rescue Pack”** so another phone can scan for the same tag.
- **Backups**: export/import local data; **optional encrypted exports** (AES‑GCM) for safe hand‑off.

---

## Privacy & GDPR posture (plain language)

- **No accounts. No cloud sync. No analytics/telemetry.**
- Data is stored **locally on the device** (browser storage).
- Nothing is uploaded unless the user **explicitly exports** a file.

This is designed to be **GDPR‑friendly by architecture** (local‑only).  
*(This README is not legal advice.)*

---

## How to run the demo

1. Download/open `VitalGuard AI_complete_V41_5.html`.
2. Use a **Chromium‑based browser** that supports Web Bluetooth scanning (support varies by platform).
3. For the most reliable behavior, serve the file from:
   - `https://…` or `http://localhost`  
   (some browsers restrict BLE on `file://`).
4. Click **Add Demo Tag** → register a BLE tag → start monitoring.

---

## Limitations (important to understand)

- **BLE RSSI is not a tape measure.** Walls, pockets, bodies, and reflections can distort signal strength.
- Scanning can pause due to OS battery restrictions; the demo includes watchdog recovery, but **background behavior varies** by device.
- This is a **technology demo**, not a certified safety/medical product.

---

## What to look at (for reviewers)

- `BLE` module: scanning lifecycle, filters, scan watchdog, adv/sec metrics
- `Wizard`: tag registration + signature capture
- `Pet` processing: Kalman smoothing, zone stability, alert rules
- `AIPackV4` / `QLearningLite`: optional on‑device learning
- Export/import + optional encryption (“Rescue Pack”)

---

## License & use

This demo is published openly for review and humanitarian innovation.  
It includes an ethical‑use notice: **exclusively for civilian, agricultural, and humanitarian use**.

---

---

## Evidence Pack (template)

Below is a **fill‑in template** you can copy into an email / report after testing.  
Please keep it factual (measured observations, not marketing).

### Evidence table (copy/paste)

| Date (YYYY‑MM‑DD) | Country/City | Environment | Device / OS | Browser | BLE Tag (brand/model/name shown) | Test Mode | Observed Range* | Congestion (adv/sec) | Stall Recovery | Focus Mode Used | Scan Stability | False Alerts | Notes |
|---|---|---|---|---|---|---|---|---:|---|---|---|---|---|
|  |  | Indoor / Outdoor / Mixed |  |  |  | Track All / Focus |  |  | Yes / No | Yes / No | Stable / Intermittent / Stalled | Low / Medium / High |  |
|  |  |  |  |  |  |  |  |  |  |  |

\* *Observed Range*: describe in simple terms (e.g., “works reliably in same room”, “drops behind one concrete wall”, “recovers after ~10s”).  
This demo uses **BLE proximity (RSSI)** — it is **not GPS**.

### Minimum evidence set (recommended)

- **2 environments**: (1) indoor with walls, (2) outdoor open space  
- **2 states**: (1) steady proximity, (2) deliberate separation then return  
- **2 devices** if possible: one low‑end Android + one mid‑range Android  
- **1 BLE‑dense place** (café / station) to observe congestion behavior

---

## Security Review Checklist (for auditors)

This is a practical checklist for embassy / NGO / enterprise review teams.

### Offline / network behavior
- [ ] Open the demo and inspect **DevTools → Network**: confirm no unexpected outbound requests during normal use.
- [ ] Verify the demo remains usable **offline** (airplane mode) for non‑BLE features (help, SOS screen, local data).
- [ ] If using BLE scanning: confirm your platform allows it; behavior differs by OS/browser.

### Dependencies & supply chain
- [ ] Confirm the project is a **single HTML file** with **no external JS libraries** loaded at runtime.
- [ ] Quick check: open the HTML and search for external includes (e.g., `<script src=` or `<link rel=`). It should not load third‑party code.
- [ ] Confirm there is **no build step** required to run the demo.

### Data handling & privacy posture
- [ ] Confirm there are **no accounts** and no cloud sign‑in.
- [ ] Confirm data is stored **locally** (browser storage) and can be removed via the app’s reset controls.
- [ ] Confirm nothing is exported unless the user explicitly uses export/share actions.

### Safety boundaries / ethics
- [ ] Confirm the UI clearly states: **“NOT GPS”** and proximity estimates are approximate.
- [ ] Confirm the demo is presented as a **technology demonstration**, not a certified safety/medical product.
- [ ] Confirm the intended use is **civilian, agricultural, or humanitarian**, and privacy‑first (local‑only; zero data‑retention footprint).

---

## Disaster Demo Scripts (3 scenarios)

These scripts are designed for **non‑technical reviewers**.  
They show what “offline + proximity” can and cannot do.

> **Important:** This demo uses **BLE proximity (RSSI)**, not GPS.  
> It can assist with **local awareness** and **short‑range coordination** when networks are unreliable.

### Scenario 1 — Wildfire evacuation point (asset / team proximity)

**Goal:** demonstrate “muster / asset boundary” alerts without internet.

**Setup**
1. Attach a cheap BLE tag to a **kit item** (first‑aid box, radio, water crate) or a staff badge.
2. In the demo, register the tag (Wizard) and name it “MED KIT” (or “RADIO”).

**Run**
1. Keep the tag near the phone (SAFE).
2. Walk the tag away behind people/vehicles to trigger CAUTION/WARNING.
3. Return the tag to SAFE and observe stabilization (no rapid flapping if configured correctly).

**What to observe**
- Zone changes are **stable** (not bouncing every second).
- “LOST” appears only when signal is truly absent for the configured window.
- The SOS view helps confirm “getting closer / farther” via trend.

**Limitations to note**
- Vehicles, metal, smoke shelters, and crowds can distort RSSI.
- This is proximity awareness — not a map.

---

### Scenario 2 — Earthquake / landslide shelter (family / responder coordination)

**Goal:** show “local regrouping assistance” when cellular networks are down.

**Setup**
1. Tag a backpack or a wristband tag (demo skin is “Pet leash”, but it’s the same engine).
2. Register the tag and name it “FAMILY A” (or “TEAM‑1”).

**Run**
1. In a busy indoor space, move the tag between rooms/corridors.
2. Watch how confidence changes when walls obstruct signal.
3. Use **Focus Mode** (track one tag only) to reduce ambiguity in BLE‑dense areas.

**What to observe**
- The demo surfaces “congestion/ambiguity” instead of silently guessing.
- Focus Mode improves signal attribution when many BLE devices are present.

**Limitations to note**
- Background/lock‑screen behavior depends on OS battery policies.
- “Lost” may occur in thick concrete or underground corridors.

---

### Scenario 3 — Tsunami / flood evacuation (handoff + offline continuity)

**Goal:** show “handoff continuity” with local data, without cloud accounts.

**Setup**
1. Register a tag as “SUPPLY CACHE” (or “CHECKPOINT‑A”).
2. Prepare a short “handoff pack” (export / share mechanism if enabled in your build).

**Run**
1. On Phone A, track the tag and confirm zones.
2. Export/share the configuration to Phone B (offline handoff concept).
3. On Phone B, start scanning and confirm it can detect the same tag.

**What to observe**
- No account login is required.
- The reviewer can see exactly what is stored locally and what is shared.

**Limitations to note**
- Share/handoff is constrained by platform capabilities and local policy.
- BLE range is short; this is for **local** operations.

---

## Reviewer feedback (what’s most useful to send back)

If you evaluate this demo for humanitarian or disaster use, please share:

- device models and OS versions,
- browser name/version,
- BLE tag types and what name appears during registration,
- indoor/outdoor notes,
- whether scanning remains stable after screen lock / background,
- any false alerts or ambiguity frequency.

That feedback helps harden the offline engine for real‑world conditions.



If you are evaluating this for humanitarian or disaster use, please share:
- device models,
- tag types,
- whether you tested indoors/outdoors,
- whether scanning remains stable in the background.

That feedback helps harden the offline engine for real‑world conditions.
