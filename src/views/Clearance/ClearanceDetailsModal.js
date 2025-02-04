// ClearanceDetailsModal.js
import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CForm, CFormLabel, CFormInput, CCol, CRow, CFormSelect } from '@coreui/react';
import { useDispatch } from 'react-redux';
import { updateClearance, addClearance } from '../../api/actions/ClearanceAction';
import { toast } from 'react-toastify';
import { fetchTenantById } from '../../api/actions/TenantActions';
import propertyService from '../../api/services/property.service';
import clearanceService from '../../api/services/clearance.service' // Import the clearance service


const ClearanceDetailsModal = ({ visible, setVisible, tenantId, onClearanceAdded }) => {
  const dispatch = useDispatch();
  const [clearanceData, setClearanceData] = useState({
    tenant: tenantId,
    property: '',
    moveOutDate: '',
    status: 'Pending',
    inspectionStatus: 'Pending',
    notes: '',
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [existingClearance, setExistingClearance] = useState(null);


  const handleCloseModal = () => {
    setVisible(false);
    setClearanceData({
      tenant: tenantId,
      property: '',
      moveOutDate: '',
      status: 'Pending',
      inspectionStatus: 'Pending',
      notes: '',
    });
    setSelectedProperty(null);
    setExistingClearance(null);
  };


  useEffect(() => {
    const fetchTenantAndProperties = async () => {
        setLoading(true);
         try {
             const tenantResponse = await dispatch(fetchTenantById(tenantId)).unwrap();
            setTenantDetails(tenantResponse);
            const allProperties = await propertyService.getProperties();
            const associatedProperty = allProperties.find(
                 (property) => property._id === tenantResponse?.propertyInformation?.propertyId
             );
             setSelectedProperty(associatedProperty);

            const existingClearance = await clearanceService.fetchClearances(1,1, '', '', tenantId);

             if (existingClearance?.clearances?.length > 0) {
                  setExistingClearance(existingClearance.clearances[0]);
                 setClearanceData(prevData => ({
                     ...prevData,
                    ...existingClearance.clearances[0],
                     property : associatedProperty?._id
                 }));
               }else {

                  setClearanceData(prevData => ({
                       ...prevData,
                        property : associatedProperty?._id
                  }));
               }

                 setProperties(allProperties);


        } catch (error) {
           console.error('Error fetching tenant or properties:', error);
           toast.error(error.message || 'Error fetching tenant or properties');
        } finally {
            setLoading(false);
        }
    };

    if (visible && tenantId) {
        fetchTenantAndProperties();
    }
  }, [visible, tenantId, dispatch]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setClearanceData((prevData) => ({
          ...prevData,
        [name]: value,
     }));
  };

   const handleSubmit = async () => {
       try {
        if (existingClearance && existingClearance._id && Object.keys(existingClearance).length > 0) {
          //Check for both existing clearance object and it's id. and also that the object is not empty before accessing the id
                await dispatch(updateClearance(existingClearance._id, clearanceData)).unwrap();
                console.log('updated clearance', clearanceData);
                 toast.success('Clearance updated successfully');
            } else {
              await dispatch(addClearance(clearanceData)).unwrap();
              console.log('created clearance', clearanceData);
                 toast.success('Clearance created successfully');
            }
             if (onClearanceAdded) {
                onClearanceAdded();
             }
           handleCloseModal();
       } catch (error) {
           toast.error(error.message || 'Failed to save clearance');
       }
  };


  return (
    <CModal size="lg" visible={visible} onClose={handleCloseModal}>
      <CModalHeader>
        <CModalTitle>Clearance Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loading ? (
          <p>Loading...</p>
        ) : tenantDetails && (
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="tenantName" className="col-sm-2 col-form-label">
                Tenant Name
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput type="text" id="tenantName" value={tenantDetails.tenantName} readOnly />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="property" className="col-sm-2 col-form-label">
                Property
              </CFormLabel>
             <CCol sm={10}>
                    <CFormInput
                        type="text"
                        id="property"
                        value={selectedProperty?.propertyName || 'Not Available'}
                        readOnly
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="moveOutDate" className="col-sm-2 col-form-label">
                Move Out Date
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  type="date"
                  id="moveOutDate"
                  name="moveOutDate"
                  value={clearanceData.moveOutDate}
                  // onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="status" className="col-sm-2 col-form-label">
                  Clearance Status
              </CFormLabel>
              <CCol sm={10}>
                  <CFormSelect
                      id="status"
                      name="status"
                      value={clearanceData.status}
                      onChange={handleInputChange}
                      required
                  >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                  </CFormSelect>
              </CCol>
          </CRow>
             <CRow className="mb-3">
              <CFormLabel htmlFor="notes" className="col-sm-2 col-form-label">
                Notes
              </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                      as="textarea"
                      id="notes"
                      name="notes"
                      value={clearanceData.notes}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </CCol>
              </CRow>
            <CRow>
              <CCol xs={12} className="text-end">
                <CButton color="secondary" onClick={handleCloseModal}>
                  Cancel
                </CButton>
                <CButton color="primary" className="ms-2" onClick={handleSubmit}>
                  Save
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
      </CModalBody>
    </CModal>
  );
};

export default ClearanceDetailsModal;