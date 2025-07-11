import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className='purple'>
            <div className='nav-wrapper container'>
                <Link to="/board" className='brand-logo left'>Kanban Board</Link>
                <ul className='right'>
                    {user ? (
                        <>
                            <li><span style={{ marginRight: '15px' }}>{user.username}</span></li>
                            <li>
                                <button className='btn red lighten-1' onClick={() => {
                                    logout();
                                }}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>  
                            {/* should show only the login or register when nobody is logged in or when not already on that / */}
                            {location.pathname !== '/login' && <li><Link to="/login" className='btn'>Login</Link></li>}
                            {location.pathname !== '/register' && <li><Link to="/register" className='btn'>Register</Link></li>}
                        </>
                    )}
                </ul> 
            </div>
        </nav>
    );
};

export default Navbar;