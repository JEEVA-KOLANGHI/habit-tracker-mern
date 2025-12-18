import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import '../styles/auth.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            setError('');
            setLoading(true);

            await api.post('/auth/register', {
                name,
                email,
                password
            });

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {loading && <Loader />}

            <div className="auth-card">
                <h2>Create Account</h2>
                <p>Start tracking your tasks and habits</p>

                {error && <div className="auth-error">{error}</div>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSignup();
                    }}
                >
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Sign Up</button>
                </form>

                <div className="auth-link">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/')}>
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Signup;
