import React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { getLocalizedField } from '../../utils/localized/localized';
import { IProductFilters } from '../../interfaces/Info/IInfo';

interface CheckboxGroupProps {
    sizes: IProductFilters[];
    selectedSizes: IProductFilters[]; 
    lang: string;
    handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ sizes, selectedSizes, handleCheckboxChange, lang, error }) => (
    <div>
        <FormGroup row>
            {sizes.map((size) => (
                <FormControlLabel
                    key={size.id}
                    label={getLocalizedField(size, 'name', lang)}
                    control={
                        <Checkbox
                        onChange={handleCheckboxChange}
                        value={size.name_en}
                        color="primary"
                        checked={selectedSizes.some(selected => selected.id === size.id)}
                        />
                    }
                />
            ))}
        </FormGroup>
        {error ? (
            <div className="h-6 text-xs text-red-500">Error: {error}</div>
        ) : (
            <div className="h-6 text-xs"> </div>
        )}
    </div>
);

export default CheckboxGroup;