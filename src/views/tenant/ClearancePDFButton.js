import React from 'react';
import { CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPrint } from '@coreui/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './pdf.scss'

const ClearancePDFButton = ({ tenant }) => {
    const generateClearancePDF = () => {
        const doc = new jsPDF();
      
        // Add a title with styles
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text('Tenant Clearance Document', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
        // Add horizontal line
        doc.setLineWidth(0.5);
        doc.setDrawColor(100);
        doc.line(10, 25, doc.internal.pageSize.getWidth() - 10, 25);
      
        // Add tenant details section
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Tenant Details:', 14, 35);
      
        const tenantDetails = [
          { label: 'Name', value: tenant?.tenantName || 'N/A' },
          { label: 'Email', value: tenant.contactInformation?.email || 'N/A' },
          { label: 'Phone Number', value: tenant.contactInformation?.phoneNumber || 'N/A' },
          { label: 'Address', value: tenant.contactInformation?.address || 'N/A' },
          { label: 'Start Date', value: tenant.leaseAgreement?.startDate || 'N/A' },
          { label: 'End Date', value: tenant.leaseAgreement?.endDate || 'N/A' },
          { label: 'Security Deposit', value: tenant.leaseAgreement?.securityDeposit?.toString() || 'N/A' },
          { label: 'Rent Amount', value: tenant.leaseAgreement?.rentAmount?.toString() || 'N/A' },
          { label: 'Payment Frequency', value: tenant.leaseAgreement?.paymentFrequency || 'N/A' },
        ];
      
        const lineHeight = 8;
        let currentY = 45;
      
        tenantDetails.forEach(({ label, value }) => {
          // Convert value to string to prevent errors
          doc.text(`${label}:`, 14, currentY);
          doc.setFont('helvetica', 'bold');
          doc.text(value.toString(), 60, currentY);
          doc.setFont('helvetica', 'normal');
          currentY += lineHeight;
        });
      
        // Add clearance status
        currentY += 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Clearance Status:', 14, currentY);
        doc.setFontSize(16);
        doc.setTextColor(0, 128, 0); // Green color
        doc.text('Cleared', 14, currentY + 10);
      
        // Add signature line
        currentY += 30;
        doc.setTextColor(40);
        doc.setFontSize(12);
        doc.text('Authorized Signature:', 14, currentY);
        doc.line(60, currentY, 140, currentY); // Signature line
      
        // Save the PDF
        doc.save(`tenant_clearance_${tenant?.tenantName?.replace(/ /g, '_') || 'unknown'}.pdf`);
      };
      

  return (
    <CButton
      color="light"
      size="sm"
      className="ms-2"
      title="Print Clearance"
      onClick={generateClearancePDF}
    >
      <CIcon icon={cilPrint} /> 
    </CButton>
  );
};

export default ClearancePDFButton;
