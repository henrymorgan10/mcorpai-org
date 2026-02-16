# VitalGuard AI — Infrastructure‑Independent Survival Framework (v4.1.6)

**Audience:** diplomats, government/agency reviewers, enterprise security/compliance teams  
**Format:** single‑file HTML demo (offline‑first; no build system; no external JS libraries)

VitalGuard AI is a **single‑file, offline‑first** “Infrastructure‑Independent Survival Framework” designed to keep **critical, local decision support** available when **power and connectivity are disrupted**.

It is intentionally packaged as **one self‑contained HTML file** so decision‑makers and auditors can validate the concept quickly—**no build tools, no external libraries, and no hidden uploads/telemetry**.

---

## Executive brief (60 seconds)

**What it is**
- A **local‑only** web demo that uses **Bluetooth Low Energy (BLE) proximity (RSSI)** plus **on‑device stability logic** to support **short‑range coordination** when networks are unreliable.

**What it’s for**
- Demonstrating “**offline continuity**” patterns for disaster response / field operations:
  - proximity‑based mustering / asset boundary alerts,
  - search & rescue assistance workflows (short‑range),
  - offline hand‑off continuity between devices.

**What it is NOT**
- **Not GPS** (no map, no geolocation), and **not certified emergency/medical equipment**.
- Not a cloud product (no accounts, no remote control, no analytics).

**Decision question this demo answers**
- “Can we evaluate an offline‑first proximity/stability workflow without introducing cloud risk or supply‑chain dependencies?”

---

## Main‑screen pillars (field narratives)

1) **Extreme S&R (Avalanche/Landslide)** — BLE beacon proximity + on‑device stability logic to support a **radar‑like life‑locator workflow** when responders are operating off‑grid.  
2) **Upcycling E‑Waste (ESG & SDGs)** — repurpose retired/abandoned smartphones into offline relief nodes, aligning with ESG and UN SDG objectives.  
3) **Off‑Grid Agriculture & Asset Protection** — practical patterns for livestock and asset safety in rangeland/desert environments with no coverage.  
4) **Arabic & Global Ready** — multilingual UI is built in (7 languages), including **Arabic (RTL)** for immediate field deployment.

> Note: This project is a technology demonstration and decision‑support tool. It does not replace certified emergency equipment, medical advice, or formal incident command systems.

---

## Key verifiable claims (audit‑friendly)

| Claim | How to verify (5 minutes) |
|---|---|
| **Offline‑first / local‑only by default** | Open DevTools → Network, then use the UI. There should be **no unexpected outbound requests** during normal use. |
| **No accounts / no cloud sync / no telemetry** | Search the HTML for analytics endpoints, external scripts, or tracking code. Verify UI has no sign‑in. |
| **No third‑party runtime dependencies** | In the HTML, confirm there are **no external `<script src=…>` libraries** loaded at runtime. |
| **Data stays on device** | Confirm storage is browser local storage. Verify nothing leaves the device unless an explicit export/share action is used. |
| **Optional secure hand‑off** | If using encrypted export, confirm it uses **AES‑GCM via WebCrypto** (on‑device). |

---

## How to run the demo

1. Open `VitalGuard_AI_complete_V41_6.html`.
2. Use a **Chromium‑based browser** that supports Web Bluetooth scanning (platform support varies).
3. For the most reliable behavior, serve the file from:
   - `https://…` or `http://localhost`  
   (some browsers restrict BLE on `file://`).
4. Click **Add Demo Tag** → register a BLE tag → start monitoring.

---

## Platform compatibility (practical)

| Platform | Expected status (typical) | Notes |
|---|---|---|
| Android + Chrome/Edge | ✅ Best experience | Web Bluetooth scanning support is strongest here. |
| Windows/macOS + Chrome/Edge | ✅ Often works | Depends on browser policies and BLE hardware support. |
| iOS/iPadOS + Safari/Chrome | ⚠️ Often 제한적 | Web Bluetooth support differs; scanning may be unavailable. |
| Locked‑down enterprise builds | ⚠️ Policy‑dependent | BLE and local storage may be restricted by MDM policies. |

---

## What it does (high level)

### 1) Offline BLE proximity tracking (Advertisement RSSI)
- Uses **Web Bluetooth LE Scanning** (`requestLEScan` + `advertisementreceived`) to read RSSI repeatedly.
- Tracks one or many BLE tags with a **registration wizard** (name the tag, save a signature, verify by moving).
- Includes **scan health** monitoring (events/sec + watchdog restart when the scan stalls).

### 2) Decision stability (“AI core”)
BLE RSSI is noisy; VitalGuard focuses on **stable decisions**, not false precision.

The core engine includes:
- **Kalman filtering** to smooth RSSI and estimate trend/velocity.
- **Hysteresis + anti‑flapping zone logic** so alerts don’t bounce rapidly.
- **Lost detection** when signal is absent for a configured window.

Optional local learning modules (on‑device, no cloud):
- **k‑NN Lite** (learns from user feedback samples)
- **IsolationForest Lite** (baseline anomaly scoring from SAFE windows)
- **Q‑learning Lite** (small threshold adjustments from feedback)
- **RLS calibration** (optional calibration of RSSI→distance mapping)

### 3) SOS / Emergency UX (offline)
- **SOS Finder**: focused UI to assist locating a selected tag.
- **Emergency Mode**: loud siren / strobe / big on‑screen message.
- **Rescue Assist**: share an offline **“Rescue Pack”** so another phone can scan for the same tag.
- **Backups**: export/import local data; **optional encrypted exports** (AES‑GCM) for safe hand‑off.

---

## Why the UI looks like a “Pet Safety Leash” (non‑sensitive skin)

To test the offline engine and BLE proximity workflow **in everyday environments**, the prototype is skinned as a **neutral consumer scenario** (“Pet Safety Leash”)—a universal, non‑sensitive use case.

The same underlying offline engine can be re‑skinned for:
- evacuation / muster guidance,
- search & rescue assistance,
- field operations in low‑connectivity environments,
- disaster response coordination *without cloud dependencies*.

(Important: this demo uses **BLE proximity**, not GPS.)

---

## Privacy & GDPR posture (plain language)

- **No accounts. No cloud sync. No analytics/telemetry.**
- Data is stored **locally on the device** (browser storage).
- Nothing is uploaded unless the user **explicitly exports** a file.

This is designed to be **GDPR‑friendly by architecture** (local‑only).  
*(This README is not legal advice.)*

---

## Limitations (important to understand)

- **BLE RSSI is not a tape measure.** Walls, pockets, bodies, and reflections can distort signal strength.
- Scanning can pause due to OS battery restrictions; the demo includes watchdog recovery, but **background behavior varies** by device.
- This is a **technology demo**, not a certified safety/medical product.

---

## Security review checklist (for auditors)

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

## Evidence pack (template)

Copy/paste after testing (keep it factual: observed behavior, not marketing).

| Date (YYYY‑MM‑DD) | Country/City | Environment | Device / OS | Browser | BLE Tag (brand/model/name shown) | Test Mode | Observed Range* | Congestion (adv/sec) | Stall Recovery | Focus Mode Used | Scan Stability | False Alerts | Notes |
|---|---|---|---|---|---|---|---|---:|---|---|---|---|---|
|  |  | Indoor / Outdoor / Mixed |  |  |  | Track All / Focus |  |  | Yes / No | Yes / No | Stable / Intermittent / Stalled | Low / Medium / High |  |

\* *Observed Range*: describe simply (e.g., “works reliably in same room”, “drops behind one concrete wall”, “recovers after ~10s”).  
This demo uses **BLE proximity (RSSI)** — it is **not GPS**.

---

## License & intended use

Published for review and humanitarian innovation.  
Includes an ethical‑use notice: **exclusively for civilian, agricultural, and humanitarian use**.

---

## Provenance (for restricted environments)

If you are reviewing this in a restricted network environment:
- Prefer using the attached **single HTML file** offline.
- External links may be blocked by policy.

**Source / reference:** (optional) GitHub repository link  
**Contact:** Morgan J. (Gyumin Jeon) · contact@mcorpai.org · mcorpai.org
