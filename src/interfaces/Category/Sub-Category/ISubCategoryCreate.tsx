export interface ISubCategoryCreate {
    name_en: string;
    name_es: string;
    name_uk: string;
    name_fr: string;
    description_en: string | null;
    description_uk: string | null;
    description_es: string | null;
    description_fr: string | null;
    urlName: string;
    imagePath: string | null;   
    mainCategoryId: number;
}