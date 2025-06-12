import { ICity } from "../Address/ICity";
import { ICountry } from "../Address/ICountry";
import { IEditStoreData } from "./IEditStoreData";

export interface EditStoreProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formData: IEditStoreData;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: {
        name_en: string;
        name_uk: string;
        name_es: string;
        name_fr: string;
        address_en: string;
        address_es: string;
        address_fr: string;
        address_uk: string;
        workingHours: string;
        mapLink: string;
        country: string;
        city: string;
    };
    countryOptions: ICountry[];
    selectedCountry: ICountry | null;
    handleCountryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cityOptions: ICity[];
    selectedCity: ICity | null;
    handleCityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCancel: () => void;
}