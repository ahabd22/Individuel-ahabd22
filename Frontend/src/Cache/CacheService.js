export default class CacheService {
    constructor() {
        this.cache = {};
    }

    set(key, value, ttl = 300000) { // Default TTL: 5 minutes
        const now = new Date();
        this.cache[key] = {
            value,
            expiry: now.getTime() + ttl,
        };
    }

    get(key) {
        const cached = this.cache[key];
        if (!cached) return null;
        const now = new Date();
        if (now.getTime() > cached.expiry) {
            delete this.cache[key];
            return null;
        }
        return cached.value;
    }
}