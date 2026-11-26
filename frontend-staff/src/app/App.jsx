import { useState } from 'react';
import { authService } from './api.js';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { StaffStage } from '../features/stage/StaffStage.jsx';
import { LoginLayout } from './LoginLayout.jsx';
import './app.css';

export function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return <StaffStage user={user} onLogout={async () => { await authService.logout(); setUser(null); }} />;
  }

  return <LoginPage onLogin={setUser} Layout={LoginLayout} />;
}
