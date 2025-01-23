import React from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CRow,
    CCol,
    CAlert,
    CSpinner,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { createGuest } from '../../api/actions/guestActions';
import { useNavigate } from 'react-router-dom';
import { reset } from '../../api/slice/guestSlice';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import PropertySelect from './PropertySelect';

const AddGuest = ({ onCancel }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.guest);

    const user = "66092f0a18c25a177c011766"; //get from the logged user or some auth state
     const watchedProperty = watch("property")

    const onSubmit = async (data) => {
      try {
          await dispatch(createGuest({
                  ...data,
                  user: user,
              })).unwrap();

          toast.success('Guest added successfully!');
          dispatch(reset());
           onCancel();
      } catch (error) {
            toast.error(error.message || 'Failed to add guest');
        }
    };


    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Add Guest</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit(onSubmit)}>
                            <CRow className="g-3">
                                <CCol md={6}>
                                    <CFormInput
                                        {...register('name', { required: 'Name is required' })}
                                        label="Name"
                                        type="text"
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                    {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        {...register('email')}
                                        label="Email"
                                        type="email"
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                    {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        {...register('phoneNumber', { required: 'Phone number is required' })}
                                        label="Phone Number"
                                        type="tel"
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                    {errors.phoneNumber && <span style={{ color: "red" }}>{errors.phoneNumber.message}</span>}
                                </CCol>
                                <CCol md={6}>
                                      <PropertySelect
                                        value={watchedProperty}
                                        onChange={(e) => {}}
                                       required
                                       register={register}
                                    />
                                </CCol>
                                 <CCol md={6}>
                                    <CFormInput
                                        {...register('arrivalDate', { required: 'Arrival date is required' })}
                                        label="Arrival Date"
                                        type="date"
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                    {errors.arrivalDate && <span style={{ color: "red" }}>{errors.arrivalDate.message}</span>}
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        {...register('departureDate')}
                                        label="Departure Date"
                                        type="date"
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                     {errors.departureDate && <span style={{ color: "red" }}>{errors.departureDate.message}</span>}
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        {...register('reason', { required: 'Reason is required' })}
                                        label="Reason for Visit"
                                        type="text"
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                    {errors.reason && <span style={{ color: "red" }}>{errors.reason.message}</span>}
                                </CCol>

                                 <CCol md={6}>
                                    <CFormInput
                                        {...register('accessCode')}
                                        label="Access Code"
                                        type="text"
                                         style={{ backgroundColor: 'aliceblue' }}
                                    />
                                     {errors.accessCode && <span style={{ color: "red" }}>{errors.accessCode.message}</span>}
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        {...register('notes')}
                                        label="Notes"
                                        type="textarea"
                                         style={{ backgroundColor: 'aliceblue' }}
                                    />
                                     {errors.notes && <span style={{ color: "red" }}>{errors.notes.message}</span>}
                                </CCol>
                            </CRow>
                            <div className="d-flex justify-content-end mt-3">
                                <CButton color="secondary" onClick={() =>  onCancel()} disabled={isLoading}>
                                    Cancel
                                </CButton>
                                <CButton color="dark" type="submit" disabled={isLoading} className="ms-2">
                                    {isLoading ? <CSpinner size="sm" /> : 'Add Guest'}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AddGuest;