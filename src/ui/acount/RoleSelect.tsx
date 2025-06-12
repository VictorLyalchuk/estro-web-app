import React from 'react';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { Roles } from '../../interfaces/Auth/Roles';

interface RoleSelectProps {
    rolesList: Roles[];
    selectedRole: Roles | null;
    handleRoleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { role?: string };
}

const RoleSelect: React.FC<RoleSelectProps> = ({
    rolesList,
    selectedRole,
    handleRoleChange,
    errors,
}) => {
    return (
        <FormControl fullWidth variant="outlined">
            <TextField
                id="RoleID"
                name="RoleID"
                select
                value={selectedRole?.id ?? ''}
                onChange={handleRoleChange}
                error={!!errors.role}
            >
                {rolesList.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                        {role.name}
                    </MenuItem>
                ))}
            </TextField>
            {errors.role ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.role}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default RoleSelect;
