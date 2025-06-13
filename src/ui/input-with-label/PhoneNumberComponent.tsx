import React from 'react';
import { FormControl, TextField } from "@mui/material";
import TextMaskCustom from '../../services/custom/phone-services';

interface PhoneFieldComponentProps {
    value: string;
    label: string;
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

const PhoneNumberComponent: React.FC<PhoneFieldComponentProps> = ({ value, label, id, onChange, error }) => (
    <FormControl fullWidth>
        <TextField
            variant="standard"
            label={label}
            name="textmask"
            id={id}
            value={value}
            onChange={onChange}
            InputProps={{ inputComponent: TextMaskCustom as any }}
            error={!!error}
            autoComplete="phone"
            placeholder='(099) 00-00-000'
        />
        {error ? (
            <div className="h-6 text-xs text-red-500">Error: {error}</div>
        ) : (
            <div className="h-6 text-xs"> </div>
        )}
    </FormControl>
);

export default PhoneNumberComponent;
