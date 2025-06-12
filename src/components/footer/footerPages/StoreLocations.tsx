import { useEffect, useState } from 'react';
import { IStore } from '../../../interfaces/Store/IStore';
import { getCity, getCountry, getStore } from '../../../services/shipping/shipping-services';
import { ICity } from '../../../interfaces/Address/ICity';
import { ICountry } from '../../../interfaces/Address/ICountry';
import { getLocalizedField } from '../../../utils/localized/localized';
import { useTranslation } from 'react-i18next';

const StoreLocations = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const languageToCountryMap: { [key: string]: string } = {
    en: 'England',
    uk: 'Ukraine',
    es: 'Spain',
    fr: 'France',
  };
  const defaultCountry = languageToCountryMap[lang] || 'Ukraine';
  const [storeOptions, setStoreOptions] = useState<IStore[]>([]);
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);
  const [countryOptions, setCountryOptions] = useState<ICountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(defaultCountry);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    getStore().then(resp => setStoreOptions(resp));
    getCity().then(resp => setCityOptions(resp));
    getCountry().then(resp => setCountryOptions(resp));
  }, []);

  const filteredCities = selectedCountry
    ? cityOptions.filter(city => city.countryName_en === selectedCountry)
    : [];

  const filteredStores = selectedCity
    ? storeOptions.filter(store => store.city === selectedCity)
    : storeOptions.filter(store => {
      const city = cityOptions.find(c => c.cityName_en === store.city);
      return city && city.countryName_en === selectedCountry;
    });

  const getCountryName = (country: ICountry) => {
    switch (lang) {
      case 'uk':
        return country.countryName_uk;
      case 'en':
        return country.countryName_en;
      case 'es':
        return country.countryName_es;
      case 'fr':
        return country.countryName_fr;
      default:
        return country.countryName_en;
    }
  };

  const getCityName = (city: ICity | string) => {
    if (typeof city === 'string') return city;
    switch (lang) {
      case 'uk':
        return city.cityName_uk;
      case 'en':
        return city.cityName_en;
      case 'es':
        return city.cityName_es;
      case 'fr':
        return city.cityName_fr;
      default:
        return city.cityName_en;
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-[900px]">
        <div className="text-gray-700 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 text-center p-8">
          <h2 className="text-4xl font-bold mb-4 text-center">Estro {t('Store_Locations')}</h2>

          {/* Country Selection */}
          <div className="p-4 bg-transparent cursor-pointer">
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              {countryOptions.map((country) => (
                <a
                  key={country.id}
                  onClick={() => {
                    setSelectedCountry(country.countryName_en);
                    setSelectedCity(null);
                  }}
                  className={`text-gray-700 py-1 px-4 sm:px-2 w-auto rounded-md focus:outline-none hover:text-indigo-500 text-center ${selectedCountry === country.countryName_en ? 'bg-indigo-500 text-white hover:text-white' : 'bg-transparent'
                    }`}
                >
                  {getCountryName(country)}
                </a>
              ))}
            </div>
          </div>

          {/* City Selection */}
          <div className="p-4 bg-transparent cursor-pointer">
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              {filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <a
                    key={city.id}
                    onClick={() => setSelectedCity(city.cityName_en)}
                    className={`text-gray-700 mr-2 py-1 px-2 w-auto rounded-md focus:outline-none hover:text-indigo-500 ${selectedCity === city.cityName_en ? 'bg-indigo-500 text-white hover:text-white' : 'bg-transparent'
                      }`}
                  >
                    {getCityName(city)}
                  </a>
                ))
              ) : (
                <p className="text-gray-500">{t('No cities available')}</p>
              )}
            </div>
          </div>

          {/* Store Content */}
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 mx-auto">
              {selectedCity ? getCityName(selectedCity) : selectedCountry}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 text-gray-700 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
              {filteredStores.length > 0 ? (
                filteredStores.map((store, index) => (
                  <div key={index} className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-100 hover:text-indigo-500 transform transition-transform duration-300 hover:scale-105 rounded-md p-6 shadow-md">
                    <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-screen-2xl lg:px-8 hover:bg-gray-100">
                      <h3 className="text-xl font-semibold mb-2">
                        {getLocalizedField(store, 'name', lang)}
                      </h3>
                      <p className="text-sm mb-2">
                        {getLocalizedField(store, 'address', lang)}
                      </p>
                      <p className="text-sm mb-2">{t('StoreLocations_Daily')} {store.workingHours}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">{t('No stores available')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreLocations;