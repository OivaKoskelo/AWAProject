import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/board');
    } else {
      setError('Invalid Email or password');
    }
  };
  // Honestly I'm questioning a bit do I even need to comment on most of my stuff 
  // because I try to use clear naming schemes for variables and functions
  return (
    <div className="container">
      <h4>Login</h4>
      <form onSubmit={handleLogin}>
        <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
        </div>
        <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setpassword(e.target.value)}
              required
            />
        </div>
        <button className="btn" type="submit">Login</button>
        {error && <div className="red-text">{error}</div>}
      </form>
    </div>
  );
}

export default LoginPage

