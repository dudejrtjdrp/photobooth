const PLUS = 'counter/PLUS';
const MINUS = 'counter/MINUS';
 
export const plusCounter = (count: any) => ({ type: PLUS, count });
export const minusCounter = (count: any) => ({ type: MINUS, count });
export const showCounter = (count: any) => ({ type: 'Default', count });
 
const initialState = 0;
 
const counter = (state = initialState, action: any) => {
    switch (action.type) {
        case PLUS:
            return action.count ? state + action.count : state + 1;
        case MINUS:
            return action.count ? state - action.count : state - 1;
        default:
            return state;
    }
};
 
export default counter;