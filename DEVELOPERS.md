# Development and debugging

## Android

1. Connect your phone to PC.

2. Enable ADB debug.

3. Enable USB debugging in Firefox Nightly settings.

4. Run `yarn dev-mobile`.

5. Debug from about:debugging.

## PC

1. Install [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)

2. Create profile oldlander-test in about:profiles

3. Run `yarn dev`

## Actions

1. Install [GitHub CLI](https://cli.github.com/)

2. Install [act](https://github.com/nektos/act)

3. `gh act --secret-file .env -s GITHUB_TOKEN=$(gh auth token)`

## Building

You can build the extension source code using `yarn wp-build`. There are also commands for making browser extension directly:

-   `yarn make:chrome` - makes crx
-   `yarn make:firefox` - creates and signs xpi for self-distribution
-   `yarn make:firefox-public` - creates and publishes xpi on addons.mozilla.org
-   `yarn make:firefox-zip` - creates unsigned .zip for Firefox
