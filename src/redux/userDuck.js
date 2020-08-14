// constanst
let initialData = {
    loggedIn: false
}
let LOGIN = 'LOGIN'

// reducer

export default function reducer(state = initialData,action){
    switch(action.type){
        case LOGIN:
            break
        default:
            return state;
    }
}

// actions