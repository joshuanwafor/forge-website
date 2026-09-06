---
title: "How we monitor the uplink (and publish it)"
description: "A small Node script, a cron job and a Postgres table. The whole system that tells us the internet is fine before a member has to."
date: "2026-07-08"
author: "Michael Chen"
authorRole: "Operations"
tags: ["Operations", "Engineering"]
---

Members should never be the monitoring system. If somebody has to walk to the front desk to tell us the WiFi is bad, we have already lost.

So we run a small probe. It is about eighty lines of code and it has caught more problems than any dashboard we have paid for.

## What we measure

Three things, from a Raspberry Pi on the members' VLAN — the same network you connect to, not a privileged one:

- **Reachability and latency** to a handful of endpoints, so a single unlucky host does not read as an outage.
- **Jitter**, which matters more than raw speed for calls. Consistent 40 ms beats spiky 12 ms.
- **Throughput**, sampled rather than continuous, because a speed test every minute is itself a load problem.

## The probe

```js
import { performance } from "node:perf_hooks";

const TARGETS = [
  "https://1.1.1.1",
  "https://www.google.com/generate_204",
  "https://api.github.com/meta",
];

const TIMEOUT_MS = 5000;

async function probe(url) {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    return { url, ok: res.ok, ms: Math.round(performance.now() - started) };
  } catch {
    return { url, ok: false, ms: null };
  } finally {
    clearTimeout(timer);
  }
}

export async function sample() {
  const results = await Promise.all(TARGETS.map(probe));
  const healthy = results.filter((r) => r.ok);

  return {
    at: new Date().toISOString(),
    reachable: healthy.length,
    total: results.length,
    // Median, not mean — one slow target shouldn't drag the number.
    latencyMs: median(healthy.map((r) => r.ms)),
    results,
  };
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}
```

Two details in there matter more than they look.

**The median, not the mean.** One target having a bad minute should not page anybody. A mean lets a single 4-second outlier turn a healthy sample into an alert; a median just shrugs.

**`Promise.all`, not a sequential loop.** Probing in series means your measurement window stretches with every timeout, and a sample that takes 15 seconds to collect is describing a different moment than the one it is stamped with.

## Storing it

Samples go into a single table, and nothing is ever updated — only inserted. Append-only history makes "was it bad last Tuesday afternoon?" answerable.

```sql
create table uplink_samples (
  id          bigserial primary key,
  at          timestamptz not null default now(),
  reachable   smallint    not null,
  total       smallint    not null,
  latency_ms  integer,
  raw         jsonb       not null
);

-- Almost every query is "recent samples, newest first".
create index uplink_samples_at_idx on uplink_samples (at desc);
```

The `raw` column is deliberate. We do not know yet which fields we will want in six months, and a `jsonb` blob alongside the columns we *do* query is cheap insurance against a migration we cannot predict.

## Alerting without crying wolf

The rule we settled on, after a fortnight of being woken by nothing:

> Alert when **three consecutive samples** show fewer than two reachable targets, or when the rolling five-minute median latency exceeds 400 ms.

A single bad sample means nothing. Three in a row at one-minute intervals means something real, and it is still fast enough that we usually know before the room does.

## What it changed

Mostly it changed the conversation. When a member says "the internet feels slow", we can now look at the actual numbers for that window instead of trading impressions. Sometimes the graph is flat and the problem is their VPN. Sometimes the graph is a cliff and we owe them an apology and a fix.

Either way, the question stops being a matter of opinion. That is worth eighty lines of code.
