import axios from "axios";
import { APP_ENV } from "../../env/config";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/UserProductReview`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function addUserProductReview(createUserProductReviewDTO: ICreateUserProductReviewDTO) {
    try {
        await instance.post(`addReview`, createUserProductReviewDTO)
    } catch (error) {
        console.error('Failed to fetch addReview data:', error);
        throw error;
    }
}

export async function getUserProductRating(productId: any,) {
    try {
        const response = await instance.get<IUserProductRating>(`getRating`, { params: { productId } });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getUserProductReview(productId: any, page: number) {
    try {
        const response = await instance.get<IUserProductReview[]>(`getReview/${productId}`, { params: { page } });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getQuantityUserProductReview(productId: any) {
    try {
        const response = await instance.get<number>(`getQuantityReview`, { params: { productId } });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

//admin panel Review
export async function getReviewByPage(page: number, pageSize: number) {
    const token = localStorage.getItem('token');
    try {
        const response = await instance.get<IUserProductReview[]>(`ReviewsByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: {
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch orders data:', error);
        throw error;
    }
}


export async function getReviewQuantity() {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<number>(`ReviewQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch quantity review data:', error);
        throw error;
    }
}

export async function deleteReviewByID(id: number) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteReviewByID/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to delete review data:', error);
        throw error;
    }
}