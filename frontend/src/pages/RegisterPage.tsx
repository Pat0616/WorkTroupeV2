import { useState } from 'react';
import './register.css'

export default function RegisterPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleRegister = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // TEMPORARY MOCK REGISTER
    alert('Register UI prototype');
  };

  return (
    <div className="register-page">

      {/* BACKGROUND GLOWS */}
      <div className="register-glow register-glow-1"></div>
      <div className="register-glow register-glow-2"></div>

      <div className="register-container">

        {/* LEFT SIDE */}
        <div className="register-left">

          <div className="register-brand">
            ✦ Work Troupe
          </div>

          <h1>
            Create your workspace
          </h1>

          <p>
            Start organizing your projects,
            collaborating with your team,
            and boosting productivity with
            a modern workflow platform.
          </p>

          <div className="register-features">

            <div className="register-feature">
              <span>✓</span>
              Unlimited task organization
            </div>

            <div className="register-feature">
              <span>✓</span>
              Team collaboration tools
            </div>

            <div className="register-feature">
              <span>✓</span>
              Smart productivity dashboard
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="register-card">

          <div className="register-card-top">

            <div className="register-badge">
              Create Account
            </div>

            <h2>
              Join Work Troupe
            </h2>

            <p>
              Create your account to continue.
            </p>

          </div>

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* FULL NAME */}
            <div className="input-group">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Juan Dela Cruz"
              />

            </div>

            {/* EMAIL */}
            <div className="input-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="you@example.com"
              />

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">

              <label>Confirm Password</label>

              <div className="password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

            </div>

            {/* TERMS */}
            <label className="terms-check">

              <input type="checkbox" />

              <span>
                I agree to the Terms of Service
                and Privacy Policy
              </span>

            </label>

            {/* BUTTON */}
            <button
              type="submit"
              className="register-btn"
            >
              Create Account
            </button>

          </form>

          {/* DIVIDER */}
          <div className="register-divider">
            <span>or continue with</span>
          </div>

          {/* SOCIALS */}
          <div className="social-buttons">

            <button className="social-btn">
              Google
            </button>

            <button className="social-btn">
              GitHub
            </button>

          </div>

          {/* LOGIN LINK */}
          <div className="login-link">

            Already have an account?

            <button type="button">
              Sign In
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}