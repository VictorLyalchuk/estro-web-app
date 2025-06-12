import {IUser} from "../../interfaces/Auth/IUser"

export enum AuthReducerActionType {
    LOGIN_USER = "AUTH_LOGIN_USER",
    LOGOUT_USER = "AUTH_LOGOUT_USER"
}

export interface IAuthReducerState {
    isAuth: boolean,
    user: IUser | null,
}

interface IAuthReducerAction {
    type: AuthReducerActionType;
    payload?: IUser; 
  }

const initState: IAuthReducerState = {
    isAuth: false,
    user: null,
}

const AuthReducer = (state = initState, action: IAuthReducerAction): IAuthReducerState => {
    switch (action.type) {
        case AuthReducerActionType.LOGIN_USER:
            return {
                isAuth: true,
                user: action.payload as IUser
            } as IAuthReducerState;

        case AuthReducerActionType.LOGOUT_USER:
            return {
                isAuth: false,
                user: null
            } as IAuthReducerState;

        default: {
            return state;
        }
    }
}

export default AuthReducer;