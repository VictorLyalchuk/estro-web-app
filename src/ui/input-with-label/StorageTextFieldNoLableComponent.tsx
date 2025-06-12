import { FormControl, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

interface CardTextFieldNoLableComponentProps {
    label: string;
    name: string;
    id: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    maxDigits: number;
    autoComplete: string;
    inputType: 'digits' | 'letters';

}

const StorageTextFieldNoLableComponent: React.FC<CardTextFieldNoLableComponentProps> = ({ label, name, id, autoComplete, onChange, maxDigits, inputType }) => {
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
                onChange={handleChange}
                autoComplete={autoComplete}
                inputProps={{
                    maxLength: maxDigits
                }}
            />
        </FormControl>
    );
};

export default StorageTextFieldNoLableComponent;
