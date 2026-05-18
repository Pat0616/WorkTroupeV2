import { useState } from 'react';
import './subscribe.css';

import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    name: 'Monthly',
    price: '₱50',
    duration: '1 Month',
    features: [
      '1 Workspace',
      '10 Tasks per Workspace',
      'Basic Analytics',
    ],
    badge: 'Starter',
  },
  {
    name: 'Standard',
    price: '₱240',
    duration: '6 Months',
    features: [
      '3 Workspaces',
      '50 Tasks per Workspace',
      'Team Collaboration',
    ],
    badge: 'Popular',
    featured: true,
  },
  {
    name: 'Premium',
    price: '₱410',
    duration: '1 Year',
    features: [
      'Unlimited Workspaces',
      'Unlimited Tasks',
      'Priority Support',
    ],
    badge: 'Best Value',
  },
];

type Step = 'select' | 'confirm' | 'success';

export default function SubscribePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('select');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedPlan = PLANS.find(
    (plan) => plan.name === selected
  );

  // TEMPORARY MOCK PAYMENT
  // Backend/API removed for UI testing
  const handleFakePayment = async () => {
    setLoading(true);

    // fake loading animation
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1800);
  };

  const GotoHome = async() =>
  {
    navigate("/home");
  }


  return (
    <div className="subscribe-page">
      <div className="subscribe-container">

        {/* HEADER */}
        <div className="subscribe-header">

          <div className="logo">
            ✦ Work Troupe
          </div>

          <h1>
            Upgrade your productivity
          </h1>

          <p>
            Choose a plan that fits your workflow
            and unlock premium features.
          </p>

        </div>

        {/* PLAN SELECTION */}
        {step === 'select' && (
          <>
            <div className="plans-grid">

              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`plan-card
                    ${selected === plan.name ? 'active' : ''}
                    ${plan.featured ? 'featured' : ''}
                  `}
                  onClick={() => setSelected(plan.name)}
                >

                  <div className="plan-badge">
                    {plan.badge}
                  </div>

                  <div className="plan-top">

                    <h2>
                      {plan.name}
                    </h2>

                    <div className="plan-price">
                      {plan.price}
                    </div>

                    <div className="plan-duration">
                      {plan.duration}
                    </div>

                  </div>

                  <div className="plan-features">

                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="feature"
                      >
                        ✓ {feature}
                      </div>
                    ))}

                  </div>

                </div>
              ))}

            </div>

            <button
              className="continue-btn"
              disabled={!selected}
              onClick={() => setStep('confirm')}
            >
              Continue
            </button>
          </>
        )}

        {/* CONFIRMATION */}
        {step === 'confirm' && selectedPlan && (
          <div className="confirm-card">

            <div className="confirm-badge">
              Selected Plan
            </div>

            <h2>
              {selectedPlan.name}
            </h2>

            <div className="confirm-price">
              {selectedPlan.price}
            </div>

            <p className="confirm-duration">
              {selectedPlan.duration}
            </p>

            <div className="prototype-box">
              This is a prototype payment flow.<br />
              No real transaction will occur.
            </div>

            <div className="confirm-actions">

              <button
                className="secondary-btn"
                onClick={() => setStep('select')}
              >
                Back
              </button>

              <button
                className="primary-btn"
                onClick={handleFakePayment}
                disabled={loading}
              >
                {loading
                  ? 'Processing...'
                  : 'Simulate Payment'}
              </button>

            </div>

          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="success-card" onClick={GotoHome}>

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Subscription Activated
            </h2>

            <p>
              Your premium plan is now active.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}