import axios from "axios";
import { APP_ENV } from "../../env/config";

import { IMainCategory } from "../../interfaces/Category/Main-Category/IMainCategory";
import { ISubCategory } from "../../interfaces/Category/Sub-Category/ISubCategory";
import { ICategory } from "../../interfaces/Category/Category/ICategory";
import { IMainCategoryCreate } from "../../interfaces/Category/Main-Category/IMainCategoryCreate";
import { IEditMainCategoryData } from "../../interfaces/Category/Main-Category/IEditMainCategoryData";
import { IMainCategoryEdit } from "../../interfaces/Category/Main-Category/IMainCategoryEdit";
import { ISubCategoryCreate } from "../../interfaces/Category/Sub-Category/ISubCategoryCreate";
import { IEditSubCategoryData } from "../../interfaces/Category/Sub-Category/IEditSubCategoryData";
import { ISubCategoryEdit } from "../../interfaces/Category/Sub-Category/ISubCategoryEdit";
import { ICategoryCreate } from "../../interfaces/Category/Category/ICategoryCreate";
import { IEditCategoryData } from "../../interfaces/Category/Category/IEditCategoryData";
import { ICategoryEdit } from "../../interfaces/Category/Category/ICategoryEdit";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/CategoryControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getMainCategories() {
    try {
        const response = await instance.get<IMainCategory[]>(`/MainCategoryGetAsync`);
        return response.data.map((mainCategory: IMainCategory) => ({
            id: mainCategory.id,
            name_en: mainCategory.name_en,
            name_es: mainCategory.name_es,
            name_fr: mainCategory.name_fr,
            name_uk: mainCategory.name_uk,
            description_en: mainCategory.description_en,
            description_uk: mainCategory.description_uk,
            description_es: mainCategory.description_es,
            description_fr: mainCategory.description_fr,
            imagePath: mainCategory.imagePath,
            urlName: mainCategory.urlName,
            subCategories: mainCategory.subCategories?.map((subCategory: ISubCategory) => ({
                id: subCategory.id,
                name_en: subCategory.name_en,
                name_es: subCategory.name_es,
                name_fr: subCategory.name_fr,
                name_uk: subCategory.name_uk,
                description_en: subCategory.description_en,
                description_uk: subCategory.description_uk,
                description_es: subCategory.description_es,
                description_fr: subCategory.description_fr,
                imagePath: subCategory.imagePath,
                mainCategoryId: subCategory.mainCategoryId,
                urlName: subCategory.urlName,
                categories: subCategory.categories?.map((category: ICategory) => ({
                    id: category.id,
                    name_en: category.name_en,
                    name_es: category.name_es,
                    name_fr: category.name_fr,
                    name_uk: category.name_uk,
                    description_en: subCategory.description_en,
                    description_uk: subCategory.description_uk,
                    description_es: subCategory.description_es,
                    description_fr: subCategory.description_fr,
                    imagePath: category.imagePath,
                    subCategoryId: category.subCategoryId,
                    urlName: category.urlName,
                    mainCategoryId: subCategory.mainCategoryId,
                })) || [],
            })) || [],
        }));
    } catch (error) {
        console.error('Failed to fetch main categories:', error);
        throw error;
    }
}

export async function getCategoryList(subName: string) {
    try {
        const resp = await instance.get<ICategory[]>(`CategoryGetWithSub`, {
            params: { subName }
        });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch category data:', error);
        throw error;
    }
}

export async function getCategory() {
    try {
        const resp = await instance.get<ICategory[]>(`CategoryGetAsync`);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch category data:', error);
        throw error;
    }
}

export async function getSubCategory() {
    try {
        const resp = await instance.get<ISubCategory[]>(`SubCategoryGetAsync`);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch category data:', error);
        throw error;
    }
}

export async function getMainCategory() {
    try {
        const resp = await instance.get<IMainCategory[]>(`MainCategoryGetAsync`);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

//admin panel Main Category
export async function getMainCategoryQuantity() {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<number>(`MainCategoryQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch quantity main category data:', error);
        throw error;
    }
}

export async function getMainCategoryByPage(page: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IMainCategory[]>(`MainCategoryByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function createMainCategory(model: IMainCategoryCreate) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`CreateMainCategory`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function editMainCategory(model: IMainCategoryEdit) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`EditMainCategory`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function deleteMainCategoryByID(id: number) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteMainCategoryByID/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function getMainCategoryById(id: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IEditMainCategoryData>(`GetMainCategoryById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

//admin panel Sub Category

export async function getSubCategoryByPage(page: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<ISubCategory[]>(`SubCategoryByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch sub category data:', error);
        throw error;
    }
}

export async function getSubCategoryById(id: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IEditSubCategoryData>(`GetSubCategoryById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function getSubCategoryQuantity() {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<number>(`SubCategoryQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch quantity sub category data:', error);
        throw error;
    }
}

export async function createSubCategory(model: ISubCategoryCreate) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`CreateSubCategory`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch sub category data:', error);
        throw error;
    }
}

export async function editSubCategory(model: ISubCategoryEdit) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`EditSubCategory`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function deleteSubCategoryByID(id: number) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteSubCategoryByID/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

//admin panel Category

export async function getCategoryByPage(page: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<ICategory[]>(`CategoryByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch category data:', error);
        throw error;
    }
}

export async function getCategoryById(id: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IEditCategoryData>(`GetCategoryById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function getCategoryQuantity() {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<number>(`CategoryQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch quantity category data:', error);
        throw error;
    }
}

export async function createCategory(model: ICategoryCreate) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`CreateCategory`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch sub category data:', error);
        throw error;
    }
}

export async function editCategory(model: ICategoryEdit) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`EditCategory`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function deleteCategoryByID(id: number) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteCategoryByID/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch category data:', error);
        throw error;
    }
}