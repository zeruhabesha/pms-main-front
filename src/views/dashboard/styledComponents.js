import styled, { keyframes } from 'styled-components';
import {
    CWidgetStatsC,
    CCard,
    CTable
} from '@coreui/react';

// Define Keyframes for animations
export const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const slideInFromLeft = keyframes`
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;


export const colors = {
    primary: '#007BFF',
    secondary: '#6C757D',
    success: '#28A745',
    info: '#17A2B8',
    warning: '#FFC107',
    danger: '#DC3545',
    light: '#F8F9FA',
    dark: '#343A40',
    white: '#fff',
    gray: '#eee'
}
export const WidgetStatsContainer = styled(CWidgetStatsC)`
     border-radius: 12px;
     overflow: hidden;
     position: relative;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
     transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          transform: translateY(-4px);
         box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }


        .widget-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;

          .icon {
             font-size: 1.8rem;
            }
            .title {
                font-size: 1.1rem;
                font-weight: 600;
                 color: ${colors.white};
            }
      }


        .value {
      font-size: 1.5rem !important; /* Increased font size and adds !important*/
      font-weight: bold;
      padding: 0 15px 5px 15px;
       color: ${colors.white};
  }

        &.widget-admin {
            background: linear-gradient(to right,rgb(204, 223, 239),${colors.white});

        }
        &.widget-property {
            background: linear-gradient(to right,rgb(202, 244, 212),${colors.white});

        }
        &.widget-tenants {
            background: linear-gradient(to right,rgb(197, 241, 248),${colors.white});
        }
        &.widget-revenue {
            background: linear-gradient(to right,rgb(245, 232, 192),${colors.white});

        }


          .trend-arrow {
            display: inline-block;
            padding: 3px 8px;
            font-size: 0.8rem;
            margin-left: auto;
            border-radius: 5px;

             &.up{
                 background-color: rgba(0, 123, 255, 0.3);
                 color: ${colors.white};

                &:before {
                  content: "▲";
                   color: ${colors.white};
                 }
             }
             &.down{
                  background-color: rgba(255, 69, 0, 0.3);
                  color: ${colors.white};
                   &:before {
                      content: "▼";
                      color: ${colors.white};
                }
             }
         }
`;

export const AnimatedCard = styled(CCard)`
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
    .table-body{
      padding: 20px;
    }
`;

export const ColoredCard = styled(CCard)`
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: ${slideInFromLeft} 0.4s ease;

      &:hover{
           transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.15);
      }
       .border-start {
             padding: 10px 15px;

         .text-body-secondary {
             font-size: 0.9rem;
         }
       }


    &.widget-pending {
        background: ${colors.light};
          .border-start{
              border-color: ${colors.primary} !important;
          }
      }
    &.widget-new-tenants {
          background: ${colors.light};
           .border-start{
              border-color: ${colors.success} !important;
          }
      }
    &.widget-avg-rent {
          background: ${colors.light};
           .border-start{
              border-color: ${colors.info} !important;
          }
      }
    &.widget-maintenance-task {
          background: ${colors.light};
          .border-start{
             border-color: ${colors.warning} !important;
          }
      }
`;


export const StyledTable = styled(CTable)`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;

    thead {
        tr {
            background-color: ${colors.light};
            th {
                padding: 10px 15px;
                text-align: left;
                font-weight: 600;
                 color: ${colors.dark};
            }
        }
    }
    tbody {
        tr {
             transition: background-color 0.3s ease;

            &:hover{
               background-color: ${colors.gray};
             }
            td {
                padding: 10px 15px;
                text-align: left;
                 color: ${colors.dark};
                vertical-align: middle;
            }
        }
    }
`;

export const ViewAllButton = styled.button`
    background-color: ${colors.dark};
    color: ${colors.white};
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
    overflow: hidden;
    position: relative;

        &:hover {
            background-color: rgb(6, 11, 16);
            transform: translateY(-2px);
        }
        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
        }
         &:active {
             transform: translateY(1px);
        }
          &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
                transition: left 0.5s ease-in-out;
            }
        &:hover::before {
            left: 100%;
          }
`;

export const ChartContainer = styled.div`
        animation: ${fadeIn} 1s ease;

`;


export const EnhancedChartCard = styled(CCard)`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .card-header {
        padding: 15px 20px;
        font-weight: 600;
        background: linear-gradient(to right, ${colors.light}, ${colors.gray});
    }

    .card-body {
        padding: 20px;
    }
`;

export const MetricCard = styled.div`
    background: ${props => props.gradient || colors.light};
    color: ${colors.white};
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    transition: transform 0.2s ease;

     .metric-header {
         display: flex;
         align-items: center;
         margin-bottom: 15px;
     }


    h4{
       margin-bottom: 15px;
    }
      .metric-body {
       display: flex;
       align-items: center;
       justify-content: flex-start;
    }
    &:hover {
        transform: translateY(-4px);
    }
`;
export const CircularProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* Adjust as needed */
`;

export const EnhancedTable = styled(CTable)`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
     border-radius: 8px;
     overflow: hidden;

    thead {
        tr {
            background-color: ${colors.light};
            th {
                padding: 12px 15px;
                text-align: left;
                font-weight: 600;
                 color: ${colors.dark};
                border-bottom: 1px solid ${colors.gray};
            }
        }
    }
    tbody {
      tr{
           transition: background-color 0.2s ease;
            &:hover {
            background-color: ${colors.gray};
           }
            td {
                padding: 12px 15px;
                text-align: left;
                 color: ${colors.dark};
                vertical-align: middle;
             }
      }
    }
`;

export const StatisticBox = styled.div`
    background-color: ${props => props.background || colors.white};
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    margin-bottom: 15px;

    .title {
        font-size: 0.9rem;
         color: ${colors.dark};
        margin-bottom: 5px;
    }
    .value {
        font-size: 1.4rem;
        font-weight: bold;
        color: ${colors.dark};
    }
`;

export const SummaryCard = styled.div`
   background-color: ${colors.light};
  border-radius: 10px;
   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
     display: flex;
    align-items: center;
  justify-content: space-between;
    transition: transform 0.2s ease;
      &:hover{
           transform: translateY(-2px);
           box-shadow: 0 5px 10px rgba(0,0,0,0.15);
      }


    .summary-icon {
        margin-right: 20px;
        display: flex;
        align-items: center;
    }
        .summary-content {
           display: flex;
           align-items: center;
        }
 `;

export const LabeledValue = styled.div`
   display: flex;
   flex-direction: column;
     white-space: nowrap;
      text-align: left;

      font-size: 1.2rem;
      font-weight: 600;
      color: ${colors.dark};
    span{
      font-size: 0.9rem;
     font-weight: 400;
    }
`;


export const SparkLine = styled.div`
  width: 100%;
  height: 30px;
  background: linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
  position: relative;
  overflow: hidden;
    &:before {
      content: '';
      position: absolute;
      top: 0;
        left: 0;
      width: ${props => props.data?.length * 10}px;
      height: 100%;
        background: rgba(255,255,255,0.4);
       animation: moveSparkLine 10s linear infinite;
    }
    @keyframes moveSparkLine {
       0% {
        transform: translateX(-100%);
      }
       100% {
        transform: translateX(0%);
      }
   }
`;