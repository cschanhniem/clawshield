# Task Log: CI Pack Artifact Fix

## Goal

Fix the GitHub Actions pack verification step so it works on a fresh runner with no pre-existing `.tmp/pack` directory.

## Root Cause

`npm pack --pack-destination .tmp/pack` assumes the destination directory already exists. That was true in local development because `.tmp/pack` was often present, but false on clean GitHub runners.

## Changes

- Added `npm run pack:artifact` to create `.tmp/pack` before calling `npm pack`.
- Switched CI package verification to `npm run pack:artifact`.
- Updated release-check and publish docs to use the self-sufficient pack command.

## Result

The pack step no longer depends on incidental local state.
