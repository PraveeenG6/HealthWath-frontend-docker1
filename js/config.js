const isLocalHost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const apiBaseUrlStorageKey = 'healthwatchApiBaseUrl';

function normalizeApiBaseUrl(value) {
    let url = value ? value.trim() : '';

    if (!url) {
        return '';
    }

    if (!/^https?:\/\//i.test(url)) {
        const isLocalUrl = /^(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/i.test(url);
        url = `${isLocalUrl ? 'http' : 'https'}://${url}`;
    }

    return url.replace(/\/+$/, '');
}

function validateApiBaseUrl(value) {
    if (!value) {
        return;
    }

    const parsedUrl = new URL(value);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Backend URL must start with http:// or https://');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const queryApiBaseUrl = normalizeApiBaseUrl(urlParams.get('apiBaseUrl') || urlParams.get('api'));

if (queryApiBaseUrl) {
    validateApiBaseUrl(queryApiBaseUrl);
    localStorage.setItem(apiBaseUrlStorageKey, queryApiBaseUrl);
}

const configuredApiBaseUrl = normalizeApiBaseUrl(
    window.HEALTHWATCH_API_BASE_URL || localStorage.getItem(apiBaseUrlStorageKey)
);
const defaultApiBaseUrl = isLocalHost ? 'http://localhost:8081' : '';

const CONFIG = {
    API_BASE_URL: configuredApiBaseUrl || defaultApiBaseUrl,
    API_BASE_URL_CONFIGURED: Boolean(configuredApiBaseUrl || defaultApiBaseUrl),
    API_BASE_URL_STORAGE_KEY: apiBaseUrlStorageKey,
    DEMO_DOCTOR_ID: '1BM24EC403',

    setApiBaseUrl(value) {
        const normalizedUrl = normalizeApiBaseUrl(value);
        validateApiBaseUrl(normalizedUrl);

        if (normalizedUrl) {
            localStorage.setItem(apiBaseUrlStorageKey, normalizedUrl);
        } else {
            localStorage.removeItem(apiBaseUrlStorageKey);
        }

        this.API_BASE_URL = normalizedUrl || defaultApiBaseUrl;
        this.API_BASE_URL_CONFIGURED = Boolean(this.API_BASE_URL);
        return this.API_BASE_URL;
    },

    ENDPOINTS: {
        
        AUTH_LOGIN: '/api/auth/login',
        HEALTH_READING: '/api/health/reading',
        HEALTH_LATEST: '/api/health/latest',
        HEALTH_HISTORY: '/api/health/history',
        HEALTH_SUMMARY: '/api/health/summary',
        DASHBOARD_PATIENT: '/api/dashboard/patient',
        DASHBOARD_DOCTOR: '/api/dashboard/doctor',
        ALERTS_ACTIVE: '/api/alerts/active',
        ALERTS_HISTORY: '/api/alerts/history',
        ALERT_ACKNOWLEDGE: '/api/alerts',
        PATIENTS: '/api/patients',
        SOS: '/api/sos',
        AI_ANALYZE: '/api/ai/analyze',
        CONSULTATIONS: '/api/consultations',
        CHATBOT: '/api/chatbot/message',
    },

    REFRESH_INTERVAL: 10000,

    THRESHOLDS: {
        HEART_RATE_HIGH: 110,
        HEART_RATE_LOW: 45,
        SPO2_LOW: 94,
        TEMP_HIGH: 38.5,
        TEMP_LOW: 35.0,
    }
};
