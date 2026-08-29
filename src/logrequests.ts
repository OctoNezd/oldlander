window.fetch = new Proxy(window.fetch, {
    apply(target, thisArg, argArray) {
        console.log("[dev] Fetch to", argArray[0], "config:", argArray[1])
        const res: Promise<Response> = Reflect.apply(target, thisArg, argArray)
        return res.then(response => {
            const clone = response.clone();
            console.log("[dev] Fetch to", argArray[0], "result is:", clone);

            clone.text().then(text => {
                console.log("[dev] Fetch to", argArray[0], "gave us", text);
            }).catch(e => {
                console.log("[dev] Fetch to:", argArray[0], "gave us unparseable body?", e);
            });

            // Return the original response
            return response;
        }).catch(e => {
            console.log("[dev] Fetch to", argArray[0], "failed:", e)
            throw e
        })

    },
})