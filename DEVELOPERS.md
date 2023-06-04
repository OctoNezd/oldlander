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
