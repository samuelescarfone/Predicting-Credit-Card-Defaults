
import { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        LIMIT_BAL: 50000,
        SEX: 1,
        EDUCATION: 2,
        MARRIAGE: 1,
        AGE: 30,
        PAY_0: 0,
        PAY_2: 0,
        PAY_3: 0,
        PAY_4: 0,
        PAY_5: 0,
        PAY_6: 0,
        BILL_AMT1: 0,
        BILL_AMT2: 0,
        BILL_AMT3: 0,
        BILL_AMT4: 0,
        BILL_AMT5: 0,
        BILL_AMT6: 0,
        PAY_AMT1: 0,
        PAY_AMT2: 0,
        PAY_AMT3: 0,
        PAY_AMT4: 0,
        PAY_AMT5: 0,
        PAY_AMT6: 0
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post('http://localhost:8000/predict', formData);
            setResult(response.data);
        } catch (err) {
            setError('Failed to get prediction. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const InputGroup = ({ label, name, type = "number", min, max, step = "1" }) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="glass-input"
                min={min}
                max={max}
                step={step}
            />
        </div>
    );

    const SelectGroup = ({ label, name, options }) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="glass-input"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Demographics Section */}
                <div className="glass-panel p-6 animate-fade-in">
                    <h3 className="text-xl mb-4 text-accent-primary">Demographics & Limit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputGroup label="Credit Limit" name="LIMIT_BAL" step="1000" />
                        <InputGroup label="Age" name="AGE" min="18" max="100" />
                        <SelectGroup
                            label="Sex"
                            name="SEX"
                            options={[
                                { value: 1, label: 'Male' },
                                { value: 2, label: 'Female' }
                            ]}
                        />
                        <SelectGroup
                            label="Education"
                            name="EDUCATION"
                            options={[
                                { value: 1, label: 'Graduate School' },
                                { value: 2, label: 'University' },
                                { value: 3, label: 'High School' },
                                { value: 4, label: 'Others' }
                            ]}
                        />
                        <SelectGroup
                            label="Marriage Status"
                            name="MARRIAGE"
                            options={[
                                { value: 1, label: 'Married' },
                                { value: 2, label: 'Single' },
                                { value: 3, label: 'Others' }
                            ]}
                        />
                    </div>
                </div>

                {/* Payment History Section */}
                <div className="glass-panel p-6 animate-fade-in delay-100">
                    <h3 className="text-xl mb-4 text-accent-primary">Repayment Status (Last 6 Months)</h3>
                    <p className="text-sm text-gray-400 mb-4">-1=Pay Duly, 1=Delay 1m, 2=Delay 2m, ...</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6'].map((pay, idx) => (
                            <InputGroup key={pay} label={`Month ${idx + 1} ago`} name={pay} min="-2" max="9" />
                        ))}
                    </div>
                </div>

                {/* Bill Amounts Section */}
                <div className="glass-panel p-6 animate-fade-in delay-200">
                    <h3 className="text-xl mb-4 text-accent-primary">Bill Amounts</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['BILL_AMT1', 'BILL_AMT2', 'BILL_AMT3', 'BILL_AMT4', 'BILL_AMT5', 'BILL_AMT6'].map((bill, idx) => (
                            <InputGroup key={bill} label={`Bill ${idx + 1}`} name={bill} />
                        ))}
                    </div>
                </div>

                {/* Payment Amounts Section */}
                <div className="glass-panel p-6 animate-fade-in delay-300">
                    <h3 className="text-xl mb-4 text-accent-primary">Previous Payments</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['PAY_AMT1', 'PAY_AMT2', 'PAY_AMT3', 'PAY_AMT4', 'PAY_AMT5', 'PAY_AMT6'].map((amt, idx) => (
                            <InputGroup key={amt} label={`Paid ${idx + 1}`} name={amt} />
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-4 animate-fade-in delay-300">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary text-lg px-12 py-4 w-full md:w-auto"
                    >
                        {loading ? 'Analyzing...' : 'Predict Default Risk'}
                    </button>
                </div>

            </form>

            {/* Results Section */}
            {result && (
                <div className="mt-8 glass-panel p-8 animate-fade-in border-2 border-opacity-50"
                    style={{ borderColor: result.prediction === 1 ? 'var(--danger)' : 'var(--success)' }}>
                    <h2 className="text-3xl text-center mb-6">Prediction Result</h2>

                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className={`text-4xl font-bold ${result.prediction === 1 ? 'text-red-500' : 'text-green-500'}`}>
                            {result.prediction === 1 ? 'High Risk of Default' : 'Low Risk of Default'}
                        </div>

                        <div className="w-full max-w-md mt-4">
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Safety Score</span>
                                <span>{Math.round(result.probability_no_default * 100)}%</span>
                            </div>
                            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${result.probability_no_default * 100}%`,
                                        background: `linear-gradient(90deg, var(--danger), var(--success))`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>High Risk</span>
                                <span>Safe</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center animate-fade-in">
                    {error}
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
