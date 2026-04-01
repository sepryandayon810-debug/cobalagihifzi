/**
 * ============================================
 * HIFZI CELL - MAIN APP (v3.1 STABLE)
 * FIXED: Firebase Listener, AutoSync, Async Loop
 * ============================================
 */

import { getDataManager } from './data/index.js';
import { getAuthService, getKasirService, getCloudConfigService, getSettingsService, getPOSService, getCashService } from './services/index.js';
import { getToastManager, getHeaderManager, getNavigationGuard } from './ui/index.js';
import { getThemeService } from './services/ThemeService.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { 
  getDatabase, ref, onValue, set, push, update, remove,
  get, query, orderByChild, equalTo
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

import { AutoConfigSync } from './core/AutoConfigSync.js';

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "goodhifzicell.firebaseapp.com",
  databaseURL: "https://goodhifzicell-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "goodhifzicell",
  storageBucket: "goodhifzicell.appspot.com",
  messagingSenderId: "306835710868",
  appId: "1:306835710868:web:xxxx"
};

class HifziApp {
    constructor() {
        this.themeService = getThemeService();
        this.dataManager = getDataManager();
        this.authService = getAuthService();
        this.kasirService = getKasirService();
        this.cloudConfigService = getCloudConfigService();
        this.settingsService = getSettingsService();
        this.posService = getPOSService();
        this.cashService = getCashService();

        this.toastManager = getToastManager();
        this.headerManager = getHeaderManager();
        this.navigationGuard = getNavigationGuard();

        this.currentUser = null;

        // Firebase
        this.firebaseApp = null;
        this.firebaseDB = null;
        this.firebaseConnected = false;
        this.firebaseListeners = new Map();
        this.useFirebase = false;

        // AutoSync
        this.autoSync = null;

        window.app = this;
    }

    async init() {
        try {
            this.themeService.init();
            await this.initFirebase();

            this.dataManager.init();
            this.cashService.init();

            const user = this.authService.init();

            if (user) {
                this.currentUser = user;
                await this.handleLoggedIn();
            } else {
                this.showLogin();
            }

            this.setupEventListeners();

        } catch (err) {
            console.error(err);
        }
    }

    // =========================
    // FIREBASE INIT (SAFE)
    // =========================
    async initFirebase() {
        try {
            if (this.firebaseApp) {
                console.log('[Firebase] Already initialized');
                return;
            }

            this.firebaseApp = initializeApp(firebaseConfig);
            this.firebaseDB = getDatabase(this.firebaseApp);

            const connectedRef = ref(this.firebaseDB, '.info/connected');

            onValue(connectedRef, (snap) => {
                this.firebaseConnected = snap.val();
                console.log('[Firebase]', this.firebaseConnected ? 'ONLINE' : 'OFFLINE');
            });

            this.useFirebase = true;

        } catch (err) {
            console.error('[Firebase Error]', err);
            this.useFirebase = false;
        }
    }

    // =========================
    // INIT FIREBASE FEATURES (ANTI DOUBLE)
    // =========================
    async initFirebaseFeatures() {
        if (!this.useFirebase || !this.currentUser) return;

        if (this.firebaseListeners.size > 0) {
            console.log('[Firebase] Already running');
            return;
        }

        this.setupFirebaseListeners();

        if (!this.autoSync) {
            this.autoSync = new AutoConfigSync(this.firebaseDB, this.currentUser);
            await this.autoSync.start();
        }
    }

    // =========================
    // LISTENER
    // =========================
    setupFirebaseListeners() {
        const userId = this.currentUser.id;

        const cashQuery = query(
            ref(this.firebaseDB, 'cash_in_hand'),
            orderByChild('userId'),
            equalTo(userId)
        );

        const unsubCash = onValue(cashQuery, (snap) => {
            const data = this.snapshotToArray(snap);
            localStorage.setItem('cash', JSON.stringify(data));
            this.headerManager.update();
        });

        this.firebaseListeners.set('cash', unsubCash);

        console.log('[Firebase] Listener ready');
    }

    // =========================
    // CRUD
    // =========================
    async firebaseAdd(path, data) {
        if (!this.firebaseConnected) return;

        const newRef = push(ref(this.firebaseDB, path));

        await set(newRef, {
            ...data,
            id: newRef.key,
            createdAt: new Date().toISOString()
        });
    }

    async firebaseUpdate(path, id, data) {
        if (!this.firebaseConnected) return;

        await update(ref(this.firebaseDB, `${path}/${id}`), {
            ...data,
            updatedAt: new Date().toISOString()
        });
    }

    async firebaseDelete(path, id) {
        if (!this.firebaseConnected) return;

        await remove(ref(this.firebaseDB, `${path}/${id}`));
    }

    // =========================
    // SYNC QUEUE FIX
    // =========================
    async processPendingSyncs() {
        const queue = JSON.parse(localStorage.getItem('queue') || '[]');
        const failed = [];

        for (const item of queue) {
            try {
                if (item.action === 'add') {
                    await this.firebaseAdd(item.path, item.data);
                }
            } catch (err) {
                failed.push(item);
            }
        }

        localStorage.setItem('queue', JSON.stringify(failed));
    }

    snapshotToArray(snapshot) {
        if (!snapshot.exists()) return [];
        return Object.entries(snapshot.val()).map(([id, val]) => ({ id, ...val }));
    }

    // =========================
    // CLEANUP
    // =========================
    cleanupFirebaseListeners() {
        this.firebaseListeners.forEach((fn, key) => {
            if (typeof fn === 'function') {
                fn();
                console.log('cleaned:', key);
            }
        });
        this.firebaseListeners.clear();
    }

    // =========================
    // LOGIN FLOW
    // =========================
    async handleLoggedIn() {
        if (this.useFirebase) {
            await this.initFirebaseFeatures();
        }

        this.headerManager.update();
        this.navigateTo('pos');
    }

    showLogin() {
        console.log('show login');
    }

    navigateTo(module) {
        console.log('go to', module);
    }

    setupEventListeners() {
        window.addEventListener('beforeunload', () => {
            this.cleanupFirebaseListeners();
        });
    }
}

const app = new HifziApp();
app.init();
