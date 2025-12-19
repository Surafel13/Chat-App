import React, { useState, useEffect } from 'react';
import { sendDataToDatabase, subscribeToData } from '../firebase';

const FirebaseDemo = () => {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Load data immediately on component mount using the real-time listener
    useEffect(() => {
        console.log("ENV VARS:", import.meta.env);

        // We are listening to the 'demo-items' collection
        const unsubscribe = subscribeToData('demo-items', (data) => {
            console.log('Got data:', data);
            setItems(data);
        });

        // Cleanup listener when component unmounts
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setLoading(true);
        try {
            // Send data to 'demo-items' collection
            await sendDataToDatabase('demo-items', {
                text: inputValue,
                createdAt: new Date()
            });
            setInputValue(''); // Clear input
        } catch (error) {
            console.error("SEND ERROR:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Firebase Database Demo</h5>
                </div>
                <div className="card-body">
                    <p className="text-muted small mb-4">
                        Enter text below to send it to the 'demo-items' collection in Cloud Firestore.
                    </p>

                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter some data..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Data'}
                            </button>
                        </div>
                    </form>

                    <h6 className="border-bottom pb-2 mb-3">Live Data from Firestore:</h6>

                    {items.length === 0 ? (
                        <div className="text-center text-muted py-3">
                            No data found yet. Try adding something!
                        </div>
                    ) : (
                        <ul className="list-group">
                            {items.map((item) => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{item.text}</span>
                                    <span className="badge bg-secondary rounded-pill" style={{ fontSize: '0.7em' }}>
                                        {item.id.substring(0, 6)}...
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FirebaseDemo;
