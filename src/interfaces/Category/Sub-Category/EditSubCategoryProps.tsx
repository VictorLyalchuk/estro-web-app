import { ChangeEventHandler } from "react";
import { IMainCategory } from "../Main-Category/IMainCategory";
import { IEditSubCategoryData } from "./IEditSubCategoryData";


export interface EditSubCategoryProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formData: IEditSubCategoryData;
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
    };
    mainCategory: IMainCategory[];
    selectedMainCategory: IMainCategory | null;
    handleMainCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: ChangeEventHandler<HTMLInputElement>;
    handleRemove: (ImagePath: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    handleCancel: () => void;
    isUploading: boolean;
    image: string | null;
}