# Using Git to pull created and last-updated article dates

---DRAFT---

```
const filepath = file.history[0]
const timestamps = await Git.getStamps({ files: filepath })
const timestamp = timestamps[Object.keys(timestamps)[0]]
```