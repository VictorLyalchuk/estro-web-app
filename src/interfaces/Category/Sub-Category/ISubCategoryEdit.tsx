export interface ISubCategoryEdit {
    id: number;
    name_en: string;
    name_uk: string;
    name_es: string;
    name_fr: string;
    urlName: string;
    imagePath: string | null;  
    description_en: string;
    description_uk: string;
    description_es: string;
    description_fr: string;
    mainCategoryId: number;
}