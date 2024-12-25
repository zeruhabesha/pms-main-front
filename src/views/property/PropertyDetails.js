import React, { useState, useEffect, useCallback } from 'react'
import {
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CSpinner,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilFullscreen, cilArrowLeft } from '@coreui/icons'
import AddImage from './AddImage'
import { useParams, useNavigate } from 'react-router-dom'
import { getProperty, deletePhoto, updatePhoto } from '../../api/actions/PropertyAction'
import { useDispatch } from 'react-redux'
import PropertyPhotoModal from './PropertyPhotoModal'

const PropertyDetails = () => {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFullscreenModalVisible, setFullscreenModalVisible] = useState(false)
  const [addImageModalVisible, setAddImageModalVisible] = useState(false)
  const [expandedImage, setExpandedImage] = useState(null)
  const [selectedPhotoToEdit, setSelectedPhotoToEdit] = useState(null) // Track the photo being edited
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await dispatch(getProperty(id)).unwrap()
        setProperty(response)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load property details.')
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [dispatch, id])

  const handleExpandImage = (photoUrl) => {
    if (photoUrl) {
      setExpandedImage(photoUrl)
      setFullscreenModalVisible(true)
    } else {
      console.error('Invalid photo URL provided to handleExpandImage')
    }
  }

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenModalVisible(false)
    setExpandedImage(null)
  }, [])

  const handleAddImageClick = () => {
    setAddImageModalVisible(true)
    setSelectedPhotoToEdit(null)
  }

  const handleCloseAddImageModal = useCallback(() => {
    setAddImageModalVisible(false)
    setSelectedPhotoToEdit(null)
  }, [])

  const handlePhotoDelete = async (photo) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        setLoading(true)
        await dispatch(deletePhoto({ propertyId: id, photoId: photo.id })).unwrap()
        const response = await dispatch(getProperty(id)).unwrap()
        setProperty(response)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to delete the photo.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePhotoUpdate = (photo) => {
    setSelectedPhotoToEdit(photo) // Set the photo to edit
    setAddImageModalVisible(true) // Open the modal
  }
  const handleUpdatePhotoSuccess = async () => {
    setAddImageModalVisible(false) // Close the modal
    setSelectedPhotoToEdit(null) // Clear the selected photo
    // Refetch the property data to reflect changes
    try {
      setLoading(true)
      const response = await dispatch(getProperty(id)).unwrap()
      setProperty(response)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to reload property data.')
    } finally {
      setLoading(false)
    }
  }
  const handlePhotoEdit = async (newPhotoFile) => {
    try {
      setLoading(true)
      await dispatch(
        updatePhoto({
          id: id,
          photo: newPhotoFile,
          photoId: selectedPhotoToEdit.id,
        }),
      ).unwrap()
      handleUpdatePhotoSuccess()
    } catch (error) {
      setError(error.message || 'Failed to update the photo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <CSpinner color="dark" />
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!property) {
    return <p>No property found!</p>
  }

  return (
    <>
      <CButton color="secondary" onClick={() => navigate('/property')} className="mb-3">
        <CIcon icon={cilArrowLeft} /> Back to Properties
      </CButton>
      <CCard className="border-0 shadow-sm">
        <CCardBody>
          <CTable bordered responsive>
            <CTableBody>
              <CTableRow>
                <CTableDataCell className="fw-bold">Title:</CTableDataCell>
                <CTableDataCell>{property.title || 'N/A'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Description:</CTableDataCell>
                <CTableDataCell>
                  {property.description || 'No description available'}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Address:</CTableDataCell>
                <CTableDataCell>{property.address || 'N/A'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Property Type:</CTableDataCell>
                <CTableDataCell>{property.propertyType || 'N/A'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Price:</CTableDataCell>
                <CTableDataCell>{property.price ? `$${property.price}` : 'N/A'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Rent Price:</CTableDataCell>
                <CTableDataCell>
                  {property.rentPrice ? `$${property.rentPrice}` : 'N/A'}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Number of Units:</CTableDataCell>
                <CTableDataCell>{property.numberOfUnits || 'N/A'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Floor Plan:</CTableDataCell>
                <CTableDataCell>{property.floorPlan || 'N/A'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Amenities:</CTableDataCell>
                <CTableDataCell>
                  {property.amenities && property.amenities.length > 0
                    ? property.amenities.join(', ')
                    : 'N/A'}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {/* Photos Section */}
          <CRow className="g-4 mt-2">
            <CCol xs={12}>
              <div className="d-flex flex-wrap">
                {property.photos?.length ? (
                  property.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="m-2"
                      style={{
                        position: 'relative',
                        width: '200px', // Consistent width for images
                        height: '200px', // Consistent height for images
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src={
                          photo?.url
                            ? `http://localhost:4000/api/v1/${photo.url}`
                            : '/placeholder-image.png'
                        }
                        alt={`Property Photo ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={() => console.error(`Error loading photo at index ${index}`)}
                      />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '10px',
                        }}
                      >
                        <CButton
                          color="light"
                          size="sm"
                          onClick={() =>
                            handleExpandImage(
                              photo?.url ? `http://localhost:4000/api/v1/${photo.url}` : null,
                            )
                          }
                        >
                          <CIcon icon={cilFullscreen} />
                        </CButton>

                        <CButton color="light" size="sm" onClick={() => handlePhotoUpdate(photo)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handlePhotoDelete(photo)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No photos available.</p>
                )}
              </div>
            </CCol>
            <CCol className="mt-6" xs={12}>
              <CButton color="dark" onClick={handleAddImageClick}>
                Add Photo
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <PropertyPhotoModal
        visible={isFullscreenModalVisible}
        photo={expandedImage}
        onClose={handleCloseFullscreen}
      />
      <AddImage
        visible={addImageModalVisible}
        onClose={handleCloseAddImageModal}
        propertyId={property.id}
        propertyTitle={property.title}
        confirmUpdatePhoto={handlePhotoEdit}
        photoId={selectedPhotoToEdit?.id}
        isEdit={!!selectedPhotoToEdit} // Pass if it's edit mode
      />
    </>
  )
}

export default PropertyDetails
