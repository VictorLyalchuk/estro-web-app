import { Dispatch, SetStateAction } from "react";
import { ICity } from "../../interfaces/Address/ICity";
import { ICountry } from "../../interfaces/Address/ICountry";
import { IEditStoreData } from "../../interfaces/Store/IEditStoreData";

interface Errors {
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
}
export const validateForm = (formData: IEditStoreData, selectedCountry: ICountry | null, selectedCity: ICity | null, setActiveTab: Dispatch<SetStateAction<number>>): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        name_en: '',
        name_es: '',
        name_fr: '',
        name_uk: '',
        address_en: '',
        address_es: '',
        address_fr: '',
        address_uk: '',
        workingHours: '',
        mapLink: '',
        country: '',
        city: '',
    };

    if (formData.name_en.trim() === '') {
        newErrors.name_en = 'Name is required';
        isValid = false;
        setActiveTab(0);
    }
    if (formData.name_uk.trim() === '') {
        newErrors.name_uk = 'Name is required';
        isValid = false;
        setActiveTab(1);
    }
    if (formData.name_es.trim() === '') {
        newErrors.name_es = 'Name is required';
        isValid = false;
        setActiveTab(2);
    }
    if (formData.name_fr.trim() === '') {
        newErrors.name_fr = 'Name is required';
        isValid = false;
        setActiveTab(3);
    }

    if (formData.address_en.trim() === '') {
        newErrors.address_en = 'Address is required';
        isValid = false;
        setActiveTab(0);
    }
    if (formData.address_uk.trim() === '') {
        newErrors.address_uk = 'Address is required';
        isValid = false;
        setActiveTab(1);
    }
    if (formData.address_es.trim() === '') {
        newErrors.address_es = 'Address is required';
        isValid = false;
        setActiveTab(2);
    }
    if (formData.address_fr.trim() === '') {
        newErrors.address_fr = 'Address is required';
        isValid = false;
        setActiveTab(3);
    }

    if (formData.workingHours.trim() === '') {
        newErrors.workingHours = 'Working Hours is required';
        isValid = false;
    }
    if (formData.mapLink.trim() === '') {
        newErrors.mapLink = 'Map Link is required';
        isValid = false;
    }
    if (formData.address_en.trim() === '') {
        newErrors.address_en = 'Address is required';
        isValid = false;
    }

    if (selectedCity === null) {
        newErrors.city = 'City is required';
        isValid = false;
    }

    if (selectedCountry === null) {
        newErrors.country = 'Country is required';
        isValid = false;
    }

    return { isValid, newErrors };
};