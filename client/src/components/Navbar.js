import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const dropdownRef = useRef();
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    // Apply dark mode
    useEffect(() => {
        document.body.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <h3 className="logo">HabitTracker</h3>

            <div className="nav-right">
                <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Tasks
                </NavLink>

                <NavLink to="/habits" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Habits
                </NavLink>

                {/* Dark mode toggle */}
                <button className="icon-btn" onClick={() => setDark(!dark)}>
                    {dark ? '☀️' : '🌙'}
                </button>

                {/* Profile dropdown */}
                <div className="profile" ref={dropdownRef}>
                    <div className="avatar" onClick={() => setOpen(!open)}>
                        👤
                    </div>

                    {open && (
                        <div className="dropdown">
                            <div className="dropdown-item">Profile</div>
                            <div className="dropdown-item">Settings</div>
                            <div className="dropdown-item logout" onClick={logout}>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
