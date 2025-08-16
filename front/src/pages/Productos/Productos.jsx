import CardComponent from "../../components/common/CardComponent";
import { useNavigate } from "react-router-dom";

function Productos() {

    const navigate = useNavigate();

    return (
        <CardComponent
            backgroundColor="white"
            onClick={() => navigate('/Productos')}
            imagen="/img/Productos.svg"
        />
    )
}

export default Productos;