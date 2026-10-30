import { useState } from 'react';
import { authService } from '../../app/api.js';

export function LoginPage({ onLogin, Layout }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await authService.login({ email, password });
      onLogin(result.user);
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in. Please check your account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="login-panel-inner">
        <div className="brand brand-dark">
          <span className="brand-mark">A</span>
          <span>
            <strong>AURELIA</strong>
            <small>STAFF PORTAL</small>
          </span>
        </div>

        <div className="login-heading">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to continue</h2>
          <p>Access your hotel operations workspace.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@aureliahotel.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="password-label-row">
            <label htmlFor="password">Password</label>
            <button className="text-button" type="button">Forgot password?</button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="remember-row">
            <input type="checkbox" name="remember" />
            <span>Keep me signed in</span>
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="login-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="login-note">
          Need access? <button className="text-button" type="button">Contact your administrator</button>
        </p>

        <p className="copyright">© 2026 Aurelia Hotel Management</p>
      </div>
    </Layout>
  );
}
