# 2026-03-13 Telegram Command Aliases

## Goal

Make ClawSeatbelt command invocation work cleanly on Telegram without breaking the canonical OpenClaw command surface elsewhere.

## Why

Telegram bot commands accept only lowercase letters, digits, and underscores, so the existing hyphenated command names were readable in docs but invalid in Telegram.

## Changes

- added Telegram-safe native command aliases through `nativeNames`
- introduced short `csb_*` aliases for the seven operator commands
- made recommendation output use the Telegram-safe status command when the request originates from Telegram
- updated operator docs and architecture docs to explain the split between canonical and Telegram-native command names
- fixed the pinned install metadata path so operator artifacts no longer referenced the stale `0.1.0` package version

## Result

ClawSeatbelt keeps the canonical `clawseatbelt-*` command family for OpenClaw generally, while Telegram users can invoke the same capabilities with short valid aliases such as `/csb_status` and `/csb_scan`.
