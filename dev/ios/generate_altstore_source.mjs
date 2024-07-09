import addonmanifest from "../../dist/manifest.json" assert { type: "json" };
import * as fs from "node:fs";
const addonVersion = addonmanifest.version;
const date = new Date().toISOString();
const repo = {
    name: "OldLander repository",
    featuredApps: ["me.octonezd.addon.oldlander"],
    identifier: "me.octonezd.oldlander",
    apps: [
        {
            name: "OldLander",
            bundleIdentifier: "me.octonezd.addon.OldLander",
            developerName: "OctoNezd",
            localizedDescription:
                "Safari web extension for old reddit to make it usable on mobile devices",
            subtitle:
                "Safari web extension for old reddit to make it usable on mobile devices",
            iconURL:
                "https://github.com/OctoNezd/oldlander/blob/main/icons/icon.png?raw=true",
            tintColor: "F54F32",
            category: "social",
            versions: [
                {
                    version: addonVersion,
                    date: date,
                    downloadURL: `https://github.com/OctoNezd/oldlander/releases/download/${addonVersion}/OldLander.ipa`,
                    size: 0,
                },
            ],
            appPermissions: {},
            // Sidestore: support
            // SideStore uses legacy repo format, see https://github.com/SideStore/SideStore/issues/314
            downloadURL: `https://github.com/OctoNezd/oldlander/releases/download/${addonVersion}/OldLander.ipa`,
            version: addonVersion,
            versionDate: date,
            size: 0,
        },
    ],
};

fs.writeFileSync("altStoreManifest.json", JSON.stringify(repo));
