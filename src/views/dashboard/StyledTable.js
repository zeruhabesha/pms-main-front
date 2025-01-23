import styled, { keyframes } from 'styled-components';
import { CCard, CTable } from '@coreui/react';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const EnhancedChartCard = styled(CCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

export const MetricCard = styled(CCard)`
  background: ${props => props.gradient || 'linear-gradient(45deg, #2196F3, #21CBF3)'};
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
    z-index: 1;
  }
`;

export const CircularProgressWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 1rem auto;
  animation: ${pulse} 2s infinite;
`;

export const EnhancedTable = styled(CTable)`
  border-collapse: separate;
  border-spacing: 0 8px;
  
  th {
    background: #f8f9fa;
    border: none;
    padding: 1rem;
    font-weight: 600;
  }
  
  td {
    padding: 1rem;
    background: white;
    border: none;
    
    &:first-child {
      border-radius: 8px 0 0 8px;
    }
    
    &:last-child {
      border-radius: 0 8px 8px 0;
    }
  }
  
  tr {
    transition: all 0.2s ease;
    
    &:hover td {
      background: #f8f9fa;
      transform: scale(1.01);
    }
  }
`;

export const StatisticBox = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.background || '#ffffff'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  .title {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;


export const areaChartConfig = {
  options: {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f1f1f1',
      row: { colors: ['transparent', 'transparent'], opacity: 0.5 }
    },
    tooltip: { theme: 'dark' }
  }
};

export const radialBarConfig = {
  options: {
    chart: {
      height: 280,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        dataLabels: {
          showOn: 'always',
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '13px'
          },
          value: {
            color: '#111',
            fontSize: '30px',
            show: true
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    }
  }
};

export const colors = {
    success: '#2eb85c',
    info: '#36a2eb',
    warning: '#f9b115',
    danger: '#e55353',
    white: '#ffffff',
};

export const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;


export const slideInFromLeft = keyframes`
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
`;

export const WidgetStatsContainer = styled.div`
    background: ${(props) => props.color || 'white'};
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .widget-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

         .icon{
             color: ${props => props.color};
         }


        .title {
            font-size: 1rem;
            font-weight: bold;
            color: #495057;
        }
    }

    .value {
        font-size: 2.0rem;
        font-weight: bold;
        color: #212529;
    }
    .trend-arrow{
        font-size: 0.875rem;
        color: #495057;
        margin-left: 5px;
    }

     .trend-arrow.up {
        color: ${colors.success};
    }
     .trend-arrow.down{
        color: ${colors.danger};
    }


    .progress-bar {
        background-color: #f8f9fa;
        width: 100%;
        height: 5px;
        border-radius: 5px;
        overflow: hidden;

        .progress-fill {
            background-color: ${colors.success};
             height: 100%;
            transition: width 0.3s ease;

        }
    }
    &.widget-property{
        background-color: ${colors.white};
    }
    &.widget-tenants{
        background-color: ${colors.white};
    }
    &.widget-revenue{
        background-color: ${colors.white};
    }
`;



export const AnimatedCard = styled(CCard)`
    animation: ${fadeIn} 0.5s ease-in-out, ${slideInFromLeft} 0.5s ease-in-out;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 20px;
    background: ${colors.white};

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    .chart-header, .table-header{
        padding: 15px 20px;
        font-weight: bold;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
     .chart-body, .table-body{
        padding: 20px;

    }

`;


export const ColoredCard = styled(CCard)`
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.color || '#f0f0f0'};
    color: ${colors.white};
    transition: transform 0.3s ease;

    .border-start {
        border-left: 4px solid ${colors.white} !important;
    }

     &:hover {
      transform: translateY(-3px);
    }
    .chart-container{
        text-align: right;
        margin-top: 5px;
        opacity: 0.7;
    }

    &.widget-pending {
        background-color: ${colors.warning};
    }
     &.widget-new-tenants{
        background-color: ${colors.info};
    }
      &.widget-avg-rent{
        background-color: ${colors.success};
    }
      &.widget-maintenance-task{
        background-color: ${colors.danger};
    }

`;

export const StyledTable = styled(CTable)`
   border-collapse: separate;
    border-spacing: 0 8px;
  
    th {
        background: #f8f9fa;
        border: none;
        padding: 1rem;
        font-weight: 600;
    }

     td {
        padding: 1rem;
        background: white;
        border: none;
          &:first-child {
          border-radius: 8px 0 0 8px;
        }

        &:last-child {
          border-radius: 0 8px 8px 0;
        }
     }
      tr {
        transition: all 0.2s ease;

            &:hover td {
                background: #f8f9fa;
                transform: scale(1.01);
        }
    }
`;


export const ViewAllButton = styled.button`
    background-color: ${colors.info};
    color: ${colors.white};
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    float: right;
    &:hover{
        background-color: #1f79b3;
    }
`;


export const ChartContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;