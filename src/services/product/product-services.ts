import axios from "axios";
import { APP_ENV } from "../../env/config";
import qs from "qs";
import { IProduct } from "../../interfaces/Product/IProduct";
import { IProductCreate } from "../../interfaces/Product/IProductCreate";
import { IEditProductData } from "../../interfaces/Product/IEditProductData";
import { IProductEdit } from "../../interfaces/Product/IProductEdit";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Product`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getQuantityProducts(filterDTO: IFilterDTO) {
    try {
        const resp = await instance.get<number>(`ProductQuantityByFilters`, {
            params: filterDTO,
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' });
            }      
        });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getProductsist(filterDTO: IFilterDTO) {
    try {
        const resp = await instance.get<IProduct[]>(`/FilterProducts`, {
            params: filterDTO, paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' });
            }
          });
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getProductById(id: string) {
    try {
        const response = await instance.get<IProduct>(`ProductByID/${id}`)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}


//admin panel
export async function getProductByPage(page: number, text: string) {
    const token = localStorage.getItem('token');
    try {
        const response = await instance.get<IProduct[]>(`ProductByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                search: text || '',
            },
        })
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getProductQuantity(text: string) {
    const token = localStorage.getItem('token');

    try {
        const response = await instance.get<number>(`ProductQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                search: text || '',
            },
        })
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product quantity data:', error);
        throw error;
    }
}

export async function deleteProductByID(id: number) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteProductByID/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function createProduct(model: IProductCreate) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`CreateProduct`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to create product data:', error);
        throw error;
    }
}

export async function getEditProductById(id: string) {
    const token = localStorage.getItem('token');
    try {
        const response = await instance.get<IEditProductData>(`GetEditProductById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function editProduct(model: IProductEdit) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`EditProduct`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to edit product data:', error);
        throw error;
    }
}