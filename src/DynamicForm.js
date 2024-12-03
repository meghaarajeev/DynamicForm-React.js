import React, { useState } from 'react';
import './DynamicForm.css'; // Updated CSS file

const DynamicForm = () => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [submittedData, setSubmittedData] = useState([]);
    const [progress, setProgress] = useState(0);

    const apiResponses = {
        userInfo: [
            { name: "firstName", type: "text", label: "First Name", required: true },
            { name: "lastName", type: "text", label: "Last Name", required: true },
            { name: "age", type: "number", label: "Age", required: false }
        ],
        addressInfo: [
            { name: "street", type: "text", label: "Street", required: true },
            { name: "city", type: "text", label: "City", required: true },
            { name: "state", type: "select", label: "State", options: ["California", "Texas", "New York"], required: true },
            { name: "zipCode", type: "text", label: "Zip Code", required: false }
        ],
        paymentInfo: [
            { name: "cardNumber", type: "text", label: "Card Number", required: true },
            { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
            { name: "cvv", type: "password", label: "CVV", required: true },
            { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
        ]
    };

    const handleSelectionChange = (e) => {
        const selectedForm = e.target.value;
        setFormFields(apiResponses[selectedForm] || []);
        setFormData({});
        setProgress(0);
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? [...(prevData[name] || []), value] : value,
        }));

        // Update progress
        const filledFields = Object.keys(formData).filter(key => formData[key]);
        setProgress((filledFields.length / formFields.length) * 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedData([...submittedData, formData]);
        alert("Form Submitted Successfully!");
        setFormData({});
        setProgress(0);
    };

    const renderForm = () => {
        return formFields.map((field) => {
            const { name, type, label, required, options } = field;
            const value = formData[name] || "";

            let input;
            if (type === "select") {
                input = (
                    <select
                        name={name}
                        className="form-input"
                        onChange={(e) => handleInputChange(e)}
                        required={required}
                    >
                        <option value="">Select...</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            } else if (type === "checkbox") {
                input = options.map((opt) => (
                    <div key={opt} className="checkbox-group">
                        <input
                            type="checkbox"
                            name={name}
                            value={opt}
                            className="form-input-checkbox"
                            onChange={(e) => handleInputChange(e, 'checkbox')}
                        />
                        <label>{opt}</label>
                    </div>
                ));
            } else {
                input = (
                    <input
                        type={type}
                        name={name}
                        className="form-input"
                        value={value}
                        onChange={(e) => handleInputChange(e)}
                        required={required}
                    />
                );
            }

            return (
                <div key={name} className="form-group">
                    <label className="form-label">{label}</label>
                    {input}
                </div>
            );
        });
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Dynamic Form</h1>
            <select className="form-select" onChange={handleSelectionChange}>
                <option value="">Select Form Type</option>
                <option value="userInfo">User Information</option>
                <option value="addressInfo">Address Information</option>
                <option value="paymentInfo">Payment Information</option>
            </select>

            <form className="dynamic-form" onSubmit={handleSubmit}>
                {renderForm()}
                <button type="submit" className="submit-button">Submit</button>
                <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">{progress.toFixed(0)}% completed</p>
            </form>

            {submittedData.length > 0 && (
    <table className="submitted-data-table">
        <thead>
            <tr><th>Submitted Data</th></tr>
        </thead>
        <tbody>
            {submittedData.map((data, index) => (
                <tr key={index}>
                    <td>
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                    </td>
                </tr>
            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DynamicForm;