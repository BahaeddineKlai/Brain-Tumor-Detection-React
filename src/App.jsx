import React, { useState, useCallback } from 'react';

// CONFIGURATION: Ensure this matches your running FastAPI port
const API_URL = 'http://127.0.0.1:8000';

const App = () => {
    // State management
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle image selection
    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (JPEG, PNG).');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            // Reset previous state
            setPrediction(null);
            setError('');
        }
    }, []);

    // Send image to FastAPI
    const handlePredict = async () => {
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // Try to get error message from server, fallback to status text
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Server Error: ${response.statusText}`);
            }

            const result = await response.json();
            setPrediction(result);
        } catch (err) {
            console.error('Prediction failed:', err);
            setError(`Failed to connect to the server at ${API_URL}. Is your backend running?`);
        } finally {
            setLoading(false);
        }
    };

    // Helper to determine badge color based on confidence
    const getConfidenceColor = (conf) => {
        if (conf >= 0.9) return 'bg-green-600';
        if (conf >= 0.7) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
                        Brain Tumor Classifier
                    </h1>
                    <p className="mt-2 text-lg text-gray-500">
                        Upload an MRI scan to analyze potential anomalies.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
                    {/* Left Column: Upload & Preview */}
                    <div className="flex flex-col space-y-6">
                        <div className="w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-full w-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, or JPEG</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Right Column: Controls & Results */}
                    <div className="flex flex-col justify-center space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Predict Button */}
                        <button
                            onClick={handlePredict}
                            disabled={loading || !selectedFile}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all
                                ${loading || !selectedFile
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Image...
                                </span>
                            ) : 'Analyze MRI Scan'}
                        </button>

                        {/* Results Card */}
                        {prediction && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-fade-in-up">
                                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Diagnostic Result</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Predicted Class:</span>
                                        <span className="text-xl font-bold text-gray-800">{prediction.prediction}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Model Confidence:</span>
                                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold shadow-sm ${getConfidenceColor(prediction.confidence_value)}`}>
                                            {prediction.confidence}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-400 mt-4 text-center">
                                        Filename: {prediction.filename}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;