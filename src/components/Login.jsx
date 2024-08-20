import { useState } from 'react';
import axios from 'axios';
import {Navigate, useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const navigate = useNavigate();

    if (localStorage.getItem('jwtToken')) {
        return <Navigate to="/calculator"/>
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/signin', {
                username,
                password,
            });
            const { jwtToken } = response.data;
            localStorage.setItem('jwtToken', jwtToken);
            navigate("/calculator");
        } catch (error) {
            console.error('Failed to login', error);
            alert('Login failed');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/newUser', {
                username: registerUsername,
                password: registerPassword,
            });
            setRegisterUsername('');
            setRegisterPassword('');
        } catch (error) {
            console.error('Failed to register new user', error);
            alert('Failed to register new user');
        }
    };

    return (
        <div className="container">
            <div>
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="spacer30px"/>
            <div>
                <h2>Register new user</h2>
                <form onSubmit={handleRegisterSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
