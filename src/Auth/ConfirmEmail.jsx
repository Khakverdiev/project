import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams  } from 'react-router-dom';

const ConfirmEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:5175/api/v1/account/ConfirmEmail',
                    {}, // пустое тело
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                
                setMessage('Your email has been confirmed! You can now log in.');
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                console.error('Error confirming email:', err);
                setError('An error occurred while confirming your email. Please try again later.');
                setMessage('');
            }
        };

        confirmEmail();
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-6 text-center">Confirm Email</h1>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
                <p className="text-gray-600 text-sm text-center">Please wait while we confirm your email.</p>
            </div>
        </div>
    );
};

export default ConfirmEmail;