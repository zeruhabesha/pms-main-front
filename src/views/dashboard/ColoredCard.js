import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CCard } from '@coreui/react';
import { colors } from './theme';// Assuming colors are defined in theme.js

const slideInFromLeft = keyframes`
    from {
        transform: translateX(-50px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;


const ColoredCardContainer = styled(CCard)`
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: ${slideInFromLeft} 0.4s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    }

    .border-start {
        padding: 10px 15px;

        .text-body-secondary {
            font-size: 0.9rem;
        }
    }


    &.widget-pending {
        background: ${colors.light};

        .border-start {
            border-color: ${colors.primary} !important;
        }
    }

    &.widget-new-tenants {
        background: ${colors.light};

        .border-start {
            border-color: ${colors.success} !important;
        }
    }

    &.widget-avg-rent {
        background: ${colors.light};

        .border-start {
            border-color: ${colors.info} !important;
        }
    }

    &.widget-maintenance-task {
        background: ${colors.light};

        .border-start {
            border-color: ${colors.warning} !important;
        }
    }
`;

const ColoredCard = ({ className, children}) => {
    return (
        <ColoredCardContainer className={className}>
          {children}
        </ColoredCardContainer>
    );
};

export default ColoredCard;