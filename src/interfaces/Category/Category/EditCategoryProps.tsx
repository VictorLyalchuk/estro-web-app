import { ChangeEventHandler } from "react";
import { IMainCategory } from "../Main-Category/IMainCategory";
import { ISubCategory } from "../Sub-Category/ISubCategory";
import { IEditCategoryData } from "./IEditCategoryData";

export interface EditCategoryProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formData: IEditCategoryData;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: {
        name_en: string;
        name_uk: string;
        name_es: string;
        name_fr: string;
        urlName: string;
        description_en: string;
        description_uk: string;
        description_es: string;
        description_fr: string;
        mainCategory: string;
        subCategory: string;
    };
    mainCategory: IMainCategory[];
    subCategory: ISubCategory[];
    selectedMainCategory: IMainCategory | null;
    selectedSubCategory: ISubCategory | null;
    handleMainCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: ChangeEventHandler<HTMLInputElement>;
    handleRemove: (ImagePath: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    handleCancel: () => void;
    isUploading: boolean;
    image: string | null;
}