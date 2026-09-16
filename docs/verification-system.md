# JobProof Transparent Job Verification & Authenticity Scoring System

The Job Verification Engine is the core differentiating pillar of JobProof.

---

## 1. Verification Philosophy

Unlike traditional job aggregators, JobProof operates on the principle that **every job must be independently verified before publication**.

1. **Company Verification vs. Job Verification**:
   - A verified company can have expired or fake postings.
   - A legitimate job listing can exist on an unverified platform.
   - Company verification and Job verification are evaluated independently.
2. **Transparent Scoring**:
   - Users must see the exact evidence and breakdown of why a job received its score (0 to 100).
3. **No Guesswork / No Invented Facts**:
   - Software deterministically tests URLs, HTTP codes, domain ownership, and duplication.

---

## 2. Verification Scoring Criteria & Weights

The overall **Verification Score (0-100)** is computed using configurable weights:

| Evidence Check | Weight (Points) | Description | Verification Method |
| :--- | :---: | :--- | :--- |
| **Employer Domain & Career Match** | **25 pts** | Destination domain matches official company domain/ATS | Deterministic domain matching |
| **HTTP Application URL Check** | **20 pts** | URL returns status `200 OK` with valid content | HTTP Pinger / Status check |
| **Original Listing Presence** | **20 pts** | Original job page exists at source URL | Page content presence check |
| **Source Authority** | **15 pts** | Source is authorized API or official career page | Source trust score lookup |
| **Freshness (Last Checked)** | **10 pts** | Re-verified within expected SLA (<24h) | Timestamp comparison |
| **No Duplicate Flag** | **10 pts** | Job is unique across platforms | Fingerprint / Hash check |
| **Total Available** | **100 pts** | | |

---

## 3. Verification Status Rules

Jobs are assigned a status based on score and check results:

- **`VERIFIED`** (Score >= 80, Employer domain matches, HTTP 200 OK):
  Published immediately on main job feed.
- **`PROBABLY_VERIFIED`** (Score 65-79):
  Published with "Pending Freshness Check" badge.
- **`SUSPICIOUS`** (Domain mismatch, redirect loop, suspicious path):
  Held for review; hidden from main search.
- **`STALE` / `EXPIRED`** (HTTP 404 / 410 or missing listing during recheck):
  Automatically un-published. (Temporary HTTP 50x errors trigger re-try, not immediate expiration).
- **`REJECTED`** (Confirmed fake listing or domain mismatch):
  Blacklisted.

---

## 4. Example Score Calculation

### Job Scenario A: Direct Greenhouse Listing from Acme Corp
- Employer Verified: `+25`
- HTTP 200 OK: `+20`
- Listing Found: `+20`
- Source Authority (Direct ATS): `+15`
- Checked 15 minutes ago: `+10`
- No Duplicate Detected: `+10`
- **Total Score: 100 / 100** -> `VERIFIED` 🟢

### Job Scenario B: Undisclosed / Aggregator Link with Redirect
- Employer Domain Mismatch: `+10` (Partial)
- Application Link Active: `+20`
- Listing Found: `+15`
- Public Feed Source: `+5`
- Checked 2 hours ago: `+10`
- No Duplicate: `+10`
- **Total Score: 70 / 100** -> `PROBABLY_VERIFIED` 🟡
