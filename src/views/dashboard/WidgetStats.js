import React from 'react';
import styled from 'styled-components';
import CIcon from '@coreui/icons-react';
import { colors } from './theme'; // Assuming colors are defined in theme.js

const WidgetStatsContainer = styled.div`
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

        &.up {
            background-color: rgba(0, 123, 255, 0.3);
            color: ${colors.white};

            &:before {
                content: "▲";
                color: ${colors.white};
            }
        }

        &.down {
            background-color: rgba(255, 69, 0, 0.3);
            color: ${colors.white};

            &:before {
                content: "▼";
                color: ${colors.white};
            }
        }
    }
`;


const WidgetStats = ({ className, value, title, icon, trend, color }) => {
    return (
        <WidgetStatsContainer className={className}>
            <div className="widget-header">
                {icon}
                <span className="title">{title}</span>
            </div>
            <div className="value">{value}</div>
           {trend && ( <span className={`trend-arrow ${trend.type}`}>{trend.value}</span> )}
        </WidgetStatsContainer>
    );
};

export default WidgetStats;