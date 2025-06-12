import { FormControl, TextField } from '@material-ui/core';
import React, { ChangeEvent, FocusEvent, useState } from 'react';

interface CardTextFieldNoLableComponentProps {
    name: string;
    id: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    autoComplete: string;
    maxDigits: number;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void; 
    inputType: 'digits' | 'letters'; 

}

const CardTextFieldNoLableComponent: React.FC<CardTextFieldNoLableComponentProps> = ({ name, id, value, onChange, error, autoComplete, maxDigits, onBlur, inputType  }) => {
    const [internalValue, setInternalValue] = useState(value);

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
                variant="standard"
                id={id}
                name={name}
                value={internalValue}
                onChange={handleChange}
                error={!!error}
                autoComplete={autoComplete}
                className="mt-1"
                size="small"
                inputProps={{
                    maxLength: maxDigits 
                }}
                onBlur={onBlur} 
            />
        </FormControl>
    );
};

export default CardTextFieldNoLableComponent;
