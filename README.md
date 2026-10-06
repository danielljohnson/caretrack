# CareTrack Vitals

A small slice of a clinical tool used in senior living communities. Caregivers
record a resident's vital signs (temperature, pulse, oxygen, blood pressure),
and the app flags readings that are outside normal ranges so a nurse can follow up.

Each community has its own database (single-tenant). That's simulated in
`lib/db.ts` with one in-memory store per community, including a simulated
round trip on every call, roughly what production sees against SQL Server.

## Setup

```bash
npm install
npm run dev     # http://localhost:3000
npm test
```

Data is seeded in memory and resets when the server restarts.

## Your task (60 minutes)

### Part 1: Review (about 20 minutes)

This code is in production and caregivers use it every shift. Review it as if
you were picking it up from another team. Write down what you find, in priority
order, with a sentence on why each item matters. You don't have to fix
everything. Fix what you think must be fixed before you build on top of it.

### Part 2: Feature (about 40 minutes)

Build a **shift handoff** page at `/c/[communityId]/handoff`.

When a nurse starts a shift, they need to know who to check on first. The page
shows, for the **current shift**:

1. **Needs attention:** active residents with at least one abnormal reading
   during the shift, with each abnormal finding listed. Residents with the
   most abnormal readings come first.
2. **No vitals this shift:** active residents with no readings during the shift.

Shifts are in the community's local time:

- Day shift: 07:00 to 19:00
- Night shift: 19:00 to 07:00 the next morning

Only active residents appear (not discharged, not in hospital). Link to it from
the community page. Include tests for the logic that decides what appears.

## Clinical rules

A reading is abnormal if any of these are true:

| Vital | Abnormal when |
|---|---|
| Temperature | 100.4°F or higher, or below 95°F |
| Pulse | below 50 or above 120 |
| SpO2 (oxygen) | below 92% |
| Systolic blood pressure | below 90 or above 180 |

A missing value isn't abnormal. It just wasn't taken.
