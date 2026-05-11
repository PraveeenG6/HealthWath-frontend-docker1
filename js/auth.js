const Auth = {
    currentUser: null,

    init() {
        const savedUser = localStorage.getItem('healthwatchUser');
        if (savedUser && API.authHeader) {
            this.currentUser = JSON.parse(savedUser);
            this._showDashboard(this.currentUser.role);
            return true;
        }

        this._showLogin();
        return false;
    },

    async login() {
        const selectedRole = document.querySelector('.role-btn.active')?.dataset.role || 'PATIENT';
        const userId = document.getElementById('login-user-id').value.trim();
        const password = document.getElementById('login-password').value;
        const button = document.getElementById('login-submit-btn');
        const errorEl = document.getElementById('login-error');

        button.classList.add('loading');
        errorEl.textContent = '';

        try {
            const user = await API.login(userId, password);
            if (user.role !== selectedRole) {
                API.clearAuth();
                throw new Error(`This account is a ${user.role.toLowerCase()} account. Select the correct role.`);
            }

            this.currentUser = user;
            localStorage.setItem('healthwatchUser', JSON.stringify(user));
            this._showDashboard(user.role);
        } catch (error) {
            errorEl.textContent = error.message;
        } finally {
            button.classList.remove('loading');
        }
    },

    logout() {
        if (PatientDashboard.refreshTimer) {
            clearInterval(PatientDashboard.refreshTimer);
            PatientDashboard.refreshTimer = null;
        }

        if (DoctorDashboard.refreshTimer) {
            clearInterval(DoctorDashboard.refreshTimer);
            DoctorDashboard.refreshTimer = null;
        }

        this.currentUser = null;
        API.clearAuth();
        localStorage.removeItem('healthwatchUser');
        this._showLogin();
    },

    getUser() {
        return this.currentUser;
    },

    fillDemoCredentials(role) {
        const userInput = document.getElementById('login-user-id');
        const passwordInput = document.getElementById('login-password');

        if (role === 'DOCTOR') {
            userInput.value = '1BM24EC403';
            passwordInput.value = 'miniproject';
            return;
        }

        userInput.value = '1BM24EC407';
        passwordInput.value = 'miniproject';
    },

    _showLogin() {
        document.getElementById('login-page').classList.add('active');
        document.getElementById('patient-dashboard').classList.remove('active');
        document.getElementById('doctor-dashboard').classList.remove('active');
        const activeRole = document.querySelector('.role-btn.active')?.dataset.role || 'PATIENT';
        this.fillDemoCredentials(activeRole);
    },

    _showDashboard(role) {
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('patient-dashboard').classList.remove('active');
        document.getElementById('doctor-dashboard').classList.remove('active');

        if (role === 'PATIENT') {
            document.getElementById('patient-dashboard').classList.add('active');
            document.getElementById('patient-user-name').textContent = this.currentUser.name;
            document.getElementById('patient-avatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
            PatientDashboard.init();
            return;
        }

        document.getElementById('doctor-dashboard').classList.add('active');
        document.getElementById('doctor-user-name').textContent = this.currentUser.name;
        document.getElementById('doctor-avatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
        DoctorDashboard.init();
    },
};
