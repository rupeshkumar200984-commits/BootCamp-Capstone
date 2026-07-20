import React from 'react';

function InputField({ label, type = 'text', value, onChange, placeholder, required = false, isTextArea = false, rows = 3 }) {
    return (
        <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#AAAAAA' }}>{label}</label>
            {isTextArea ? (
                <textarea 
                    className="form-control" 
                    rows={rows} 
                    value={value} 
                    onChange={onChange} 
                    placeholder={placeholder} 
                    required={required}
                />
            ) : (
                <input 
                    className="form-control" 
                    type={type} 
                    value={value} 
                    onChange={onChange} 
                    placeholder={placeholder} 
                    required={required}
                />
            )}
        </div>
    );
}

export default InputField;