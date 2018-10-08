import {
    ADD_TO_ACTION_QUEUE,
    CHANGE_CONNECTION_STATUS,
    INCREMENT_USER_INDEX,
    REMOVE_FROM_ACTION_QUEUE,
    SAVE_USER,
    USER_REQUEST
} from "./actionTypes";

const url = 'http://dm1.knexinc.com:3005/api/set_records';


export const savePerson = ({index, name, lat, long, time_rec, time_trans}) => {
    console.log(index, name, lat, long, time_rec, time_trans);
    return (dispatch, getState) => {
        const {isConnected} = getState();

        dispatch({type: INCREMENT_USER_INDEX});
        dispatch({type: USER_REQUEST});
        if (isConnected) {
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": name,
                    "lat": lat,
                    "long": long,
                    "time_rec": time_rec,
                    "time_trans": time_trans
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    dispatch({type: SAVE_USER, person: res});
                    dispatch({type: REMOVE_FROM_ACTION_QUEUE, payload: {index, name, lat, long, time_rec, time_trans}});
                });
        } else {
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: {index, name, lat, long, time_rec, time_trans}});
        }
    };
};

export const saveUserFromOfflineQue = ({index, name, lat, long, time_rec, time_trans}) => {
    return (dispatch, getState) => {
        dispatch({type: USER_REQUEST});

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": name,
                "lat": lat,
                "long": long,
                "time_rec": time_rec,
                "time_trans": time_trans
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                dispatch({type: SAVE_USER, person: res});
                dispatch({type: REMOVE_FROM_ACTION_QUEUE, payload: {index, name, lat, long, time_rec, time_trans}});
            });
    }

}

export const connectionState = ({status}) => {
    return {type: CHANGE_CONNECTION_STATUS, isConnected: status};
};
