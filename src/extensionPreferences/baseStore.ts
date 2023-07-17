export default class PrefStore {
    constructor() {}
    async get(key: string): Promise<Record<string, unknown>> {
        throw "not implemented";
    }
    async set(key: string, value: unknown): Promise<void> {
        throw "not implemented";
    }
}
