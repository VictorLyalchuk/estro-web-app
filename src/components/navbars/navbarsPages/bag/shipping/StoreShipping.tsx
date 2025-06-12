import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { IStore } from '../../../../../interfaces/Store/IStore';
import '../../../../../satoshi.css';
import { ICity } from '../../../../../interfaces/Address/ICity';
import { ICountry } from '../../../../../interfaces/Address/ICountry';
import { useTranslation } from 'react-i18next';
import { getLocalizedField } from '../../../../../utils/localized/localized';

interface StoreShippingProps {
  countryOptions: ICountry[] | null;
  cityOptions: ICity[] | null;
  handleChangeShipping: (event: React.ChangeEvent<HTMLInputElement>) => void;
  shippingData: { country: string, city: string, state: string, street: string, }
  storeOptions: IStore[];
  errors: { country?: string; city?: string; street?: string };
}

const StoreShipping: React.FC<StoreShippingProps> = ({ countryOptions, cityOptions, shippingData, handleChangeShipping, storeOptions, errors }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const filteredCityOptions = cityOptions ? cityOptions.filter(city => city.countryName_en === shippingData.country) : [];
  const filteredStoreOptions = storeOptions.filter(store => store.city === shippingData.city);
  return (
    <div className="mt-5">
      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
        {t('Bag_StoreShipping_Country')}
      </label>
      <FormControl fullWidth variant="outlined">
        <TextField
          id="country"
          name="country"
          select
          value={shippingData.country}
          onChange={handleChangeShipping}
          error={!!errors.country}
        >
          {countryOptions && countryOptions.map((country, index) => (
            <MenuItem key={index} value={country.countryName_en}>
              {getLocalizedField(country, 'countryName', lang)}
            </MenuItem>
          ))}
        </TextField>
        {errors.country ? (
          <div className="h-6 text-xs text-red-500">Error: {errors.country}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
      </FormControl>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
        {t('Bag_StoreShipping_City')}
      </label>
      <FormControl fullWidth variant="outlined">
        <TextField
          id="city"
          name="city"
          select
          value={shippingData.city}
          onChange={handleChangeShipping}
          error={!!errors.city}
          disabled={!shippingData.country}
        >
          {filteredCityOptions && filteredCityOptions.map((city, index) => (
            <MenuItem key={index} value={city.cityName_en}>
              {getLocalizedField(city, 'cityName', lang)}
            </MenuItem>
          ))}
        </TextField>
        {errors.city ? (
          <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
      </FormControl>

      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
        {t('Bag_StoreShipping_Store')}
      </label>
      <FormControl fullWidth variant="outlined">
        <TextField
          id="street"
          name="street"
          select
          value={shippingData.street}
          onChange={handleChangeShipping}
          error={!!errors.street}
          disabled={!shippingData.city}
        >
          {filteredStoreOptions && filteredStoreOptions.map((store, index) => (
            <MenuItem key={index} value={`${store.name_en} ${store.address_en}`}>
              {getLocalizedField(store, 'name', lang)} {getLocalizedField(store, 'address', lang)}
            </MenuItem>
          ))}
        </TextField>
        {errors.street ? (
          <div className="h-6 text-xs text-red-500">Error: {errors.street}</div>
        ) : (<div className="h-6 text-xs "> </div>)}
      </FormControl>
    </div>
  );
};

export default StoreShipping;