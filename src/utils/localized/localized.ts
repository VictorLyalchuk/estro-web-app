import { IOptions } from "../../interfaces/Info/IInfo";

export const getLocalizedField = (product: any, field: string, lang: string): string => {
  return product[`${field}_${lang}`] as string;
};

export const getLocalizedFieldArray = (product: any, field: string, lang: string): string[] => {
  return product[`${field}_${lang}`] as string[];
};

export const transformToOptions = (options: any[], language: string): IOptions[] => {
  return options.map(option => ({
    id: option.id.toString(),
    label: (() => {
      switch (language) {
        case 'uk':
          return option.name_uk;
        case 'es':
          return option.name_es;
        case 'fr':
          return option.name_fr;
        case 'en':
          return option.name_en;
        default:
          return option.name_en;
      }
    })(),
    value: option.value
  }));
};