# Logging from chat

David reports runs in chat. To log one:

1. Append to `runs[]` in `data/log.json` (schema in README.md). Resolve relative dates ("two days ago") against the message date in America/Los_Angeles.
2. Record only what he said. Put assumptions in `notes`; mark estimated heart rate with `hrApprox: true`.
3. Add a `body[]` entry for every area he mentions, including "no pain" (level 0). The right knee (jumper's knee) should get an entry every run when he comments on it.
4. Goal changes never overwrite: add a dated entry with a reason to that goal's `history[]`, and update `target`/`status`.
5. Set `meta.updated`, run `node scripts/build.js`, commit, push, and republish `dist/index.html` to the tracker artifact (slug 862e25c3-13c7-42c1-8453-263fb2207e02).

6. Strava is connected. Runs upload as indoor `Workout` activities with no distance; session time and HR cover the whole workout (lifting included). Use it for dates and `hrAvg`/`hrMax`/`sessionMin`; distance and speed come from David. Mark distances he didn't give per run with `estimated: true`.
