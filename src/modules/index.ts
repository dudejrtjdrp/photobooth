import { combineReducers } from 'redux';
import counter from './states';
 
const rootReducer = combineReducers({
    counter
});
 
export default rootReducer;