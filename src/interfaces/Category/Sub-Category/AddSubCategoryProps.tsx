import { ChangeEventHandler } from "react";
import { IAddSubCategoryData } from "./IAddSubCategoryData";
import { IMainCategory } from "../Main-Category/IMainCategory";

export interface AddSubCategoryProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formData: IAddSubCategoryData;
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