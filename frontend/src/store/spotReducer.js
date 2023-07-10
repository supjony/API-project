import { csrfFetch } from "./csrf";


const GET_ALL_SPOTS = 'spots/getSpots';

const GET_SINGLE_SPOT = 'spots/singleSpot';


export const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
};

export const getSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
};



export const getSingleSpotThunk = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`);
    if(res.ok) {
        const data = await res.json
        dispatch(getSingleSpot(data))
        return data
    }
};


export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    if(res.ok) {
        const data = await res.json
        dispatch(getSpots(data))
        return data
    }
};




const initialState = {};


// export const singleSpotReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case GET_SINGLE_SPOT: {
//             const newState = {};
//             action.spots.Spots.forEach(spot => (newState[spot.id] = spot));
//             return newState
//         }
//         default:
//             return state
//     }
// }



const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach(spot => (newState[spot.id] = spot));
            return newState
        }
        default:
            return state
    }
}

export default spotsReducer
