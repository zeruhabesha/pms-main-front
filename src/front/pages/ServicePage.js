import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion'; // For animation
import {
  FaUserFriends,
  FaFileContract,
  FaTools,
  FaDollarSign,
  FaUserCircle,
  FaChartLine,
  FaComments,
  FaHouseUser,
  FaFolderOpen,
  FaClipboardList,
} from 'react-icons/fa';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react';

// Services data
const services = [
  {
    id: 1,
    title: 'Tenant Management',
    icon: FaUserFriends,
    description: 'Manage tenant profiles, rental agreements, and payment tracking.',
    details: 'Our tenant management system helps landlords and property managers automate rent reminders, track payments, and maintain tenant records effortlessly.',
  },
  {
    id: 2,
    title: 'Lease & Contracts',
    icon: FaFileContract,
    description: 'Simplified lease creation and management with cloud storage.',
    details: 'Create, manage, and store all your lease agreements in one place. Automated renewal alerts ensure that you never miss important deadlines.',
  },
  {
    id: 3,
    title: 'Property Maintenance',
    icon: FaTools,
    description: 'Schedule and track property maintenance with ease.',
    details: 'BetaPMS allows tenants to submit maintenance requests while property managers can track jobs from start to completion, ensuring timely repairs and upkeep.',
  },
  {
    id: 4,
    title: 'Financial Management',
    icon: FaDollarSign,
    description: 'Track rent payments, generate invoices, and manage your finances.',
    details: 'Our financial management tool simplifies tracking rent payments, expenses, and financial reporting for all your properties. Generate invoices and detailed financial reports to manage your income and expenses with ease.',
  },
  {
    id: 5,
    title: 'Tenant Portal',
    icon: FaUserCircle,
    description: 'Give tenants access to their account, make payments, and submit requests.',
    details: 'Our tenant portal enables tenants to log in, view their payment history, submit maintenance requests, and make online payments. This increases tenant engagement and improves communication.',
  },
  {
    id: 6,
    title: 'Reporting & Analytics',
    icon: FaChartLine,
    description: 'Get detailed reports and analytics for informed decision-making.',
    details: 'Gain real-time insights into your property performance with detailed reporting and analytics. Analyze occupancy rates, income, expenses, and maintenance costs to make data-driven decisions for your property.',
  },
  {
    id: 7,
    title: 'Communication Tools',
    icon: FaComments,
    description: 'Centralized communication between tenants, owners, and managers.',
    details: 'Our built-in communication tools allow property managers to communicate directly with tenants and owners through messaging, automated alerts, and notifications, all from a single dashboard.',
  },
  {
    id: 8,
    title: 'Vacancy Management',
    icon: FaHouseUser,
    description: 'Efficiently manage property vacancies and track applications.',
    details: 'Our vacancy management module helps property managers keep track of available units, advertise them online, and manage applications, ensuring you fill vacancies quickly and efficiently.',
  },
  {
    id: 9,
    title: 'Document Management',
    icon: FaFolderOpen,
    description: 'Securely store and manage property-related documents.',
    details: 'Safely store and organize all your property-related documents in one place. Our document management system allows you to securely upload, categorize, and access important files such as lease agreements, financial records, and legal documents.',
  },
  {
    id: 10,
    title: 'Task Management',
    icon: FaClipboardList,
    description: 'Assign and manage tasks among your team efficiently.',
    details: 'Our task management feature allows property managers to assign, track, and monitor tasks related to property management. Stay organized by keeping track of maintenance schedules, inspections, and administrative tasks.',
  },
];

const ServicesPage = () => {
  // State to control which service's modal is open
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      <Navbar />
      <CContainer fluid className="py-5">
        <CRow>
          <CCol>
            <h1 className="text-center mb-4">Our Services</h1>
            <p className="text-center mb-4">
              BetaPMS offers a comprehensive solution for property management, making it easier for landlords, property managers, and tenants to handle day-to-day operations.
            </p>
          </CCol>
        </CRow>
        <CRow className="justify-content-center">
          {services.map((service) => (
            <CCol key={service.id} xs="12" sm="6" md="4" lg="3" className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedService(service)}>
                <CCard className="h-100 cursor-pointer">
                  <CCardHeader className="d-flex align-items-center">
                    <service.icon className="me-2 text-success" /> {service.title}
                  </CCardHeader>
                  <CCardBody>
                    <p>{service.description}</p>
                    <CButton color="primary" variant="outline">
                      View More
                    </CButton>
                  </CCardBody>
                </CCard>
              </motion.div>
            </CCol>
          ))}
        </CRow>
      </CContainer>

      {selectedService && (
        <CModal visible={!!selectedService} onClose={() => setSelectedService(null)}>
          <CModalHeader>
            <CModalTitle>{selectedService.title}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>{selectedService.details}</p>
            <CButton color="secondary" onClick={() => setSelectedService(null)}>
              Close
            </CButton>
          </CModalBody>
        </CModal>
      )}
      <Footer />
    </div>
  );
};

export default ServicesPage;
