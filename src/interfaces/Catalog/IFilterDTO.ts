interface IFilterDTO {
    Size?: string[];
    Material?: string[];
    Color?: string[];
    Season?: string[];
    Page?: number | string[];
    ItemsPerPage?: number | string[];
    Sort?: string | string[];
    Search?: string;
    Language?: string;
    MainCategory?: string | string[];    
    SubName?: string | string[];    
    UrlName?: string | string[];
}