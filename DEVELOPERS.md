# Development and debugging

## Android

1. Connect your phone to PC.

2. Enable ADB debug.

3. Enable USB debugging in Firefox Nightly settings.

4. Run `npm run dev`.

5. Debug from about:debugging.

## Actions

1. Install [GitHub CLI](https://cli.github.com/)

2. Install [act](https://github.com/nektos/act)

3. `gh act --secret-file .env -s GITHUB_TOKEN=$(gh auth token)`

## Building

You can build the extension source code using `npm run wp-build`. There are also commands for making browser extension directly:

- `npm run make:chrome` - makes crx
- `npm run make:firefox` - creates and signs xpi for self-distribution
- `npm run make:firefox-public` - creates and publishes xpi on addons.mozilla.org
