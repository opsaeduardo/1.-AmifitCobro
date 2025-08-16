import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CardComponent({ backgroundColor, onClick, imagen }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/');
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                mx: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                borderRadius: 5,
                backgroundColor: backgroundColor,
            }}
            onClick={handleClick}
        >
            {imagen && (
                <img
                    src={imagen}
                    alt="imagen"
                    style={{
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain',
                        borderRadius: 'inherit',
                    }}
                />
            )}
        </Box>



    );
}

export default CardComponent;
