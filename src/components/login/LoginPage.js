import React, {Fragment} from 'react';
import styles from './login.module.css';
import {connect} from 'react-redux';
import { doGoogleLoginAction, logOutAction } from '../../redux/userDuck';

function LoginPage({fetching, loggedIn, doGoogleLoginAction, logOutAction}) {

    const doLogin = () => {
        doGoogleLoginAction();
    }
    const logOut = () => {
        logOutAction();
    }
    
    
    if (fetching){
        return (<h2>Cargando...</h2>)
    }

    return (
        <div className={styles.container}>
            {loggedIn?
                <Fragment>
                    <h1>
                        Cierra tu sesión
                    </h1>
                    <button onClick={logOut}>
                        Cerrar Sesión
                    </button>
                </Fragment>
                :
                <Fragment>
                    <h1>
                        Inicia Sesión con Google
                    </h1>
                    <button onClick={doLogin}>
                        Iniciar
                    </button>
                </Fragment>
            }
        </div>
    )
}
const mapState = ({user:{fetching, loggedIn}}) => {
    return {
        fetching,
        loggedIn
    }
}


export default connect(mapState, { doGoogleLoginAction, logOutAction })(LoginPage);