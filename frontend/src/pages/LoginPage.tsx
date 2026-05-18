import { useState } from 'react';
import './login.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMPORARY MOCK LOGIN
    alert('Login UI prototype');
  };

  return (
    <div className="login-page">

      <div className="login-glow login-glow-1"></div>
      <div className="login-glow login-glow-2"></div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-left">

          <div className="login-brand">
            ✦ Work Troupe
          </div>

          <h1>
            Welcome back
          </h1>

          <p>
            Organize tasks, collaborate with your team,
            and stay productive with your workspace.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span>✓</span>
              Smart team collaboration
            </div>

            <div className="login-feature">
              <span>✓</span>
              Real-time task management
            </div>

            <div className="login-feature">
              <span>✓</span>
              Beautiful productivity dashboard
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="login-card">

          <div className="login-card-top">

            <div className="login-badge">
              Sign In
            </div>

            <h2>
              Access your account
            </h2>

            <p>
              Enter your credentials to continue.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <div className="input-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="you@example.com"
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>

              </div>

            </div>

            <div className="login-options">

              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="forgot-btn"
              >
                Forgot password?
              </button>

            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Sign In
            </button>

          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">

            <button className="social-btn">
              Google
            </button>

            <button className="social-btn">
              GitHub
            </button>

          </div>

          <div className="signup-link">

            Don&apos;t have an account?

            <button type="button">
              Create Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}