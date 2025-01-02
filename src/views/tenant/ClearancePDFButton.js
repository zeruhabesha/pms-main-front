// ClearancePDFButton.js
import React from 'react';
import { CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPrint } from '@coreui/icons';
import jsPDF from 'jspdf';

const ClearancePDFButton = ({ tenant }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return "N/A";
    }
  };

  const generateClearancePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(20);
    doc.text('Tenant Clearance Document', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    const startY = 40;
    let currentY = startY;
    const lineHeight = 10;
    const maxWidth = 180;

    const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
      const textLines = doc.splitTextToSize(text, maxWidth);
      textLines.forEach((line) => {
        if (currentY + lineHeight > pageHeight) {
          doc.addPage();
          currentY = startY;
        }
        doc.text(x, currentY, line);
        currentY += lineHeight;
      });
    };

    // Add tenant information
    const info = [
      `Tenant Name: ${tenant?.tenantName || 'N/A'}`,
      `Email: ${tenant.contactInformation?.email || 'N/A'}`,
      `Start Date: ${formatDate(tenant.leaseAgreement?.startDate)}`,
      `End Date: ${formatDate(tenant.leaseAgreement?.endDate)}`,
      `Address: ${tenant.contactInformation?.address || 'N/A'}`,
      `Phone Number: ${tenant.contactInformation?.phoneNumber || 'N/A'}`,
      'Lease Information',
      `Security Deposit: ${tenant.leaseAgreement?.securityDeposit || 'N/A'}`,
      `Rent Amount: ${tenant.leaseAgreement?.rentAmount || 'N/A'}`,
      `Payment Frequency: ${tenant.leaseAgreement?.paymentFrequency || 'N/A'}`
    ];

    info.forEach(text => {
      addWrappedText(text, 14, currentY, maxWidth, lineHeight);
    });

    doc.text("Clearance Status:", 14, currentY + 15);
    doc.setFontSize(14);
    doc.text("Cleared", 14, currentY + 25);

    doc.save(`tenant_clearance_${tenant?.tenantName?.replace(/ /g, "_") || 'unknown'}.pdf`);
  };

  return (
    <CButton
      color="light"
      size="sm"
      className="ms-2"
      onClick={generateClearancePDF}
      title="Print Clearance"
    >
      <CIcon icon={cilPrint} />
    </CButton>
  );
};

export default ClearancePDFButton;