const isLocalHost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const DEFAULT_REMOTE_API_BASE_URL = 'https://healthwatch-backend-production.up.railway.app';

function normalizeApiBaseUrl(value) {
    return value ? value.replace(/\/+$/, '') : '';
}

const urlParams = new URLSearchParams(window.location.search);
const queryApiBaseUrl = normalizeApiBaseUrl(urlParams.get('apiBaseUrl') || urlParams.get('api'));

if (queryApiBaseUrl) {
    localStorage.setItem('healthwatchApiBaseUrl', queryApiBaseUrl);
}

const configuredApiBaseUrl = normalizeApiBaseUrl(
    window.HEALTHWATCH_API_BASE_URL || localStorage.getItem('healthwatchApiBaseUrl')
);

const CONFIG = {
    API_BASE_URL: configuredApiBaseUrl || (isLocalHost ? 'http://localhost:8081' : DEFAULT_REMOTE_API_BASE_URL),
    DEMO_DOCTOR_ID: 'doctor1',

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
