import React from 'react';
import { CIcon } from '@coreui/icons-react';
import { cilClock, cilCheckCircle, cilTask, cilThumbUp, cilXCircle, cilZoom, cilThumbDown } from '@coreui/icons';

export const getStatusIcon = (status) => {
    const statusIconMap = {
        pending: <CIcon icon={cilClock} className="text-warning" title="Pending" />,
        'in progress': <CIcon icon={cilTask} className="text-info" title="In Progress" />,
        completed: <CIcon icon={cilThumbUp} className="text-success" title="Completed" />,
        cancelled: <CIcon icon={cilXCircle} className="text-danger" title="Cancelled" />,
        inspected: <CIcon icon={cilZoom} className="text-info" title="Inspected" />,
        incomplete: <CIcon icon={cilThumbDown} className="text-dark" title="Incomplete" />,
        approved: <CIcon icon={cilCheckCircle} className="text-primary" title="Approved" />,
    };
    return statusIconMap[status?.toLowerCase()] || null;
};