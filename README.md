# VoiceShield Admin Portal — Enterprise & Research Analytics

The official administrative and research telemetry web portal for **VoiceShield: AI-Powered Voice Scam Protection**.

This application is built as an independent administrative frontend designed for fraud analysts, machine learning researchers, and security operations center (SOC) personnel to inspect model calibration, review detected voice clone incidents, upload and analyze suspicious audio recordings, and manage platform configurations.

---

## 1. Technology Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Custom Regular CSS & CSS Custom Properties (Zero Tailwind CSS dependencies)
- **Package Manager:** npm

---

## 2. Directory Structure

```
voiceshield/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── layout.tsx      # Root layout & page metadata
│   │   ├── globals.css     # Unified VoiceShield regular CSS design system
│   │   ├── page.tsx        # Root entry (Research Analytics Dashboard)
│   │   ├── overview/       # Overview navigation route (Research Analytics)
│   │   ├── dashboard/      # Admin Audio Analysis & Upload Workspace
│   │   ├── history/        # Analyzed Recordings History & Results
│   │   ├── settings/       # Platform & inference settings route
│   │   ├── cases/          # Case investigation & dossier route
│   │   └── model-health/   # Model health & infrastructure status route
│   ├── components/
│   │   ├── layout/         # Shared Sidebar (Overview, Dashboard, History, Settings), Header
│   │   ├── audio/          # AnalysisProcessingModal, CallSafetyResult
│   │   ├── analytics/      # Metric cards and research visual charts
│   │   ├── cases/          # Case investigation deep-dive modal
│   │   └── common/         # Search palette, notifications, badges, pills, toasts
│   └── lib/
│       ├── api/            # API client with live POST /api/v1/calls/analyze & probe
│       ├── data/           # History store & validated sample data
│       ├── types/          # Strict TypeScript interfaces
│       └── utils/          # CSV & JSON report export utility
├── next.config.ts          # Clean Next.js configuration
├── tsconfig.json           # Path-aliased TypeScript configuration
└── package.json            # Dependencies
```

---

## 3. Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm 9+

### Running Locally

From inside the `voiceshield/` folder:

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Admin Navigation Structure

The Admin sidebar contains exactly the 4 specified workspace navigation items:

1. **Overview (`/` or `/overview`):** Opens the Research Analytics dashboard matching `admin_ui.jpeg`.
2. **Dashboard (`/dashboard`):** Admin Audio Analysis upload and inspection workspace.
3. **History (`/history`):** Complete check history of analyzed voice recordings with results and transcripts.
4. **Settings (`/settings`):** Platform configuration, inference modes, API keys, and alert thresholds.

---

## 5. Admin Audio Analysis Workflow

### A. Upload & Language Selection (`/dashboard`)
- **Drag-and-Drop Dropzone:** Select audio files (WAV, MP3, M4A, FLAC, max 25 MB).
- **Language Selection:** Supports Auto-detect, English (`en`), Hindi (`hi`), and Malayalam (`ml`).
- **Live / Offline Detection:** Checks if the local FastAPI backend (`http://localhost:8000`) is active.
- **Quick Test Samples:** Admin can test sample voicemails (`bank_otp_request.wav`, `insurance_policy_offer.wav`, `customer_support_call.wav`).

### B. Synchronous Processing Modal (`AnalysisProcessingModal.tsx`)
Matches `ui_5.jpeg`:
- Displays filename, size, and `Encrypted Stream` badge.
- Animated concentric pulsing waveform rings.
- Dynamic 4-stage checklist:
  1. *Converting speech to text* (Done)
  2. *Looking for common scam patterns* (Done / In progress)
  3. *Analyzing the conversation* (In progress)
  4. *Preparing your results* (Pending)
- Includes encrypted session disclaimer and a "Cancel Analysis" button.

### C. Call Safety Results (`CallSafetyResult.tsx`)
Matches `ui_6-1.jpeg`, `ui_6-2.jpeg`, and `ui_6-3.jpeg` based on actual backend response:
- **Safe (< 40 Score):** Green circular gauge (e.g. 12/100), `● Looks Safe` badge, "What we found", "A few things to remember".
- **Suspicious (40–69 Score):** Amber circular gauge (e.g. 65/100), `⚠️ Be Careful` badge, "What we noticed", "What you should do".
- **High Risk (≥ 70 Score):** Red circular gauge (e.g. 92/100), `🛡️ High Scam Risk` badge, detailed fraud flags.
- **Interactive Audio Waveform:** Simulated playback with timing, rate, and speed indicator.
- **Plain-English Transcript Viewer:** Expandable dialog with speaker markers and highlighted suspicious phrases.
- **Multi-Agent Neural Evidence:** Inspect individual contributions from Voice Clone (Spectra-AASIST3), Conversation Intelligence, and STT.

### D. Persistent Check History (`/history`)
Matches `ui_7.jpeg`:
- Displays all analyzed recordings with filename, format, timestamp, risk score pill, verdict badge, and duration.
- Real API responses are saved to local history store and marked with `Live API` indicators.
- Real-time search and filtering by verdict (`Looks Safe`, `Be Careful`, `High Scam Risk`) and time window.
- Clicking *"View result →"* opens the full Call Safety Result dossier.

---

## 6. Backend Integration

The analysis uses the documented VoiceShield backend endpoint:
- **Method:** `POST`
- **URL:** `/api/v1/calls/analyze`
- **Form Data:**
  - `audio` (File, required)
  - `language` (string, optional: `en`, `hi`, `ml`)
- **Backend Architecture:** Synchronous analysis pipeline. When backend is offline, an honest status message is displayed with options to run sample demo analyses clearly tagged with `Sample data`.
