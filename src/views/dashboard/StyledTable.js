import React from 'react';
import styled from 'styled-components';
import { CTable } from '@coreui/react';
import { colors } from './theme';// Assuming colors are defined in theme.js

const StyledTableContainer = styled(CTable)`
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

            &:hover {
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

const StyledTable = ({ children, ...props }) => {
  return (
      <StyledTableContainer {...props}>
          {children}
      </StyledTableContainer>
  );
};

export default StyledTable;