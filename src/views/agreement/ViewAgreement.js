import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CSpinner,
  CAlert,
} from "@coreui/react";
import AgreementTable from "./AgreementTable";
import AddAgreement from "./AddAgreement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Super.scss";

const ViewAgreement = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAgreementModalVisible, setAgreementModalVisible] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  const itemsPerPage = 5;

 const fetchAgreements = async (page = 1) => {
  setLoading(true);
  setError("");
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const response = await axios.get("http://localhost:4000/api/v1/lease", {
      params: { page, limit: itemsPerPage, search: searchTerm },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { leases: fetchedAgreements, totalPages } = response.data?.data || {};
    setAgreements(fetchedAgreements || []);
    setTotalPages(totalPages || 0);
  } catch (error) {
    console.error("Error fetching agreements:", error);
    setError(error.response?.data?.message || "Failed to fetch agreements. Please try again later.");
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchAgreements(currentPage);
  }, [currentPage, searchTerm]);

  const handleEdit = (agreement) => {
    setSelectedAgreement(agreement);
    setAgreementModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/lease/${id}`);
      toast.success("Agreement deleted successfully.");
      fetchAgreements(currentPage);
    } catch (error) {
      console.error("Error deleting agreement:", error);
      toast.error("Failed to delete the agreement.");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedAgreement) {
        await axios.put(`http://localhost:4000/api/v1/lease/${selectedAgreement._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Agreement updated successfully.");
      } else {
        await axios.post("http://localhost:4000/api/v1/lease", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Agreement added successfully.");
      }
      setAgreementModalVisible(false);
      fetchAgreements(currentPage);
    } catch (error) {
      console.error("Error saving agreement:", error);
      toast.error("Failed to save the agreement.");
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Agreements</strong>
            <button
              className="learn-more"
              onClick={() => {
                setSelectedAgreement(null);
                setAgreementModalVisible(true);
              }}
            >
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Add Agreement</span>
            </button>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CFormInput
              type="text"
              placeholder="Search by tenant or property"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            {loading ? (
              <CSpinner color="dark" />
            ) : (
              <AgreementTable
                agreements={agreements}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <AddAgreement
        visible={isAgreementModalVisible}
        setVisible={setAgreementModalVisible}
        editingAgreement={selectedAgreement}
        handleSave={handleSave}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </CRow>
  );
};

export default ViewAgreement;
