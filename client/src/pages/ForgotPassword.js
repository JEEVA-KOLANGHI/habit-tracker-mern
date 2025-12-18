import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!email.trim()) return;
        setSent(true);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Forgot Password</h2>
                <p>Enter your email to reset your password</p>

                {!sent ? (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button onClick={handleSubmit}>
                            Send Reset Link
                        </button>
                    </>
                ) : (
                    <>
                        <p style={{ color: 'green', textAlign: 'center' }}>
                            Reset link sent successfully
                        </p>

                        <div className="auth-link">
                            <span onClick={() => navigate('/')}>
                                Back to Login
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
