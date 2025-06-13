import React from 'react';
import { FormControl, MenuItem, TextField } from '@mui/material';
import { Roles } from '../../interfaces/Auth/Roles';

interface RoleSelectProps {
    authTypeList: Roles[];
    selectedAuthType: Roles | null;
    handleAuthTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { authType?: string };
}

const AuthTypeSelect: React.FC<RoleSelectProps> = ({
    authTypeList,
    selectedAuthType,
    handleAuthTypeChange,
    errors,
}) => {
    return (
        <FormControl fullWidth>
            <TextField
                variant="standard"
                id="authTypeId"
                name="authTypeId"
                select
                value={selectedAuthType?.id ?? ''}
                onChange={handleAuthTypeChange}
                error={!!errors.authType}
            >
                {authTypeList.map(authType => (
                    <MenuItem key={authType.id} value={authType.id}>
                        {authType.name}
                    </MenuItem>
                ))}
            </TextField>
            {errors.authType ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.authType}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default AuthTypeSelect;
