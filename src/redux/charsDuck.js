// import axios from 'axios';
import { updateDB, getFavs} from '../firebase';
import ApolloClient, {gql} from 'apollo-boost'


// constanst 
const initialData = {
    fetching: false,
    array: [],
    current: {},
    favorites: [],
    nextPage: 1
}
// const URL = "https://rickandmortyapi.com/api/character";

const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql"
})

const UPDATE_PAGE = "UPDATE_PAGE"; 

const GET_CHARACTERS = "GET_CHARACTERS"; 
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS"; 
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"; 

const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";

const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
const GET_FAVS_ERROR = "GET_FAVS_ERROR";


// reducer

export default function reducer(state = initialData, action){
    switch(action.type){
        case UPDATE_PAGE:
            return {...state, nextPage: action.payload }
        case GET_FAVS:
            return {...state, fetching: true}
        case GET_FAVS_ERROR:
            return {...state, fetching: false, error: action.payload}
        case GET_FAVS_SUCCESS:
            return {...state, fetching: false, favorites: action.payload}
        case ADD_TO_FAVORITES:
            return {...state, ...action.payload }
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


const saveStorage = (storage) => {
    localStorage.storage = JSON.stringify(storage)
}

// actions (thunks)

export const restoreFavsStorage = () => (dispatch, getState) => {
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.characters.favorites){
        dispatch({
            type: GET_FAVS_SUCCESS,
            payload: storage.characters.favorites
        })
    }
}



export const retreiveFavs = () => (dispatch, getState) => {
    dispatch({
        type: GET_FAVS,
    })
    const { uid } = getState().user;
    return getFavs(uid)
        .then( array => {
            dispatch({
                type: GET_FAVS_SUCCESS,
                payload: [...array]
            })
            saveStorage(getState());
        })
        .catch( e => {
            dispatch({
                type: GET_FAVS_ERROR,
                payload: e.message
            })
        })
}


export const addToFavoritesAction = () => (dispatch, getState) => {
    let {array, favorites} = getState().characters;
    const {uid} = getState().user
    let character = array.shift();
    favorites.push(character);
    updateDB(favorites, uid);
    saveStorage(getState());
    dispatch({
        type: ADD_TO_FAVORITES,
        payload: { array:[...array], favorites:[...favorites] }
    });
}


export const removeCharacterAction = () => (dispatch, getState) => {
    const { array } = getState().characters;
    array.shift();
    if(array.length === 0){
        getCharactersAction()(dispatch, getState)
        return;
    }
    dispatch({
        type: REMOVE_CHARACTER,
        payload: [...array]
    })
};


export function getCharactersAction(){
    const query = gql`
        query ($page:Int){
                characters(page:$page){
                info{
                    count
                    pages
                    next
                    prev
                }
                results{
                    name
                    image
                }
                }
            }
    `;
    return (dispatch, getState) => {
        dispatch({
            type: GET_CHARACTERS
        });
        let { nextPage } = getState().characters;
        return client.query({
            query,
            variables:{
                page: nextPage
            }
        })
        .then(({data, error}) => {
            if(error){
                dispatch({
                    type: GET_CHARACTERS_ERROR,
                    payload: error
                })
                return;
            }
            dispatch({
                type: GET_CHARACTERS_SUCCESS,
                payload: data.characters.results
            })
            saveStorage(getState());
            dispatch({
                type: UPDATE_PAGE,
                payload: data.characters.info.next ? data.characters.info.next : 1
            })
        })
    }
}
//         return axios.get(URL)
//             .then(res => {
//                 dispatch({
//                     type: GET_CHARACTERS_SUCCESS,
//                     payload: res.data.results
//                 })
//             })
//             .catch(err => {
//               dispatch({
//                   type: GET_CHARACTERS_ERROR,
//                   payload: err.response.message
//               })  
//             })
//     }
// }
