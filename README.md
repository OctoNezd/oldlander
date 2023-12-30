# OldLander

## WARNING WARNING WARNING ADDON IS NOT AVAILABLE ON CHROME WEB STORE - ANYTHING YOU SEE THERE UNDER THAT NAME IS FAKE

## Screenshots

# Android

<img src="screenshots/index.png" height="500"/>

## Installation

### Firefox

Go to [the OldLander addons.mozilla.org page](https://addons.mozilla.org/en-US/firefox/addon/oldlander/) and click install.

Optionally, install the extra addons:

[Old Reddit Redirect](https://addons.mozilla.org/en-US/firefox/addon/old-reddit-redirect) to make sure reddit wont point you to new UI

[RES](https://addons.mozilla.org/en-US/firefox/addon/reddit-enhancement-suite) to add infinite scrolling and extra features

### Kiwi

Note: this is kinda unsupported, I don't use Chromium browsers.

1. Download addon .crx file from Releases tab.

2. Go to Addons, enable developer mode and click `+(from .zip/.crx/.user.js)`

3. Select downloaded .crx

FYI: Updates should be automatically delivered - pipeline in this repository creates Chrome update list

I cant release it on official store due to the fact I can't pay the registration fee with any of my bank cards.

### iOS

Note: macOS is required for this to work.

Note: before running the following commands, make sure you have Xcode installed.

1. Run `npm run wp-build` to build the extension
2. Open `dist` folder by running `cd dist` in the terminal of your choice
3. Run `xcrun safari-web-extension-converter . --ios-only` to convert the extension to Safari App Extension
4. In the project file, go to `Signing & Capabilities` tab, and select your team. Make sure you've set it up for both targets
5. Select the device you want to run the extension on, and click `Run`
6. After installation go to `Settings -> Safari -> Extensions` and enable OldLander. Make sure `Webpage Contents and Browsing History` is set to "Allow"
   <img src="screenshots/extensions-ios.png" height=500/>
   <img src="screenshots/permissions-ios.png" height=500/>

### Tampermonkey

Head to releases, click on latest oldlander.user.js.
