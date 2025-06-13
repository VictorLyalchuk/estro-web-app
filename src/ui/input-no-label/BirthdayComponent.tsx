import React from 'react';
import { FormControl, TextField } from "@mui/material";

interface BirthdayFieldComponentProps {
    birthday: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BirthdayComponent: React.FC<BirthdayFieldComponentProps> = ({ birthday, handleChange }) => (
    <FormControl fullWidth >
        <TextField
            variant="outlined"
            name="birthday"
            id="birthday"
            type="date"
            onChange={handleChange}
            value={birthday}
            InputLabelProps={{
                shrink: true,
            }}
            autoComplete="birthday"
            className="mt-1"
            size="small"
        />
    </FormControl>
);

export default BirthdayComponent;
