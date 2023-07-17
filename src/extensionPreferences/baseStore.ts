export default interface PrefStore {
    get: (key: string) => Promise<Record<string, unknown>>;
    set: (key: string, value: unknown) => Promise<void>;
}
