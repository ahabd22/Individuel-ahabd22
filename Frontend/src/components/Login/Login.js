import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, error } = useGlobalContext()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, password)
        if (!error) {
            navigate('/')
        }
    }

    return (
        <LoginStyled>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </form>
        </LoginStyled>
    )
}

const LoginStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #F5F5F5;

    form {
        background: white;
        padding: 2rem;
        border-radius: 5px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        width: 300px;

        h2 {
            text-align: center;
            margin-bottom: 1rem;
        }

        input {
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 3px;
        }

        button {
            width: 100%;
            padding: 0.5rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;

            &:hover {
                background: #0056b3;
            }
        }

        .error {
            color: red;
            margin-bottom: 1rem;
        }
    }
`

export default Login