export enum OrderReducerActionType {
    ORDER_COUNT = "SET_ORDER_COUNT",
    DELETE_ORDER_COUNT = "DELETE_ORDER_COUNT"
}

export interface IOrderReducerState {
    countOrder: number ;
}

interface IOrderReducerAction {
    type: OrderReducerActionType;
    payload: { countOrder: number }
}

const initState: IOrderReducerState = {
    countOrder: 0,
}

const orderReducer = (state = initState, action: IOrderReducerAction): IOrderReducerState => {
    switch (action.type) {
        case OrderReducerActionType.ORDER_COUNT:
            return {
                ...state,
                countOrder: action.payload.countOrder, 
            };
        case OrderReducerActionType.DELETE_ORDER_COUNT:
                return {
                    countOrder: 0,
                };
        default:
            return state;
    }
}

export default orderReducer;