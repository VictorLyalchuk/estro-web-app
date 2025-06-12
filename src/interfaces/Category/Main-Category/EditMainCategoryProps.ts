import { ChangeEventHandler } from "react";
import { IEditMainCategoryData } from "./IEditMainCategoryData";

export interface EditMainCategoryProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formData: IEditMainCategoryData;
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
    };
    handleFileChange: ChangeEventHandler<HTMLInputElement>;
    handleRemove: (ImagePath: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    handleCancel: () => void;
    isUploading: boolean;
    image: string | null;
}