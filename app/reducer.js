import _ from 'lodash';
import {
    ADD_TO_ACTION_QUEUE,
    CHANGE_CONNECTION_STATUS,
    INCREMENT_USER_INDEX,
    REMOVE_FROM_ACTION_QUEUE,
    SAVE_USER,
    USER_REQUEST
} from "./actionTypes";

const initialState = {
    personIndex: 1,
    people: [],
    actionQueue: [],
    isConnected: false,
    loading: false, message: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT_USER_INDEX:
            return Object.assign({}, state, {
                personIndex: state.personIndex + 1,
                loading: false,
                message: null

            });
        case USER_REQUEST:
            return Object.assign({}, state, {
                loading: true,
                message: null

            });
        case SAVE_USER:
            return Object.assign({}, state, {
                    people: [action.person].concat(state.people),
                    actionQueue: _.uniqBy(state.actionQueue, action.payload) && !_.isEqual(state.actionQueue, action.payload),
                    loading: false,
                    message: action.person.item.name
                }
            )
                ;
        case
        CHANGE_CONNECTION_STATUS:
            return Object.assign({}, state, {
                isConnected: action.isConnected,
                loading: false,
                message: null

            });
        case
        ADD_TO_ACTION_QUEUE:
            return Object.assign({}, state, {
                actionQueue: state.actionQueue.concat([action.payload]),
                loading: false,
                message: null

            });
        case
        REMOVE_FROM_ACTION_QUEUE:
            return Object.assign({}, state, {
                actionQueue: _.without(state.actionQueue, action.payload),
                loading: false,
                // message: null


            });
        default:
            return state;
    }
}

export default reducer;
