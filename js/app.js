(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        setupStartScreen();
        setupAlertDismiss();
        Auth.init();
    });

    function setupStartScreen() {
        const saveBackendConfig = setupBackendConfig();
        const roleButtons = document.querySelectorAll('.role-btn');
        roleButtons.forEach(button => {
            button.addEventListener('click', () => {
                roleButtons.forEach(item => item.classList.remove('active'));
                button.classList.add('active');
                Auth.fillDemoCredentials(button.dataset.role);
            });
        });

        document.getElementById('login-form').addEventListener('submit', async event => {
            event.preventDefault();
            if (!saveBackendConfig()) {
                return;
            }
            await Auth.login();
        });

        document.getElementById('patient-logout-btn').addEventListener('click', () => Auth.logout());
        document.getElementById('doctor-logout-btn').addEventListener('click', () => Auth.logout());

        document.getElementById('patient-sos-btn').addEventListener('click', async () => {
            const user = Auth.getUser();
            const patientId = user?.patientId;

            if (!patientId || !confirm('Send an SOS emergency alert?')) {
                return;
            }

            try {
                await API.triggerSos(patientId, 'Patient-triggered SOS emergency', 'PATIENT');
                Alerts.showToastMessage('danger', 'SOS Sent', 'Emergency alert has been saved.');
                await PatientDashboard.loadDashboard();
            } catch (error) {
                Alerts.showToastMessage('danger', 'SOS Failed', error.message);
            }
        });
    }

    function setupBackendConfig() {
        const input = document.getElementById('backend-url');
        const saveButton = document.getElementById('backend-url-save-btn');
        const message = document.getElementById('backend-url-message');

        if (!input) {
            return () => true;
        }

        input.value = CONFIG.API_BASE_URL || '';
        input.required = !CONFIG.API_BASE_URL_CONFIGURED;

        function setMessage(text, type = '') {
            if (!message) {
                return;
            }

            message.textContent = text;
            message.classList.remove('success', 'error');
            if (type) {
                message.classList.add(type);
            }
        }

        function save(showMessage = false) {
            try {
                const apiBaseUrl = CONFIG.setApiBaseUrl(input.value);
                input.value = apiBaseUrl;
                input.required = !CONFIG.API_BASE_URL_CONFIGURED;
                setMessage(showMessage && apiBaseUrl ? `Saved ${apiBaseUrl}` : '', 'success');
                return true;
            } catch (error) {
                setMessage(error.message, 'error');
                input.focus();
                return false;
            }
        }

        saveButton?.addEventListener('click', () => save(true));
        input.addEventListener('change', () => save(false));

        return () => save(false);
    }

    function setupAlertDismiss() {
        document.getElementById('alert-popup-dismiss').addEventListener('click', () => {
            Alerts.dismissPopup();
        });

        document.getElementById('alert-overlay').addEventListener('click', event => {
            if (event.target === event.currentTarget) {
                Alerts.dismissPopup();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                Alerts.dismissPopup();
            }
        });
    }

})();
