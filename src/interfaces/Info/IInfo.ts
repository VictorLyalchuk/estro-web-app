export interface IInfo {
    id: string;
    name_en: string;
    name_es: string;
    name_fr: string;
    name_uk: string;
    value: string;
    options: IOptions [] | null;
}
export interface IOptions {
    id: string;
    label: string; 
    value: string;
}

export interface IProductFilters {
    id: number;
    name_en: string;
    name_es: string;
    name_fr: string;
    name_uk: string; 
    value: string;
    infoId: string;
    sortOrder: number;
}