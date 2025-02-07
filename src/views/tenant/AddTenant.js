import React, { useState, useEffect, useRef } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CInputGroup,
  CAlert,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react';
import {
  cilTrash,
  cilPlus,
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
  cilContact,
  cilCloudUpload, // Icon for upload
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { useDispatch } from 'react-redux';
import {
  addTenant,
  updateTenant,
  fetchTenantById,
  uploadTenantPhoto,
    fetchTenants,
} from '../../api/actions/TenantActions';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import './TenantTable.scss'; // Import the dedicated CSS file

const AddTenant = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [tenantData, setTenantData] = useState({
        tenantName: '',
        contactInformation: {
            email: '',
            phoneNumber: '',
            emergencyContact: '',
        },
        emergencyContacts: [''],
    });

    const [idProofFiles, setIdProofFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false); // State for drag feedback
    const fileInputRef = useRef(null); // Ref for hidden file input
    const isEditing = !!id;

    useEffect(() => {
        const controller = new AbortController();

        if (isEditing) {
            const fetchTenantData = async () => {
                setIsLoading(true);
                try {
                    const tenant = await dispatch(fetchTenantById(id)).unwrap();
                    if (tenant) {
                        setTenantData({
                            tenantName: tenant.tenantName || '',
                            contactInformation: {
                                email: tenant.contactInformation?.email || '',
                                phoneNumber: tenant.contactInformation?.phoneNumber || '',
                                emergencyContact: tenant.contactInformation?.emergencyContact || '',
                            },
                            emergencyContacts: tenant.emergencyContacts || [''],
                        });
                    }
                } catch (error) {
                    if (!controller.signal.aborted) {
                        toast.error(error.message || 'Failed to fetch tenant');
                        navigate('/tenants');
                    }
                } finally {
                    if (!controller.signal.aborted) {
                        setIsLoading(false);
                    }
                }
            };

            fetchTenantData();
        }

        return () => {
            controller.abort();
        };
    }, [dispatch, navigate, id, isEditing]);


    const resetForm = () => {
        setTenantData({
            tenantName: '',
            contactInformation: {
                email: '',
                phoneNumber: '',
                emergencyContact: '',
            },
            emergencyContacts: [''],
        });
        setIdProofFiles([]);
        setErrorMessage('');
    };

    const validateForm = () => {
      const errors = [];

        if (!tenantData.tenantName.trim()) {
            errors.push('Tenant name is required');
        }

        if (!tenantData.contactInformation.email.trim()) {
            errors.push('Email is required');
        }

      if (errors.length > 0) {
        setErrorMessage(errors.join(', '));
        return false;
      }
      return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            console.log("Sending tenant data:", tenantData);
            const { idProof, paymentMethod, moveInDate, ...jsonTenantData } = tenantData; // Removed paymentMethod and moveInDate
            if (isEditing) {
                await dispatch(updateTenant({ id, tenantData: jsonTenantData })).unwrap();
                toast.success("Tenant updated successfully");
            } else {
                 await dispatch(addTenant(jsonTenantData)).unwrap();
                toast.success("Tenant added successfully");
            }
               if (idProofFiles.length > 0) {
                   const formData = new FormData();
                   idProofFiles.forEach((file, index) => {
                       formData.append('idProof', file);
                   });
                 await dispatch(uploadTenantPhoto({
                     id: isEditing ? id : (await dispatch(fetchTenants()).unwrap()).tenants[(await dispatch(fetchTenants()).unwrap()).tenants.length - 1]?._id,
                       photo: formData
                 })).unwrap()
                }
            navigate("/tenant");
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to save tenant");
            setErrorMessage(error.message || "Failed to save tenant");
        } finally {
            setIsLoading(false);
        }
    };

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const handleFileChange = (files) => { // Modified to accept files directly
        const fileArray = Array.from(files);

        if (fileArray.length > 3) {
            toast.warning('Maximum 3 files allowed');
            return;
        }

        const oversizedFiles = fileArray.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            toast.warning('Some files exceed the maximum size limit of 5MB');
            return;
        }

        setIdProofFiles(fileArray);
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...idProofFiles];
        updatedFiles.splice(index, 1);
        setIdProofFiles(updatedFiles);
      setTenantData((prev) => ({...prev, idProof: updatedFiles.map(f => f.name)}));
    };

    const handleArrayChange = (index, value, arrayName) => {
      setTenantData(prevState => {
            const updatedArray = [...prevState[arrayName]];
        updatedArray[index] = value;
        return {...prevState, [arrayName]: updatedArray};
      });
    };

    const handleAddArrayItem = (arrayName) => {
        setTenantData(prevState => {
            return {...prevState, [arrayName]: [...prevState[arrayName], '']};
        });
    };

    const handleRemoveArrayItem = (index, arrayName) => {
          setTenantData(prevState => {
            const updatedArray = [...prevState[arrayName]];
        updatedArray.splice(index, 1);
        return {...prevState, [arrayName]: updatedArray};
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow drop
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        handleFileChange(droppedFiles); // Use existing handler
    };

    const triggerFileInput = () => {
        fileInputRef.current.click(); // Programmatically trigger file input click
    };

    const handleFileInputChange = (e) => { // Handler for the hidden file input
        const files = e.target.files;
        handleFileChange(files); // Use existing handler
    };


  return (
    <div className="add-tenant-container" style={{ padding: '20px' }}>
          <CCard className="mb-4" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <CCardHeader style={{ backgroundColor: '#f0f2f5', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', padding: '15px' }} className="d-flex justify-content-between align-items-center">
                <strong style={{ fontWeight: 'bold', color: '#333' }}>{isEditing ? 'Edit Tenant' : 'Add Tenant'}</strong>
            </CCardHeader>
        <CCardBody style={{ padding: '20px' }}>
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormInput
                label={<><CIcon icon={cilUser} className="me-1" /> <span style={{ fontWeight: '500' }}>Tenant Name</span></>}
                name="tenantName"
                style={{ backgroundColor: 'aliceblue', borderRadius: '5px', border: '1px solid #ddd', padding: '8px' }}
                value={tenantData.tenantName}
                onChange={(e) => setTenantData({...tenantData, tenantName: e.target.value})}
                required
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                   label={<><CIcon icon={cilEnvelopeOpen} className="me-1" /> <span style={{ fontWeight: '500' }}>Email</span></>}
                type="email"
                name="email"
                style={{ backgroundColor: 'aliceblue', borderRadius: '5px', border: '1px solid #ddd', padding: '8px' }}
                value={tenantData.contactInformation.email}
                onChange={(e) =>
                  setTenantData({
                    ...tenantData,
                    contactInformation: {
                      ...tenantData.contactInformation,
                      email: e.target.value,
                    },
                  })
                }
                required
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
                <CCol md={6} className="mb-3">
                    <CFormInput
                        label={<><CIcon icon={cilPhone} className="me-1" /> <span style={{ fontWeight: '500' }}>Phone Number</span></>}
                        name="phoneNumber"
                        style={{ backgroundColor: 'aliceblue', borderRadius: '5px', border: '1px solid #ddd', padding: '8px' }}
                        value={tenantData.contactInformation.phoneNumber}
                        onChange={(e) =>
                            setTenantData({
                                ...tenantData,
                                contactInformation: {
                                    ...tenantData.contactInformation,
                                    phoneNumber: e.target.value,
                                },
                            })
                        }
                        required
                    />
                </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                  label={<><CIcon icon={cilContact} className="me-1" /> <span style={{ fontWeight: '500' }}>Emergency Contact</span></>}
                name="emergencyContact"
                style={{ backgroundColor: 'aliceblue', borderRadius: '5px', border: '1px solid #ddd', padding: '8px' }}
                value={tenantData.contactInformation.emergencyContact}
                onChange={(e) =>
                  setTenantData({
                    ...tenantData,
                    contactInformation: {
                      ...tenantData.contactInformation,
                      emergencyContact: e.target.value,
                    },
                  })
                }
              />
            </CCol>

          </CRow>


          <CRow className="mb-4"> {/* Increased margin bottom for Emergency Contacts section */}
            <CCol md={12} className="mb-3">
                 <label style={{ fontWeight: '500' }}><CIcon icon={cilContact} className="me-1" />Emergency Contacts</label>
                {tenantData.emergencyContacts.map((contact, index) => (
                    <CRow key={index} className="align-items-center mb-2">
                        <CCol xs={10}>
                            <CFormInput
                                value={contact}
                                placeholder={`Emergency Contact ${index + 1}`}
                                style={{ backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ddd', padding: '8px' }}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'emergencyContacts')}
                            />
                        </CCol>
                        <CCol xs={2} style={{ textAlign: 'right' }}>
                            <CButton
                                size="sm"
                                color="light"
                                style={{ color: 'red' }}
                                onClick={() => handleRemoveArrayItem(index, 'emergencyContacts')}
                            >
                                <CIcon icon={cilTrash}/>
                            </CButton>
                        </CCol>
                    </CRow>
                ))}
                <CButton size="sm" color="dark" onClick={() => handleAddArrayItem('emergencyContacts')}>
                    <CIcon icon={cilPlus} className=""/> Add Contact
                </CButton>
            </CCol>

          </CRow>
           <CRow className="mb-4"> {/* Increased margin bottom for ID Proof section */}
            <CCol md={6} className="mb-3">
                 <label style={{ fontWeight: '500' }}>ID Proof (Max: 3)</label>
                 <div
                     className={`drag-drop-area ${isDragging ? 'drag-active' : ''}`}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                     onClick={triggerFileInput} // Open file dialog on click
                     style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #ddd', borderRadius: '5px', backgroundColor: isDragging ? '#f8f8f8' : 'white', textAlign: 'center' }}
                 >
                    <CIcon icon={cilCloudUpload} size="3xl" style={{ marginBottom: '10px', color: '#777' }} />
                    <div>Drag and drop files here or <span style={{ color: 'blue', textDecoration: 'underline' }}>click to browse</span></div>
                </div>
                 <CInputGroup className="mb-2" style={{ display: 'none' }}> {/* Hidden file input */}
                    <CFormInput
                      type="file"
                      name="idProof"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileInputChange}
                      ref={fileInputRef}
                    />
                  </CInputGroup>

                <CRow className="mt-2">
                    {idProofFiles.map((file, idx) => (
                        <CCol key={idx} xs={12}
                              className="d-flex align-items-center justify-content-between mb-1" // Added margin bottom for file items
                              style={{ padding: '5px 0', borderBottom: '1px dashed #eee' }} // Added border for separation
                        >
                            <span style={{ fontSize: '0.9em' }}>{file.name}</span> {/* Slightly smaller font */}
                            <CButton size="sm" color="light" onClick={() => handleRemoveFile(idx)}>
                                <CIcon icon={cilTrash}/>
                            </CButton>
                        </CCol>
                    ))}
                </CRow>
            </CCol>
           </CRow>
          <div className="d-flex justify-content-end mt-4"> {/* Increased margin top for buttons */}
            <CButton
              color="secondary"
              onClick={() => navigate('/tenant')}
              disabled={isLoading}
              style={{ marginRight: '10px', borderRadius: '5px' }} // Added right margin and border-radius
            >
              Cancel
            </CButton>
            <CButton color="dark" type="submit" disabled={isLoading} className="ms-2" style={{ borderRadius: '5px' }}> {/* Added border-radius */}
                {isLoading ? <CSpinner size="sm"/> : isEditing ? 'Update Tenant' : 'Add Tenant'}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
      </CCard>
    </div>
  );
};

export default AddTenant;