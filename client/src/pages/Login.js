import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import '../styles/auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError('');
            setLoading(true);

            const res = await api.post('/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {loading && <Loader />}

            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Login to manage your tasks and habits</p>

                {error && <div className="auth-error">{error}</div>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
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

                    <button type="submit">Login</button>
                </form>

                <div className="auth-link">
                    <span onClick={() => navigate('/forgot-password')}>
                        Forgot password?
                    </span>
                </div>

                <div className="auth-link">
                    New user?{' '}
                    <span onClick={() => navigate('/signup')}>
                        Create an account
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
