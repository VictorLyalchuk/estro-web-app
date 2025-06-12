import { FormControl, TextField } from '@material-ui/core';

interface LongTextFieldComponentProps {
    label: string;
    name: string;
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    autoComplete: string;
}

const LongTextFieldComponents: React.FC<LongTextFieldComponentProps> = ({ label, name, id, value, onChange, error, autoComplete }) => (
        <FormControl fullWidth >
            <TextField
                variant="outlined"
                label={label}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                error={!!error}
                multiline
                minRows={7}
                autoComplete={autoComplete}
            />
            {error ? (
                <div className="h-6 text-xs text-red-500">Error: {error}</div>
            ) : (
                <div className="h-6 text-xs"> </div>
            )}
        </FormControl>
);

export default LongTextFieldComponents;
