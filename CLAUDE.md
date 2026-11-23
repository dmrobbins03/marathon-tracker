# Logging from chat

David reports runs in chat. To log one:

1. Append to `runs[]` in `data/log.json` (schema in README.md). Resolve relative dates ("two days ago") against the message date in America/Los_Angeles.
2. Record only what he said. Put assumptions in `notes`; mark estimated heart rate with `hrApprox: true`.
3. Add a `body[]` entry for every area he mentions, including "no pain" (level 0). The right knee (jumper's knee) should get an entry every run when he comments on it.
4. Goal changes never overwrite: add a dated entry with a reason to that goal's `history[]`, and update `target`/`status`.
5. Set `meta.updated`, run `node scripts/build.js`, commit, push, and republish `dist/index.html` to the tracker artifact (slug 862e25c3-13c7-42c1-8453-263fb2207e02).

6. Strava is connected. Runs upload as indoor `Workout` activities with no distance; session time and HR cover the whole workout (lifting included). Use it for dates and `hrAvg`/`hrMax`/`sessionMin`; distance and speed come from David. Mark distances he didn't give per run with `estimated: true`.
7. Every run gets a `location`. Default is `meta.defaultLocation` (garage, Woodway 4Front treadmill); for outdoor runs record the place he names and set `surface` (road/track/trail).
8. Body reports that aren't tied to a run (morning-after checks, squat tests) go in `checks[]`: `date`, `context`, `body[]`. A range like "1 or 2" is `level` + `levelMax`.
9. Body levels are David's 0-10 pain rating (0 none, 1-3 mild, 4-5 moderate, 6-10 severe). If he describes pain without a number, ask for one; if logging from words, set `levelEst: true`.
