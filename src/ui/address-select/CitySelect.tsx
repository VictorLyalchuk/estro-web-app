import React from 'react';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { getLocalizedField } from '../../utils/localized/localized';
import { ICountry } from '../../interfaces/Address/ICountry';
import { ICity } from '../../interfaces/Address/ICity';

interface CitySelectProps {
    cityOptions: ICity[];
    selectedCity: ICity | null;
    selectedCountry: ICountry | null;
    handleCityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { city?: string };
    lang: string;
}

const CitySelect: React.FC<CitySelectProps> = ({
    cityOptions,
    selectedCity,
    selectedCountry,
    handleCityChange,
    errors,
    lang
}) => {
    return (
        <FormControl fullWidth variant="outlined">
            <TextField
                id="cityId"
                name="cityId"
                select
                value={selectedCity?.id ?? ''}
                onChange={handleCityChange}
                error={!!errors.city}
            >
                {cityOptions
                    .filter(city => !selectedCountry || selectedCountry?.id === city.countryId)
                    .map(city => (
                        <MenuItem key={city.id} value={city.id}>
                            {getLocalizedField(city, 'cityName', lang)}
                        </MenuItem>
                    ))}
            </TextField>
            {errors.city ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default CitySelect;
