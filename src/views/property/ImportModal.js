import React, { useState } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CButton,
    CForm,
    CFormInput,
    CAlert
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { importProperties } from '../../api/actions/PropertyAction'; // Import your new action
import { toast } from 'react-toastify';
import Papa from 'papaparse';

const ImportModal = ({ visible, onClose }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
     const dispatch = useDispatch();


     const handleFileChange = (e) => {
          setFile(e.target.files[0]);
     };


    const handleImport = async () => {
        if (!file) {
            setError('Please select a file to import.');
             return;
        }
         setLoading(true)
         setError(null)
       try {
             const reader = new FileReader();

          reader.onload = async (e) => {
             const csvData = e.target.result;

               Papa.parse(csvData, {
                    header: true,
                   complete: async (results) => {
                     if(results.data){
                          try {
                            const response = await dispatch(importProperties(results.data)).unwrap();
                              if(response.success){
                                toast.success('Properties imported successfully!');
                                 onClose()
                              } else {
                                  setError(response.message || 'Failed to import properties.')
                              }
                        } catch (err) {
                            setError(err.message || 'Failed to import properties.');
                             } finally {
                             setLoading(false);
                         }
                     } else {
                       setError("error parsing CSV file")
                    }
                   }
             });
          };
          reader.onerror = () => {
            setError('Error reading file.');
            setLoading(false);
          };

          reader.readAsText(file)

         }  catch (err) {
               setError(err.message || 'Failed to import properties.');
            } finally {
                 setLoading(false);
          }
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>Import Properties</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {error && <CAlert color="danger">{error}</CAlert>}
                <CForm>
                    <CFormInput
                        type="file"
                        accept=".csv"
                        label="Choose CSV File"
                         onChange={handleFileChange}
                    />
                     <CButton  className="mt-3" color="primary" onClick={handleImport} disabled={loading}>
                        {loading ? 'Importing...' : 'Import'}
                      </CButton>
                    {/* You might add loading indicators and/or feedback messages here */}
                </CForm>
            </CModalBody>
        </CModal>
    );
};

export default ImportModal;