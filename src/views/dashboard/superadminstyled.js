import styled, { keyframes } from 'styled-components';
import { CCard, CWidgetStatsC, CButton, CTable } from '@coreui/react';

// Colors
export const colors = {
    primary: '#321fdb',       // Primary color for admins
    success: '#2eb85c',       // Success color (e.g., properties)
    info: '#39f',          // Info color (e.g., tenants)
    warning: '#ffc107',     // Warning color (e.g., revenue)
    danger: '#e55353',      // Danger color
    light: '#f9f9f9',
    dark: '#2f353a',
    white: '#fff',
    gray: '#8a8a8a',
};


// Animation Keyframes
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
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

// Widget Styles
export const WidgetStatsContainer = styled(CWidgetStatsC)`
  &.widget-admin {
    .icon-wrapper {
      color: ${colors.primary}; // Admin icon color
      background-color: ${colors.light};
    }
  }
  &.widget-property {
    .icon-wrapper {
      color: ${colors.success}; // Property icon color
      background-color: ${colors.light};
    }
  }
  &.widget-tenants {
    .icon-wrapper {
      color: ${colors.info}; // Tenant icon color
      background-color: ${colors.light};
    }
  }
  &.widget-revenue {
    .icon-wrapper {
      color: ${colors.warning}; // Revenue icon color
      background-color: ${colors.light};
    }
  }


  .widget-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    .icon {
      margin-right: 0.5rem;
      font-size: 1.5rem;
    }

    .title {
      font-size: 1rem;
      font-weight: bold;
      color: ${colors.dark};
    }
  }

  .value {
    font-size: 2rem;
    font-weight: bold;
    color: ${colors.dark};
    margin-bottom: 0.25rem;
  }

  .trend-arrow {
    font-size: 0.875rem;
    &.up {
      color: ${colors.success};
    }
    &.down {
      color: ${colors.danger};
    }
  }
`;


// Animated Card
export const AnimatedCard = styled(CCard)`
  animation: ${fadeIn} 0.5s ease-out;
  &.chart-card, &.table-card {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }
  }
  &.chart-card {
    .chart-header {
      background-color: ${colors.light};
      color: ${colors.dark};
      border-bottom: 1px solid rgba(0,0,0,.125);
      font-weight: 500;
    }
    .chart-body {
      background-color: ${colors.white};
    }
  }
  &.table-card {
    .table-header {
      background-color: ${colors.light};
      color: ${colors.dark};
      border-bottom: 1px solid rgba(0,0,0,.125);
      font-weight: 500;
    }
    .table-body {
      background-color: ${colors.white};
    }
  }
`;

// Colored Card Widgets (Sparklines)
export const ColoredCard = styled(CCard)`
  &.widget-pending {
    background-color: ${colors.warning};
    color: ${colors.white};
    border-left-color: ${colors.dark}; // Example: Darker border for contrast
    border-left-width: 4px;
  }
  &.widget-new-tenants {
    background-color: ${colors.info};
    color: ${colors.white};
    border-left-color: ${colors.dark};
    border-left-width: 4px;
  }
  &.widget-avg-rent {
    background-color: ${colors.success};
    color: ${colors.white};
    border-left-color: ${colors.dark};
    border-left-width: 4px;
  }
    &.widget-maintenance-task {
    background-color: ${colors.danger};
    color: ${colors.white};
    border-left-color: ${colors.dark};
    border-left-width: 4px;
  }
    .chart-container {
    margin-top: 0.5rem;
    svg {
      path {
        fill: none;
        stroke: ${colors.white};
        stroke-width: 2;
      }
      rect {
        fill: ${colors.white};
      }
    }
  }
`;


// Table Styles
export const StyledTable = styled(CTable)`
  background-color: ${colors.white};
  border-collapse: separate;
  border-spacing: 0 8px;

  & > :not(:first-child) {
    border-top: 1px solid ${colors.light};
  }

  & > :not(:last-child) {
    border-bottom: 1px solid ${colors.light};
  }


  thead {
    border-bottom: 2px solid ${colors.gray};
    th {
      background-color: ${colors.light};
      border-bottom: 2px solid ${colors.gray};
      font-weight: bold;
      color: ${colors.dark};
      padding: 0.75rem 1.5rem;
      text-align: left;
      &:first-child {
        border-radius: 8px 0 0 0;
      }
      &:last-child {
        border-radius: 0 8px 0 0;
      }
    }
  }
  tbody {
    tr {
      &.table-row-item {
        background-color: ${colors.white};
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: background-color 0.2s ease;
        &:hover {
          background-color: ${colors.light};
        }
        &:first-child td {
           border-top: none;
        }
        &:last-child td {
          border-bottom: none;
        }
      }
      td {
        padding: 0.75rem 1.5rem;
        vertical-align: middle;
        &:first-child {
          border-left: none;
          border-radius: 8px 0 0 8px;
        }
        &:last-child {
          border-right: none;
          border-radius: 0 8px 8px 0;
        }
      }
    }
  }
`;

export const ViewAllButton = styled(CButton)`
  background-color: ${colors.primary};
  color: ${colors.white};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.dark};
  }
`;

export const ChartContainer = styled.div`
  height: 300px !important; /* Or adjust as needed */
  width: 100% !important;
  position: relative; /* To contain the chart within this area */
`;