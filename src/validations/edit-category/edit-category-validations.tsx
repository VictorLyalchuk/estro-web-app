import { Dispatch, SetStateAction } from "react";
import { IMainCategory } from "../../interfaces/Category/Main-Category/IMainCategory";
import { IEditCategoryData } from "../../interfaces/Category/Category/IEditCategoryData";
import { ISubCategory } from "../../interfaces/Category/Sub-Category/ISubCategory";

interface Errors {
    name_en: string;
    name_uk: string;
    name_es: string;
    name_fr: string;
    urlName: string;
    description_en: string;
    description_uk: string;
    description_es: string;
    description_fr: string;
    mainCategory: string,
    subCategory: string,
}
const invalidCharactersRegex = /[\s,./?!@#$%^&*()]/;

export const validateForm = (formData: IEditCategoryData, selectedMainCategory: IMainCategory | null, selectedSubCategory: ISubCategory | null, setActiveTab: Dispatch<SetStateAction<number>>): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        urlName: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
        mainCategory: '',
        subCategory: '',
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

    if (selectedMainCategory === null) {
        newErrors.mainCategory = 'Main Category is required';
        isValid = false;
    }

    if (selectedSubCategory === null) {
        newErrors.subCategory = 'Sub Category is required';
        isValid = false;
    }

    if (formData.urlName.trim() === '') {
        newErrors.urlName = 'url Name is required';
        isValid = false;
    }
    else if (invalidCharactersRegex.test(formData.urlName)) {
        newErrors.urlName = 'URL Name cannot contain spaces or special characters like ,./?!@#$%^&*()';
        isValid = false;
    }

    if ((formData.description_en ?? '').trim() === '') {
        newErrors.description_en = 'Description is required';
        isValid = false;
        setActiveTab(0);
    }
    if ((formData.description_uk ?? '').trim() === '') {
        newErrors.description_uk = 'Description is required';
        isValid = false;
        setActiveTab(1);
    }
    if ((formData.description_es ?? '').trim() === '') {
        newErrors.description_es = 'Description is required';
        isValid = false;
        setActiveTab(2);
    }
    if ((formData.description_fr ?? '').trim() === '') {
        newErrors.description_fr = 'Description is required';
        isValid = false;
        setActiveTab(3);
    }
    return { isValid, newErrors };
};