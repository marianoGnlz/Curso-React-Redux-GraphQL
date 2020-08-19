import React, { useState, useEffect } from 'react';
import Card from '../card/Card';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styles from './home.module.css';

const GraphHome = () => {

    const [chars, setChars] = useState([]);

    const query = gql`
        {
            characters{
                results{
                    name
                    image
                }
            }
        }
    `;

    let {data, loading, error} = useQuery(query)
    
    useEffect(() => {
        if(data && !loading && !error){
            setChars([...data.characters.results])
        }
    }, [data]);

    const nextCharacter = () => {
        chars.shift();
        setChars([...chars]);
    }
    

    if(loading) return <h2>Cargando...</h2>

    return (
        <Card 
           // rightClick={addFav}
           leftClick={nextCharacter} 
           {...chars[0]}
        />
    );
};

export default GraphHome;

