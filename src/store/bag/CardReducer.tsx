import { BagItems } from "../../interfaces/Bag/IBagUser";

export enum CardReducerActionType {
    SET = "SET_ITEM",
    DELETE = "DELETE_ITEM",
    UPDATE_TOTAL = "UPDATE_TOTAL",
    DELETE_CARD_ALL = "DELETE_CARD_ALL",
    UPDATE_DISCOUNT = "UPDATE_DISCOUNT",
}

export interface ICardReducerState {
    items: BagItems[] | null,
    total: number,
    totalPure: number,
    taxes: number,
    totalWithOutTax: number,
    discount: number,
    initialIndividualItemPrice: { [itemId: number]: number };
}

export interface ICardReducerAction {
    type: CardReducerActionType;
    payload?: {
        items?: BagItems[];
        itemId?: number;
        total?: number;
        totalPure?: number,
        taxes?: number;
        totalWithOutTax?: number,
        discount?: number
    };
}

export const updateDiscount = (discount: number): ICardReducerAction => ({
    type: CardReducerActionType.UPDATE_DISCOUNT,
    payload: { discount },
});

const initState: ICardReducerState = {
    items: null,
    total: 0,
    totalPure: 0,
    taxes: 0,
    totalWithOutTax: 0,
    discount: 0,
    initialIndividualItemPrice: {},
}

const cardReducer = (state = initState, action: ICardReducerAction): ICardReducerState => {
    switch (action.type) {
        case CardReducerActionType.SET:
            const items = action.payload?.items || null;
            const discount = action.payload?.discount || state.discount;

            if (!items) {
                return state;
            }
            const initialTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const initialTaxes = (initialTotal / (100 + 20) * 20);
            const initialTotalWithOutTax = initialTotal - initialTaxes;
            const initialIndividualItemPrice: { [itemId: number]: number } = {};
            items.forEach(item => { initialIndividualItemPrice[item.id] = item.price * item.quantity; });

            return {
                ...state,
                items: items,
                total: initialTotal - discount,
                totalPure: initialTotal,
                taxes: (initialTaxes),
                totalWithOutTax: (initialTotalWithOutTax),
                discount: discount,
                initialIndividualItemPrice: initialIndividualItemPrice,
            };
        case CardReducerActionType.DELETE:
            const itemIdToDelete = action.payload?.itemId;
            if (!itemIdToDelete || !state.items) {
                return state;
            }

            const newItems = state.items.filter(item => item.id !== itemIdToDelete);
            return {
                ...state,
                items: newItems,
            };

        case CardReducerActionType.DELETE_CARD_ALL:
            return {
                items: [],
                total: 0,
                totalPure: 0,
                totalWithOutTax: 0,
                initialIndividualItemPrice: {},
                taxes: 0,
                discount: 0,
            };
        case CardReducerActionType.UPDATE_DISCOUNT:
            const newDiscount = action.payload?.discount ?? state.discount;
            const updatedTotal = state.total + state.discount - newDiscount;

            return {
                ...state,
                discount: newDiscount,
                total: updatedTotal,
            };
        default:
            return state;
    }
}

export default cardReducer;