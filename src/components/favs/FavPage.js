import React from 'react';
import styles from './favs.module.css';
import Card from '../card/Card';
import {connect} from 'react-redux';

function FavPage({ characters = [0] }) {
    function renderCharacter(char, i) {
        return (
            <Card  
                hide
                key={i} 
                {...char}
            />
        )
    }
    return (
        <div className={styles.container}>
            <h2>Favoritos</h2>
            {characters.map(renderCharacter)}
            {!characters.length && <h3>No hay personajes agregados</h3>}
        </div>
    )
}

const mapState = ({ characters }) => {
    return {
        characters: characters.favorites
    }
}


export default connect(mapState)(FavPage);