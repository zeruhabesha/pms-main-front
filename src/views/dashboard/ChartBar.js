import React from 'react';
import styled from 'styled-components';

const ChartBarContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const IconWrapper = styled.span`
  margin-right: 10px;
`;

const Title = styled.span`
  font-weight: bold;
`;

const ChartWrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 150px;
    width: 100%;
`
const Bar = styled.div`
    background-color: ${props => props.color || 'gray'};
    height: 25px;
    width: ${props => props.value + "%" };
    max-width: 100%;
    border-radius: 4px;
`
const Value = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: black;
`
const ChartBar = ({ title, value, icon, data, color, progressColor }) => {
    const maxValue = Math.max(...data)
    const percentValue = value/maxValue * 100;

    return (
        <ChartBarContainer>
            <ChartHeader>
                <IconWrapper>{icon}</IconWrapper>
                <Title>{title}</Title>
            </ChartHeader>
            <ChartWrapper>
                <Bar value={percentValue} color={color}> </Bar>
                <Value>{`$${value}`}</Value>
            </ChartWrapper>
        </ChartBarContainer>
    );
};

export { ChartBar } ;