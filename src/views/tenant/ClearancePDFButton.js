import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CIcon } from '@coreui/icons-react';
import { cilPrint } from '@coreui/icons';
import { format } from 'date-fns';
import { CButton } from '@coreui/react';
import { decryptData } from '../../api/utils/crypto';

const ClearancePDFButton = ({ tenant }) => {
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '[Your Company Name]',
        companyAddress: '[Your Address]',
        fullName: '[Your Full Name]',
        position: '[Your Position]',
        contactInformation: '[Contact Information]',
    });

    useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser) {
                setCompanyInfo({
                    companyName: decryptedUser.name || '[Your Company Name]',
                    companyAddress: decryptedUser.address || '[Your Address]',
                    fullName: decryptedUser.fullName || '[Your Full Name]',
                    position: decryptedUser.position || '[Your Position]',
                    contactInformation:
                        `${decryptedUser.email || ''} ${decryptedUser.phoneNumber || ''}`.trim() || '[Contact Information]',
                });
            }
        }
    }, []);

    const generateClearancePDF = () => {
      const doc = new jsPDF();
      const today = format(new Date(), 'MMMM dd, yyyy');
  
      const tenantName = tenant?.tenantName || 'N/A';
      const tenantAddress = tenant?.contactInformation?.address || '[Property Address]';
      const tenantEmail = tenant?.contactInformation?.email || 'N/A';
      const tenantPhoneNumber = tenant?.contactInformation?.phoneNumber || 'N/A';
      const leaseStartDate = tenant?.leaseAgreement?.startDate
          ? format(new Date(tenant.leaseAgreement.startDate), 'MMMM dd, yyyy')
          : 'N/A';
      const leaseEndDate = tenant?.leaseAgreement?.endDate
          ? format(new Date(tenant.leaseAgreement.endDate), 'MMMM dd, yyyy')
          : 'N/A';
  
      // Document Header
      doc.setFontSize(12);
      doc.text(companyInfo.companyName, 14, 20);
      doc.text(companyInfo.companyAddress, 14, 26);
      doc.setFontSize(10);
      doc.text(today, 14, 40);
  
      // Tenant Details
      doc.setFontSize(12);
      doc.text(`Tenant: ${tenantName}`, 14, 50);
      doc.setFontSize(10);
      doc.text(`Address: ${tenantAddress}`, 14, 56);
      doc.text(`Email: ${tenantEmail}`, 14, 62);
      doc.text(`Phone: ${tenantPhoneNumber}`, 14, 68);
  
      // Subject
      doc.setFontSize(12);
      doc.text('Subject: Clearance Letter for Tenant', 14, 80);
  
      // Letter Body
      const letterBody = [
          `Dear ${tenantName},`,
          '', // Line break
          `This letter serves as a confirmation that you have fulfilled all your obligations as a tenant `,  `at ${tenantAddress}, managed by ${companyInfo.companyName}. We acknowledge the following:`,
          '', // Line break
          `1. Lease Agreement Termination: The lease agreement dated ${leaseStartDate}has been successfully`,  ` terminated as of ${leaseEndDate}.`,
          `2. Rent Payments: All rent payments due under the lease agreement have been made in full, `,  `and no outstanding balance remains.`,
          `3. Property Condition: The property has been inspected, and it has been returned in satisfactory condition,`,  ` as per the terms of the lease agreement.`,
          `4. Security Deposit: Your security deposit amounting to [Amount] has been refunded/adjusted as agreed,`,  ` with no deductions pending.`,
          '', // Line break
          `We appreciate your cooperation and adherence to the terms of the lease agreement during your tenancy. `,  `Should you require any further assistance or documents, feel free `,  `to contact us at ${companyInfo.contactInformation}.`,
          '', // Line break
          `We wish you all the best in your future endeavors.`,
          '', // Line break
          'Sincerely,',
          '', // Line break
          companyInfo.fullName,
          companyInfo.position,
          companyInfo.companyName,
          companyInfo.contactInformation,
      ];
  
      let currentY = 90;
      doc.setFontSize(10);
  
      letterBody.forEach((line) => {
          if (line) {
              doc.text(line, 14, currentY);
          }
          currentY += 6; // Move down for next line, simulate `<br>` by adjusting spacing
      });
  
      // Save PDF
      const fileName = `Clearance_Letter_${tenantName.replace(/\s/g, '_')}.pdf`;
      doc.save(fileName);
  };
  

    return (
        <CButton color="light" title="Print Clearance" onClick={generateClearancePDF} size="sm">
            <CIcon icon={cilPrint} className="me-2" />
            Clearance
        </CButton>
    );
};

export default ClearancePDFButton;
