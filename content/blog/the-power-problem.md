---
title: "The power problem, and what a workspace owes you"
description: "Most Nigerian workspaces advertise 24/7 power. Far fewer will tell you what happens in the eleven seconds after the grid drops. Here is how we designed around it — and what to ask before you sign anywhere."
date: "2026-07-29"
author: "Michael Chen"
authorRole: "Operations"
tags: ["Operations", "Workspace"]
---

"24/7 power" is the most common claim on a Nigerian coworking website, and the least useful. It is technically true almost everywhere and tells you nothing about the experience of working there.

The question that actually matters is narrower: **what happens between the grid failing and the generator carrying load?**

## The eleven-second gap

A typical diesel generator needs somewhere between eight and fifteen seconds from a grid failure to stable output. That includes the ATS sensing the outage, the starter cranking, and the alternator settling.

In those seconds, if nothing is bridging the gap, every socket in the building is dead.

For a room full of people on laptops this seems harmless — laptops have batteries. But the building does not run on laptops:

- The router and the ONT reboot. Your connection drops for two to four minutes while the link renegotiates, not eleven seconds.
- Monitors, docks and external drives cut out. Anything mid-write can corrupt.
- The AC compressor stops and restarts, which in a full room you feel for the next twenty minutes.
- Anyone on a call gets dropped, then has to reconnect and re-explain.

Eleven seconds of no power costs closer to five minutes of no work, times everyone in the building.

## What we actually did

The fix is not exotic. It is inverters and batteries sized to carry the whole floor, not just the server cupboard, with the generator behind them as the long-run source rather than the first responder.

The order of events when the grid drops at Forge:

1. Inverters take the load instantly. Nothing in the building notices.
2. The generator starts and stabilises.
3. Load transfers to the generator. Batteries recharge.
4. Grid returns; load transfers back; generator cools down and stops.

From a member's chair, none of this is visible. That is the entire point. The measure of good infrastructure is that it produces no anecdotes.

Network gear, the fibre ONT, and the WiFi access points sit on a separate protected circuit so they never see a transfer event at all. That one detail — keeping the network up through a switchover — is the difference between "the power blinked" and "I lost my afternoon."

## What to ask before you sign anywhere

If you are evaluating a workspace, these five questions separate the marketing from the engineering:

1. **Do you have inverter backup, or only a generator?** If only a generator, every outage is a real interruption.
2. **How long can the batteries carry the full floor?** "The whole building for two hours" is a real answer. "We have inverters" is not.
3. **Is the network on protected power?** Ask specifically. It is frequently not.
4. **What is your diesel policy on a bad week?** Availability and price both move. Ask what happens when they move badly.
5. **Can I sit here for a full day before paying for a month?** A day pass is the only honest demo.

Ask these anywhere, not just here. If a space answers all five clearly, it is probably run by someone who has thought about your afternoon.

## The honest limits

We are not immune. Batteries degrade, generators need servicing, and a long grid outage during a diesel shortage is a genuinely hard week for everyone in this city.

What we can commit to is the boring version of reliability: capacity sized above what we need, maintenance on a schedule rather than on failure, and telling members what happened when something does go wrong.

If your work cannot survive a lost afternoon, that is a reasonable thing to be picky about. Be picky.
