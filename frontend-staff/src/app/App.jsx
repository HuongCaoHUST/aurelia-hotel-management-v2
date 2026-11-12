import { useEffect, useState } from 'react';
import { authService } from './api.js';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { StaffStage } from '../features/stage/StaffStage.jsx';
import { LoginLayout } from './LoginLayout.jsx';
import './app.css';

export function App() {
  const [user, setUser] = useState(null);
  const [isRestoringSession, setRestoringSession] = useState(() => authService.hasSession());

  useEffect(() => {
    if (!authService.hasSession()) return undefined;

    let active = true;
    authService.currentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          authService.logout();
        }
      })
      .finally(() => {
        if (active) setRestoringSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isRestoringSession) {
    return <div className="auth-loading">Restoring session…</div>;
  }

  if (user) {
    return <StaffStage user={user} onLogout={async () => { await authService.logout(); setUser(null); }} />;
  }

  return <LoginPage onLogin={setUser} Layout={LoginLayout} />;
}
