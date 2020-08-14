import axios from 'axios';
// constanst 
const initialData = {
    fetching: false,
    array: [],
    current:{}
}
const URL = "https://rickandmortyapi.com/api/character";
const GET_CHARACTERS = "GET_CHARACTERS"; 
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS"; 
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"; 

const REMOVE_CHARACTER = "REMOVE_CHARACTER";

// reducer

export default function reducer(state = initialData, action){
    switch(action.type){
        case REMOVE_CHARACTER:
            return {...state, array: action.payload}
        case GET_CHARACTERS:
            return {...state, fetching: true }
        case GET_CHARACTERS_ERROR:
            return {...state, fetching: false, error: action.payload }
        case GET_CHARACTERS_SUCCESS:
            return {...state, array: action.payload, fetching: false }
        default:
            return state;
    }
};

// actions (thunks)
export const removeCharacterAction = () => (dispatch, getState) => {
    const { array } = getState().characters;
    array.shift();
    dispatch({
        type: REMOVE_CHARACTER,
        payload: [...array]
    })
};


export function getCharactersAction(){
    return (dispatch, getState) => {
        dispatch({
            type: GET_CHARACTERS
        });
        return axios.get(URL)
            .then(res => {
                dispatch({
                    type: GET_CHARACTERS_SUCCESS,
                    payload: res.data.results
                })
            })
            .catch(err => {
              dispatch({
                  type: GET_CHARACTERS_ERROR,
                  payload: err.response.message
              })  
            })
    }
}
