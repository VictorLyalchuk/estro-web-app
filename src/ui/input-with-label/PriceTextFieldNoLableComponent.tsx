import { FormControl, TextField } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from 'react';

interface CardTextFieldNoLableComponentProps {
    label: string;
    name: string;
    id: string;
    value: string | number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    maxDigits: number;
    autoComplete: string;
    inputType: 'digits' | 'letters';

}

const PriceTextFieldNoLableComponent: React.FC<CardTextFieldNoLableComponentProps> = ({ label, name, id, value, autoComplete, onChange, error, maxDigits, inputType }) => {
    const [internalValue, setInternalValue] = useState(String(value));

    useEffect(() => {
        setInternalValue(String(value));
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value;

        if (inputType === 'digits') {
            inputValue = inputValue.replace(/\D/g, '');
        } else if (inputType === 'letters') {
            inputValue = inputValue.replace(/[^A-Za-z\s']/g, '');
        }

        if (inputValue.length > maxDigits) {
            inputValue = inputValue.slice(0, maxDigits);
        }

        setInternalValue(inputValue);
        event.target.value = inputValue;
        onChange(event);
    };

    return (
        <FormControl fullWidth>
            <TextField
                label={label}
                variant="standard"
                id={id}
                name={name}
                value={internalValue}
                onChange={handleChange}
                error={!!error}
                autoComplete={autoComplete}
                inputProps={{
                    maxLength: maxDigits
                }}
            />
            {error ? (
                <div className="h-6 text-xs text-red-500">Error: {error}</div>
            ) : (
                <div className="h-6 text-xs"> </div>
            )}
        </FormControl>
    );
};

export default PriceTextFieldNoLableComponent;
