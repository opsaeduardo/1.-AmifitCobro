import React from 'react';
import CardComponent from '../../components/common/CardComponent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';

function Mensualidad() {

    const navigate = useNavigate();

    return (
        <CardComponent
            backgroundColor="white"
            onClick={() => navigate('/mensualidad')}
            imagen="/img/Mensualidad.svg"
        />
    );
}

export default Mensualidad