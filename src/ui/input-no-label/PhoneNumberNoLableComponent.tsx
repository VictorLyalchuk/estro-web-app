import React from 'react';
import { FormControl, TextField } from '@material-ui/core';
import TextMaskCustom from '../../services/custom/phone-services';



interface PhoneFieldNoLableComponentProps {
    value: string;
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

const PhoneNumberNoLableComponent: React.FC<PhoneFieldNoLableComponentProps> = ({ value, id, onChange, error }) => (
    <FormControl fullWidth>
        <TextField
            name="textmask"
            id={id}
            value={value}
            onChange={onChange}
            InputProps={{inputComponent: TextMaskCustom as any}}
            error={!!error}
            autoComplete="phone"
            className="mt-1"
            size="small"
            placeholder='(099) 00-00-000'
        />
        {error ? (
            <div className="h-6 text-xs text-red-500">Error: {error}</div>
        ) : (
            <div className="h-6 text-xs"> </div>
        )}
    </FormControl>
);

export default PhoneNumberNoLableComponent;