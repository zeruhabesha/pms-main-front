import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CCard } from '@coreui/react';
import { colors } from './theme';// Assuming colors are defined in theme.js

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const AnimatedCardContainer = styled(CCard)`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    animation: ${fadeIn} 0.5s ease;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }


    .chart-header,
    .table-header {
        border-bottom: 1px solid ${colors.gray};
        padding: 15px 20px;
        font-weight: 600;
        background: linear-gradient(to right, ${colors.light}, ${colors.gray});
    }

    .chart-body,
    .table-body {
        padding: 20px;
    }
`;

const AnimatedCard = ({ header, body, children, className}) => {
    return (
        <AnimatedCardContainer className={className}>
            {header && <CCard.Header className="chart-header">{header}</CCard.Header>}
            {body && <CCard.Body className="chart-body">{body}</CCard.Body>}
              {children}
        </AnimatedCardContainer>
    );
};

export default AnimatedCard;