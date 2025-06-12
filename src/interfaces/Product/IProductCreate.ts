import { IProductFilters } from "../Info/IInfo";
import { IImageItem } from "./IProduct";

export interface IProductCreate {
    name_en: string;
    name_uk: string;
    name_es: string;
    name_fr: string;

    description_en: string; 
    description_uk: string; 
    description_es: string; 
    description_fr: string; 

    highlights_en: string []; 
    highlights_uk: string []; 
    highlights_es: string []; 
    highlights_fr: string []; 
    
    price: string; 
    materialId: number; 
    seasonId: number; 
    colorId: number; 
    article: string; 
    ImagesFile: IImageItem [] | null;  
    CategoryId?: number;
    sizes: IProductFilters[] | null;
}