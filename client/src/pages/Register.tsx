import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try{
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            //Auto Login after registering
            const loginSuccess = await login(email, password);
            if (loginSuccess) {
                navigate('/');
            } else {
                setError('Login failed after registration');
            }
            
        } catch(err: any) {
            setError(err.message || 'Something went wrong');
        }


    };

    return (
        <div className='container'>
            <h4>Register</h4>
            <form onSubmit={handleRegister}>
                <div className='input-field'>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='input-field'>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='input-field'>
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='btn' type='submit'>Register</button>
                {error && <div className="red-text">{error}</div>}
            </form>
        </div>
    );
};

export default RegisterPage;