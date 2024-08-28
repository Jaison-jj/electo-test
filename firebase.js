import { getApps, initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getPerformance } from '@firebase/performance';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAHOVNnVJpVyMXWtQovXuG5_R6inDUVCp4',
  authDomain: 'electo-a4503.firebaseapp.com',
  projectId: 'electo-a4503',
  storageBucket: 'electo-a4503.appspot.com',
  messagingSenderId: '633486258225',
  appId: '1:633486258225:web:5222976f6821bce2b76510',
  measurementId: 'G-990QNGVYVJ',
};

let app;
let performance;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
  performance = getPerformance(app);
}

const auth = getAuth(app);

let analytics;

(async () => {
  const isAnalyticsSupported = await isSupported();
  if (isAnalyticsSupported) {
    analytics = getAnalytics(app);
  }
})();

export { analytics, auth, app as default, logEvent, performance };
