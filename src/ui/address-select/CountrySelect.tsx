import React from 'react';
import { FormControl, MenuItem, TextField } from '@mui/material';
import { getLocalizedField } from '../../utils/localized/localized';
import { ICountry } from '../../interfaces/Address/ICountry';

interface CountrySelectProps {
    countryOptions: ICountry[];
    selectedCountry: ICountry | null;
    handleCountryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { country?: string };
    lang: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
    countryOptions,
    selectedCountry,
    handleCountryChange,
    errors,
    lang
}) => {
    return (
        <FormControl fullWidth>
            <TextField
                variant="standard"
                id="countryId"
                name="countryId"
                select
                value={selectedCountry?.id ?? ''}
                onChange={handleCountryChange}
                error={!!errors.country}
            >
                {countryOptions.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                        {getLocalizedField(country, 'countryName', lang)}
                    </MenuItem>
                ))}
            </TextField>
            {errors.country ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.country}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default CountrySelect;
