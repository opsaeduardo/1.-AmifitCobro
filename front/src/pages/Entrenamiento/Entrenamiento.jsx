import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CardComponent from '../../components/common/CardComponent';

function Entrenamiento() {

    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <CardComponent
            backgroundColor={theme.customColors.yellow}
            onClick={() => navigate('/Entrenamiento')}
            imagen="/img/ENTRENAMIENTO.svg"
        />
    )
}

export default Entrenamiento;