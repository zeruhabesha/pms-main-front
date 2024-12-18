import React, { useState, useEffect } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CSpinner,
  CAlert,
  CButton,
} from "@coreui/react";
import AgreementTable from "./AgreementTable";
import AddAgreement from "./AddAgreement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Super.scss";
import { CSVLink } from "react-csv";
import { cilFile, cilClipboard, cilCloudDownload } from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgreements,
  addAgreement,
  updateAgreement,
  deleteAgreement,
} from "../../api/actions/AgreementActions";
import {
  setSelectedAgreement,
  clearSelectedAgreement,
} from "../../api/slice/AgreementSlice";

const ViewAgreement = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const {
    agreements,
    loading,
    error,
    currentPage,
    totalPages,
    selectedAgreement,
  } = useSelector((state) => state.agreement);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAgreements({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
    dispatch(fetchAgreements({ page: 1, limit: itemsPerPage, searchTerm: e.target.value }));
  };

  const handleEdit = (agreement) => {
    dispatch(setSelectedAgreement(agreement));
    setModalVisible(true);
  };


  const handleDelete = async (id) => {
      try {
          await dispatch(deleteAgreement(id)).unwrap();
          toast.success("Agreement deleted successfully.");
      } catch (err) {
           toast.error(err.message || "Failed to delete the agreement.");
       }
  };



  const handleSave = async (formData) => {
    if (!formData.tenant || !formData.property) {
        toast.error("Tenant and Property are required fields.");
      return;
    }
    try {
          if (selectedAgreement) {
              await dispatch(
                  updateAgreement({ id: selectedAgreement._id, agreementData: formData })
              ).unwrap();
              toast.success("Agreement updated successfully.");
          } else {
             await dispatch(addAgreement(formData)).unwrap();
            toast.success("Agreement added successfully.");
          }

       } catch (err) {
      toast.error(err.message || "Failed to save the agreement.");
        }
  };


  const closeModal = () => {
    dispatch(clearSelectedAgreement());
    setModalVisible(false);
  };

  const csvData = agreements.map((agreement, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    tenant: agreement.tenant?.name || "N/A",
    property: agreement.property?.name || "N/A",
    leaseStart: agreement.leaseStart || "N/A",
    leaseEnd: agreement.leaseEnd || "N/A",
    rentAmount: agreement.rentAmount || "N/A",
  }));

  const clipboardData = agreements
    .map(
      (agreement, index) =>
        `${(currentPage - 1) * itemsPerPage + index + 1}. ${
          agreement.tenant?.name || "N/A"
        } - ${agreement.property?.name || "N/A"} - ${agreement.leaseStart || "N/A"} - ${
          agreement.leaseEnd || "N/A"
        }`
    )
    .join("\n");

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Agreements List", 14, 10);

    const tableData = agreements.map((agreement, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      agreement.tenant?.name || "N/A",
      agreement.property?.name || "N/A",
      agreement.leaseStart || "N/A",
      agreement.leaseEnd || "N/A",
      `$${agreement.rentAmount || "N/A"}`,
    ]);

    doc.autoTable({
      head: [["#", "Tenant", "Property", "Lease Start", "Lease End", "Rent Amount"]],
      body: tableData,
      startY: 20,
    });

    doc.save("agreements.pdf");
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
                dispatch(clearSelectedAgreement());
                setModalVisible(true);
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
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
              <CFormInput
                type="text"
                placeholder="Search by tenant or property"
                onChange={handleSearch}
                className="w-100"
              />
              <div className="d-flex gap-2">
                <CSVLink
                  data={csvData}
                  headers={[
                    { label: "#", key: "index" },
                    { label: "Tenant", key: "tenant" },
                    { label: "Property", key: "property" },
                    { label: "Lease Start", key: "leaseStart" },
                    { label: "Lease End", key: "leaseEnd" },
                    { label: "Rent Amount", key: "rentAmount" },
                  ]}
                  filename="agreement_data.csv"
                  className="btn btn-dark"
                >
                  <CIcon icon={cilFile} title="Export CSV" />
                </CSVLink>
                <CopyToClipboard text={clipboardData}>
                  <CButton color="dark" title="Copy to Clipboard">
                    <CIcon icon={cilClipboard} />
                  </CButton>
                </CopyToClipboard>
                <CButton color="dark" onClick={exportToPDF} title="Export PDF">
                  <CIcon icon={cilCloudDownload} />
                </CButton>
              </div>
            </div>
            {loading ? (
              <CSpinner color="dark" />
            ) : (
              <AgreementTable
                agreements={agreements}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={(page) =>
                  dispatch(fetchAgreements({ page, limit: itemsPerPage }))
                }
                itemsPerPage={itemsPerPage}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <AddAgreement
        visible={isModalVisible}
        setVisible={closeModal}
        editingAgreement={selectedAgreement}
        handleSave={handleSave}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </CRow>
  );
};

export default ViewAgreement;