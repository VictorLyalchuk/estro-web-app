import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IUserProfile } from "../../interfaces/Auth/IUserProfile";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../../interfaces/Auth/IUser";
import { AuthReducerActionType } from "../../store/accounts/AuthReducer";
import { IUserEdit } from "../../interfaces/Auth/IUserEdit";
import { IRegister } from "../../interfaces/Auth/IRegister";
import { ILogin } from "../../interfaces/Auth/ILogin";
import { IUserCreate } from "../../interfaces/Auth/IUserCreate";
import { IUserGetEdit } from "../../interfaces/Auth/IUserGetEdit";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/AccountControllers`,
    headers: {
        "Content-Type": "application/json"
    }
});

// Інтерцептор для додавання токену до заголовків
instance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Інтерцептор для обробки помилок і оновлення токену
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken();
                setToken(newToken);
                originalRequest.headers["Authorization"] = "Bearer " + newToken;
                return instance(originalRequest);
            } catch (err) {
                console.error("Failed to refresh token:", err);
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

// Функція для отримання токену з локального сховища
export function getToken() {
    const token = window.localStorage.getItem("token");
    return token;
}

// Функція для збереження токену в локальне сховище
export function setToken(token: string) {
    window.localStorage.setItem("token", token);
}

// Функція для видалення токенів з локального сховища
export function removeTokens() {
    window.localStorage.removeItem("token");
}

export async function refreshToken() {
    try {
        const localToken = getToken();
        if (localToken) {
            const response = await instance.put("/refresh-token", {
                token: getToken(),
            });
            const token = response.data;
            setToken(response.data);
            return token;
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
}

export async function getUserData(userEmail: string | null, userPhone: string | null = null) {
    // Validate input: ensure at least one of email or phone is provided
    if (!userEmail && !userPhone) {
        throw new Error('You must provide either an email or a phone number to fetch user data.');
    }

    try {
        // Build the query string based on the provided email or phone
        const queryParams = new URLSearchParams();
        if (userEmail) queryParams.append('email', userEmail);
        if (userPhone) queryParams.append('phone', userPhone);

        // Send the request to your service endpoint
        const response = await instance.get<IUserProfile>(`/get-by-email-or-phone?${queryParams.toString()}`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}




export async function editUserData(user: IUserEdit) {
    try {
        await instance.post(`Edit`, user)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Edit request failed:', error.response?.data?.message || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export async function emailConfirm(userEmail: string | null) {
    try {
        await instance.post(`ConfirmMyEmail`, userEmail);
    } catch (error) {
        console.error('Failed to confirm user:', error);
        throw error;
    }
}

export async function refreshRedux(dispatch: any) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const user = jwtDecode<IUser>(token);
            dispatch({
                type: AuthReducerActionType.LOGIN_USER,
                payload: {
                    Id: user.Id,
                    Email: user.Email,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Role: user.Role,
                    ImagePath: user.ImagePath,
                    PhoneNumber: user.PhoneNumber,
                    AuthType: user.AuthType
                }
            });
        } else {
            dispatch({ type: AuthReducerActionType.LOGOUT_USER });
        }
    } catch (error) {
        console.error('Failed to refresh redux:', error);
        throw error;
    }
}

export async function ConfirmEmail(email: string | null, token: string | null, callback: (error: any, result?: any) => void) {
    try {
        await instance.post(`ConfirmEmail`, { email, token });
        await refreshToken();
        callback(null, "Success");
    } catch (error) {
        console.error('Error confirming email:', error);
        callback(error);
    }
}

export async function register(user: IRegister) {
    try {
        await instance.post(`Registration`, user, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        console.error('Failed to edit user data:', error);
        throw error;
    }
}

export async function login(_user: ILogin, dispatch: any) {
    try {
        const response = await instance.post(`Login`, _user)
        const { token } = response.data;
        const user = jwtDecode(token) as IUser;
        dispatch({
            type: AuthReducerActionType.LOGIN_USER,
            payload: {
                Id: user.Id,
                Email: user.Email,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Role: user.Role,
                ImagePath: user.ImagePath,
                PhoneNumber: user.PhoneNumber,
                AuthType: user.AuthType
            } as IUser,
        });
        await setToken(token);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Login request failed:', error.response?.data?.message || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export async function forgotPassword(user: any) {
    try {
        await instance.post(`ForgotPassword`, user);
    } catch (error) {
        console.error('Failed to edit user data:', error);
        throw error;
    }
}

export async function resetPassword(user: any) {
    try {
        await instance.post(`ResetPassword`, user);
    } catch (error) {
        console.error('Failed to edit user data:', error);
        throw error;
    }
}

export async function getUsersByPage(page: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IUserProfile[]>(`UsersByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch users data:', error);
        throw error;
    }
}

export async function GetUserById(id: string) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IUserGetEdit>(`GetUserById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}

export async function getUsersQuantity() {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<number>(`UsersQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch quantity users data:', error);
        throw error;
    }
}

export async function createUser(model: IUserCreate) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`CreateUser`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to create user data:', error);
        throw error;
    }
}

export async function editUser(model: IUserGetEdit) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`editUser`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to edit user data:', error);
        throw error;
    }
}

export async function deleteUserByID(id: string) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteUserByID/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}