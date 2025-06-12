import { Dispatch, SetStateAction } from "react";
import { IMainCategory } from "../../interfaces/Category/Main-Category/IMainCategory";
import { IAddProductData } from "../../interfaces/Product/IAddProductData";
import { ISubCategory } from "../../interfaces/Category/Sub-Category/ISubCategory";
import { ICategory } from "../../interfaces/Category/Category/ICategory";

interface Errors {
    name_en: string;
    name_uk: string;
    name_es: string;
    name_fr: string;
    article: string;
    price: string;
    season: string;
    color: string;
    material: string;
    size: string;
    mainCategory: string;
    subCategory: string;
    category: string;
    description_en: string;
    description_uk: string;
    description_es: string;
    description_fr: string;
    highlights_en: string;
    highlights_uk: string;
    highlights_es: string;
    highlights_fr: string;
}

export const validateForm = (formData: IAddProductData, selectedMainCategory: IMainCategory | null, selectedSubCategory: ISubCategory | null, selectedCategory: ICategory | null, setActiveTab: Dispatch<SetStateAction<number>>): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        article: '',
        price: '',
        season: '',
        color: '',
        material: '',
        size: '',
        mainCategory: '',
        subCategory: '',
        category: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
        highlights_en: '',
        highlights_uk: '',
        highlights_es: '',
        highlights_fr: '',
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

    if (formData.article.trim() === '') {
        newErrors.article = 'Article is required';
        isValid = false;
    }

    if (formData.price.trim() === '') {
        newErrors.price = 'Price is required';
        isValid = false;
    }

    if (formData.season === '') {
        newErrors.season = 'Season is required';
        isValid = false;
    }

    if (formData.color === '') {
        newErrors.color = 'Color is required';
        isValid = false;
    }

    if (formData.material === '') {
        newErrors.material = 'Material is required';
        isValid = false;
    }

    if (formData.sizes.length === 0) {
        newErrors.size = 'At least one size is required';
        isValid = false;
    }

    if (selectedMainCategory === null) {
        newErrors.mainCategory = 'Main Category is required';
        isValid = false;
    }

    if (selectedSubCategory === null) {
        newErrors.subCategory = 'Sub Category is required';
        isValid = false;
    }

    if (selectedCategory === null) {
        newErrors.category = 'Category is required';
        isValid = false;
    }

    if (formData.description_en.trim() === '') {
        newErrors.description_en = 'Description is required';
        isValid = false;
        setActiveTab(0);
    }
    if (formData.description_uk.trim() === '') {
        newErrors.description_uk = 'Description is required';
        isValid = false;
        setActiveTab(1);
    }
    if (formData.description_es.trim() === '') {
        newErrors.description_es = 'Description is required';
        isValid = false;
        setActiveTab(2);
    }
    if (formData.description_fr.trim() === '') {
        newErrors.description_fr = 'Description is required';
        isValid = false;
        setActiveTab(3);
    }

    if (formData.highlights_en.length === 0) {
        newErrors.highlights_en = 'At least one highlights is required';
        isValid = false;
        setActiveTab(0);
    }
    else if (formData.highlights_en[0] === '') {
        newErrors.highlights_en = 'Highlights is required';
        isValid = false;
        setActiveTab(0);
    }
    if (formData.highlights_uk.length === 0) {
        newErrors.highlights_uk = 'At least one highlights is required';
        isValid = false;
        setActiveTab(1);
    }
    else if (formData.highlights_uk[0] === '') {
        newErrors.highlights_uk = 'Highlights is required';
        isValid = false;
        setActiveTab(1);
    }
    if (formData.highlights_es.length === 0) {
        newErrors.highlights_es = 'At least one highlights is required';
        isValid = false;
        setActiveTab(2);
    }
    else if (formData.highlights_es[0] === '') {
        newErrors.highlights_es = 'Highlights is required';
        isValid = false;
        setActiveTab(2);
    }
    if (formData.highlights_fr.length === 0) {
        newErrors.highlights_fr = 'At least one highlights is required';
        isValid = false;
        setActiveTab(3);
    }
    else if (formData.highlights_fr[0] === '') {
        newErrors.highlights_fr = 'Highlights is required';
        isValid = false;
        setActiveTab(3);
    }
    return { isValid, newErrors };
};