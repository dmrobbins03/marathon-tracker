# Half Marathon Tracker

Training log for a January 2027 half marathon: miles, run/walk segments, speed, heart rate, shoes, body checks, and a goals timeline.

## Use

```sh
node server.js        # http://localhost:4173, the form saves to data/log.json
node scripts/build.js # dist/index.html, one self-contained file with the data inlined
```

No dependencies. `data/log.json` is the source of truth; most entries are added from chat reports, the form is the second way in.

## Data

- `runs[]`: `date`, `location`, `surface`, `shoeId`, `segments[]` (`type` run/walk, `miles`, optional `mph`, `hr` as a number or `[low, high]`, `hrApprox`), optional `rpe`, `lift`, `notes`, `estimated`, Strava session fields (`hrAvg`, `hrMax`, `sessionMin`, `stravaId`), and `body[]` (`area`, `level` 0-10, optional `levelMax`, `levelEst`, `note`).
- `goals[]`: each goal keeps its own `history[]` of dated changes with a reason, so revisions stay visible.
- `shoes[]`, `injuries[]`, `observations[]`, `race`, `plan`.

Body scale is pain 0-10: 0 none, 1-3 mild, 4-5 moderate, 6-10 severe. `checks[]` holds body checks not tied to a run.
