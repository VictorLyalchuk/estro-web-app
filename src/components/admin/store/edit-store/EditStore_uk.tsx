import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../../theme/theme';
import TextFieldComponent from '../../../../ui/input-with-label/TextFieldComponent';
import { useTranslation } from 'react-i18next';
import { AddStoreProps } from '../../../../interfaces/Store/AddStoreProps';
import CountrySelect from '../../../../ui/address-select/CountrySelect';
import CitySelect from '../../../../ui/address-select/CitySelect';

const AddStore_uk: React.FC<AddStoreProps> = (
    { onSubmit, formData, errors, handleChange, 
        countryOptions, selectedCountry, handleCountryChange,
        cityOptions, selectedCity, handleCityChange, handleCancel,  }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    return (
        <div className="bg-white p-5 rounded-md shadow-md mb-8 mt-8 ">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center ">
                <div className="pb-6 mt-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Stores_Edit_Store')}</h2>
                </div>
            </div>
            <div className="border-t">
                <form onSubmit={onSubmit}>
                    <div className="space-y-6">
                        <div className="border-b border-gray-900/10 pb-12">
                            <ThemeProvider theme={theme}>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                    <div className="sm:col-span-2">
                                        <label htmlFor="countryId" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Stores_Country')}
                                        </label>
                                        <CountrySelect
                                            countryOptions={countryOptions}
                                            selectedCountry={selectedCountry}
                                            handleCountryChange={handleCountryChange}
                                            errors={errors}
                                            lang={lang}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Stores_City')}
                                        </label>
                                        <CitySelect
                                            cityOptions={cityOptions}
                                            selectedCity={selectedCity}
                                            selectedCountry={selectedCountry}
                                            handleCityChange={handleCityChange}
                                            errors={errors}
                                            lang={lang}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="name_uk" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Stores_Location')}
                                        </label>
                                        <TextFieldComponent
                                            label=""
                                            name="name_uk"
                                            id="name_uk"
                                            value={formData.name_uk}
                                            onChange={handleChange}
                                            error={errors.name_uk ?? null}
                                            autoComplete="name_uk"
                                            maxLength={30}
                                            placeholder={''}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="address_uk" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Stores_Address')}
                                        </label>
                                        <TextFieldComponent
                                            label=""
                                            name="address_uk"
                                            id="address_uk"
                                            value={formData.address_uk}
                                            onChange={handleChange}
                                            error={errors.address_uk ?? null}
                                            autoComplete="address_uk"
                                            maxLength={30}
                                            placeholder={''}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Stores_workingHours')}
                                        </label>
                                        <TextFieldComponent
                                            label=""
                                            name="workingHours"
                                            id="workingHours"
                                            value={formData.workingHours}
                                            onChange={handleChange}
                                            error={errors.workingHours ?? null}
                                            autoComplete="workingHours"
                                            maxLength={30}
                                            placeholder="10:00 - 21:00"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="mapLink" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Stores_MapLink')}
                                        </label>
                                        <TextFieldComponent
                                            label=""
                                            name="mapLink"
                                            id="mapLink"
                                            value={formData.mapLink}
                                            onChange={handleChange}
                                            error={errors.mapLink ?? null}
                                            autoComplete="mapLink"
                                            maxLength={30}
                                            placeholder={''}
                                        />
                                    </div>
                                </div>
                            </ThemeProvider>

                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            className={`p-2 flex items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                            {t('Add_Product_Save')}
                        </button>
                        <button type="button" className="p-2 mr-3 flex items-center rounded-md border bg-gray-200 hover:bg-gray-300 justify-center px-8 py-2 text-sm font-semibold leading-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={handleCancel}>
                            {t('Add_Product_Cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddStore_uk;