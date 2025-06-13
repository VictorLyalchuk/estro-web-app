import React from 'react';
import { FormControl, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldComponentProps {
    label: string;
    name: string;
    value: string;
    id: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    autoComplete: string;
    showPassword: boolean;
    handlePasswordToggle: () => void;
}

const PasswordFieldComponent: React.FC<PasswordFieldComponentProps> = ({ label, name, id, value, onChange, error, autoComplete, showPassword, handlePasswordToggle }) => (
    <FormControl fullWidth >
        <TextField
            variant="standard"
            label={label}
            type={showPassword ? 'text' : 'password'}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            error={!!error}
            autoComplete={autoComplete}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handlePasswordToggle} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
        {error ? (
            <div className="h-6 text-xs text-red-500">Error: {error}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
    </FormControl>
);

export default PasswordFieldComponent;
