import React from 'react'
import CardComponent from '../../components/common/CardComponent'
import { useNavigate } from 'react-router-dom';

function Clases() {

    const navigate = useNavigate();

    return (
        <CardComponent
            backgroundColor="white"
            onClick={() => navigate('/Clases')}
            imagen="/img/Clases.svg"
        />
    )
}

export default Clases