import { ICategory } from "../Category/ICategory";

export interface ISubCategory {
    id: number;
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
    categories: ICategory[];
  }