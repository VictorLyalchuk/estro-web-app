export interface IProduct {
    id: number;
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
    
    material_en: string; 
    material_uk: string; 
    material_es: string; 
    material_fr: string; 
    
    season_en: string; 
    season_uk: string; 
    season_es: string; 
    season_fr: string; 
    
    color_en: string;
    color_uk: string;
    color_es: string;
    color_fr: string;
    
    price: number; 
    article: string; 
    images: IImage[] | null;  
    imagesPath: string [] | null;  
    subCategoryId: number;
    categoryId: number;
    categoryName_en: string;
    subCategoryName_en: string [] | null; 
    mainCategoryName_en: string [] | null; 

    storages: IStorages[] | null;
    storageQuantity: number;
    urlMainCategoryName: string [] | null; 
    urlSubCategoryName: string [] | null; 
    urlCategoryName: string [] | null;  
}

export interface IStorages{
    id: number;
    productId: number;
    productQuantity : number;
    size: string;
    inStock: boolean;
}

export interface IImage {
    id: number;
    imagePath: string;
    productId: number;
    ImageFile: File;
  }

  export interface IImageItem {
    id: number;
    imagePath: string;
  }
