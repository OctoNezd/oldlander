import jwt from "jsonwebtoken";
import addonmanifest from "../dist/manifest.json" assert { type: "json" };
import fetch from "node-fetch";
const addonId = "oldlander";
const addonVersion = addonmanifest.version;
var issuedAt = Math.floor(Date.now() / 1000);
var payload = {
    iss: process.env.WEB_EXT_API_KEY,
    jti: Math.random().toString(),
    iat: issuedAt,
    exp: issuedAt + 60,
};
console.log("Publishing source code for version", addonVersion);
var secret = process.env.WEB_EXT_API_SECRET; // store this securely.
var token = jwt.sign(payload, secret, {
    algorithm: "HS256", // HMAC-SHA256 signing algorithm
});
const moz_endpoint = "https://addons.mozilla.org/api/v5";
const source_link =
    "https://github.com/OctoNezd/oldlander/archive/refs/heads/main.zip";
const amoHeaders = new Headers({
    // "Content-Type": "multipart/form-data",
    Authorization: "JWT " + token,
});
(async () => {
    try {
        const formData = new FormData();
        const sourcecode_req = await fetch(source_link);
        const sourcecode = await sourcecode_req.blob();
        formData.append("source", sourcecode, "source.zip");
        console.log(formData);
        const upload_res = await fetch(
            moz_endpoint + `/addons/addon/${addonId}/versions/${addonVersion}/`,
            {
                headers: amoHeaders,
                body: formData,
                method: "PATCH",
            }
        );
        const upload_res_json = await upload_res.json();
        console.log("Uploaded:", upload_res_json, "Success:", upload_res.ok);
        if (!upload_res.ok) {
            throw "Failed to upload";
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
})();
