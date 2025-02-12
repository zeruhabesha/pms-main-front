import React, { useState, useEffect, useCallback } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilPencil,
  cilTrash,
  cilFullscreen,
  cilArrowLeft,
  cilHome,
  cilDescription,
  cilLocationPin,
  cilBuilding,
  cilMoney,
  cilList,
  cilImage,
} from "@coreui/icons";
import AddImage from "./AddImage";
import { useParams, useNavigate } from "react-router-dom";
import {
  addPropertyImage,
  deletePhoto,
  getProperty,
  updatePhoto,
} from "../../api/actions/PropertyAction";
import { useDispatch } from "react-redux";
import PropertyPhotoModal from "./PropertyPhotoModal";
import PhotoDeleteModal from "./PhotoDeleteModal.js";
import { toast } from "react-toastify";
import { decryptData } from '../../api/utils/crypto'

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const [addImageModalVisible, setAddImageModalVisible] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [selectedPhotoToEdit, setSelectedPhotoToEdit] = useState(null);
  const [photoDeleteModalVisible, setPhotoDeleteModalVisible] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // These useState calls are OK, they are always called on every render.
  const [userPermissions, setUserPermissions] = useState(null);
  const [role, setRole] = useState(null);

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenModalVisible(false);
    setExpandedImage(null);
  }, []);

  const handleCloseAddImageModal = useCallback(() => {
    setAddImageModalVisible(false);
    setSelectedPhotoToEdit(null);
  }, []);

  useEffect(() => {
    if (!id) {
      setError("No property ID provided");
      setLoading(false);
      return;
    }
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getProperty(id)).unwrap();
        setProperty(response);
      } catch (err) {
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [dispatch, id]); // Ensure dependency array is correct

  useEffect(() => {
    try {
      const encryptedUser = localStorage.getItem('user')
      if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser)
        setUserPermissions(decryptedUser?.permissions || null)
        setRole(decryptedUser?.role || null)
      }
    } catch (err) {
      setError('Failed to load user permissions')
      console.error('Permission loading error:', err)
    }
  }, [])

  if (!id) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error: No property ID provided
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleExpandImage = (photoUrl) => {
    if (photoUrl) {
      setExpandedImage(photoUrl);
      setFullscreenModalVisible(true);
    } else {
      console.error("Invalid photo URL provided to handleExpandImage");
    }
  };

  const handleAddImageClick = () => {
    setAddImageModalVisible(true);
    setSelectedPhotoToEdit(null);
  };

  const handleDeletePropertyClick = (property) => {
    setPropertyToDelete(property);
    setDeleteModalVisible(true);
  };

  const handlePhotoDeleteClick = (photo) => {
    setPhotoToDelete(photo);
    setPhotoDeleteModalVisible(true);
  };
  const handlePhotoDelete = async (photoToDelete) => {
    try {
      setLoading(true);
      await dispatch(
        deletePhoto({ propertyId: id, photoId: photoToDelete.id })
      ).unwrap();
      const response = await dispatch(getProperty(id)).unwrap();
      setProperty(response);
      setError(null);
      toast.success("Photo deleted successfully!");
    } catch (err) {
      setError(err?.message || "Failed to delete the photo.");
      toast.error(err?.message || "Failed to delete the photo.");
    } finally {
      setLoading(false);
      setPhotoDeleteModalVisible(false);
    }
  };

  const handlePhotoUpdate = (photo) => {
    setSelectedPhotoToEdit(photo);
    setAddImageModalVisible(true);
  };

  const handleUpdatePhotoSuccess = async () => {
    setAddImageModalVisible(false);
    setSelectedPhotoToEdit(null);
    try {
      setLoading(true);
      const response = await dispatch(getProperty(id)).unwrap();
      setProperty(response);
      setError(null);
    } catch (err) {
      setError(err?.message || "Failed to reload property data.");
      toast.error(err?.message || "Failed to reload property data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoAdd = async (photo) => {
    try {
      setLoading(true);
      await dispatch(addPropertyImage({ id, photo })).unwrap();
      const response = await dispatch(getProperty(id)).unwrap();
      setProperty(response);
      setError(null);
      setAddImageModalVisible(false);
      toast.success("Photo added successfully!");
    } catch (err) {
      setError(err?.message || "Failed to add photo.");
      toast.error(err?.message || "Failed to add photo.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoEdit = async (newPhotoFile) => {
    try {
      setLoading(true);
      await dispatch(
        updatePhoto({
          id: id,
          photo: newPhotoFile,
          photoId: selectedPhotoToEdit._id,
        })
      ).unwrap();

      handleUpdatePhotoSuccess();
    } catch (error) {
      setError(error?.message || "Failed to update the photo.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>
    );
  }

  if (!property) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
        No property found
      </div>
    );
  }

  const parseAmenities = (amenities) => {
    if (!amenities || !Array.isArray(amenities) || amenities.length === 0)
      return "N/A";

    return amenities
      .filter((amenity) => amenity.trim().length > 0) // Remove empty strings
      .map((amenity) => {
        try {
          const parsed = JSON.parse(amenity);
          return Array.isArray(parsed) ? parsed.join(", ") : parsed;
        } catch {
          return amenity;
        }
      })
      .join(", ");
  };

  const PhotoItem = ({ photo, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        key={photo._id || index}
        className="m-2"
        style={{
          position: "relative",
          width: "200px",
          height: "200px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={
            photo?.url
              ? `https://pms-backend-sncw.onrender.com/api/v1/${photo.url}`
              : "/placeholder-image.png"
          }
          alt={`Property Photo ${index + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isHovered ? 0.6 : 1,
            transition: "opacity 0.3s ease",
          }}
          onError={() =>
            console.error(`Error loading photo at index ${index}`)
          }
        />
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <CButton
                color="light"
                size="sm"
                onClick={() =>
                  handleExpandImage(
                    photo?.url
                      ? `https://pms-backend-sncw.onrender.com/api/v1/${photo.url}`
                      : null
                  )
                }
              >
                <CIcon icon={cilFullscreen} />
              </CButton>
              {userPermissions?.editPropertyPhotos && (
                <CButton
                  color="light"
                  size="sm"
                  onClick={() => handlePhotoUpdate(photo)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
              )}
              {userPermissions?.viewProperty && (
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => handlePhotoDeleteClick(photo)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* <CButton color="secondary" onClick={() => navigate('/property')} className="mb-3">
        <CIcon icon={cilArrowLeft} /> Back to Properties
      </CButton> */}
      <CCard className="border-0 shadow-sm">
        <CCardBody>
          <CTable bordered responsive>
            <CTableBody>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilHome} className="me-1" />
                  Title:
                </CTableDataCell>
                <CTableDataCell>{property.title || "N/A"}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilDescription} className="me-1" /> Description:
                </CTableDataCell>
                <CTableDataCell>
                  {property.description || "No description available"}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilLocationPin} className="me-1" /> Address:
                </CTableDataCell>
                <CTableDataCell>{property.address || "N/A"}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilHome} className="me-1" /> Property Type:
                </CTableDataCell>
                <CTableDataCell>
                  {property.propertyType || "N/A"}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilMoney} className="me-1" /> Price:
                </CTableDataCell>
                <CTableDataCell>
                  {property.price ? `$${property.price}` : "N/A"}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilMoney} className="me-1" /> Rent Price:
                </CTableDataCell>
                <CTableDataCell>
                  {typeof property.rentPrice === "number"
                    ? `$${property.rentPrice}`
                    : "N/A"}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilBuilding} className="me-1" /> Number of Units:
                </CTableDataCell>
                <CTableDataCell>
                  {property.numberOfUnits !== undefined
                    ? property.numberOfUnits
                    : "N/A"}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">Floor Plan:</CTableDataCell>
                <CTableDataCell>
                  {property.floorPlan ? property.floorPlan : "N/A"}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="fw-bold">
                  <CIcon icon={cilList} className="me-1" /> Amenities:
                </CTableDataCell>
                <CTableDataCell>
                  {parseAmenities(property.amenities)}{" "}
                  {/* Call the function here */}
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
                    <PhotoItem key={photo._id || index} photo={photo} index={index} />
                  ))
                ) : (
                  <p>No photos available.</p>
                )}
              </div>
            </CCol>
            {userPermissions?.editPropertyPhotos && (
            <CCol className="mt-6" xs={12}>
              <CButton color="dark" onClick={handleAddImageClick}>
                <CIcon icon={cilImage} className="me-1" /> Add Photo
              </CButton>
            </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>
      <PropertyPhotoModal
        visible={isFullscreenModalVisible}
        photo={expandedImage}
        onClose={handleCloseFullscreen}
      />
      <PhotoDeleteModal
        visible={photoDeleteModalVisible}
        onClose={() => setPhotoDeleteModalVisible(false)}
        photoToDelete={photoToDelete}
        confirmDelete={handlePhotoDelete}
      />
      <AddImage
        visible={addImageModalVisible}
        onClose={handleCloseAddImageModal}
        propertyId={property.id}
        propertyTitle={property.title}
        confirmAddPhoto={handlePhotoAdd}
        confirmUpdatePhoto={handlePhotoEdit}
        photoId={selectedPhotoToEdit?._id}
        isEdit={!!selectedPhotoToEdit}
      />
    </>
  );
};

export default PropertyDetails;