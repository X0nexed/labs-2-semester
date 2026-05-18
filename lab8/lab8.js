class ApiService {
    async request(endpoint, options = {}) {
        return { status: 200, data: `OK: ${endpoint}` };
    }
}

class AuthProxy {
    constructor(apiService) {
        this.api = apiService;
        this.authConfig = null;
        this.requestHistory = [];
        this.rateLimitConfig = { maxRequests: 5, windowMs: 1000 };
    }

    setAuthMethod(type, credentials) {
        console.log(`[Proxy] Auth: ${type}`);
        this.authConfig = { type, ...credentials };
    }

    checkRateLimit() {
        const now = Date.now();
        this.requestHistory = this.requestHistory.filter(time => now - time < this.rateLimitConfig.windowMs);

        if (this.requestHistory.length >= this.rateLimitConfig.maxRequests) {
            throw new Error("Ліміт запитів!");
        }
        this.requestHistory.push(now);
    }

    renewTokenIfNeeded() {
        if (this.authConfig.type === 'JWT' && this.authConfig.expiresAt < Date.now()) {
            console.log("[Proxy] Оновлення токена...");
            this.authConfig.token = "new_token_777";
            this.authConfig.expiresAt = Date.now() + 3600000;
        }
    }

    async request(endpoint, payload = {}) {
        this.checkRateLimit();

        const headers = {};

        if (this.authConfig) {
            this.renewTokenIfNeeded();

            switch (this.authConfig.type) {
                case 'API_KEY': headers['X-API-KEY'] = this.authConfig.key; break;
                case 'JWT':     headers['Authorization'] = `Bearer ${this.authConfig.token}`; break;
                case 'OAuth':   headers['Authorization'] = `Bearer ${this.authConfig.accessToken}`; break;
            }
        }

        console.log(`[Proxy] -> ${endpoint} | Заголовки:`, headers);

        return this.api.request(endpoint, { body: payload, headers });
    }
}

(async () => {
    const api = new ApiService();
    const proxy = new AuthProxy(api);

    proxy.setAuthMethod('API_KEY', { key: "secret_123" });
    await proxy.request("/data", { id: 1 });

    proxy.setAuthMethod('JWT', {
        token: "old_token",
        expiresAt: Date.now() - 5000
    });
    await proxy.request("/profile", { user: "admin" });
})();
