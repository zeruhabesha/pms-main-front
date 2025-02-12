import React, { useState, useEffect, useCallback } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CAlert,
} from '@coreui/react';
import PropTypes from 'prop-types';

const MaintenanceInspectionModal = ({
  visible,
  setInspectionModalVisible,
  maintenanceToInspect,
  confirmInspection,
}) => {
  const [expense, setExpense] = useState({
    laborCost: 0,
    equipmentCost: [{
      quantity: 0,
      pricePerUnit: 0,
      total: 0,
      description: ''
    }]
  });
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (maintenanceToInspect) {
      setExpense(maintenanceToInspect.expense || {
        laborCost: 0,
        equipmentCost: [{
          quantity: 0,
          pricePerUnit: 0,
          total: 0,
          description: ''
        }]
      });
      setEstimatedCompletionTime(
        maintenanceToInspect.estimatedCompletionTime
          ? new Date(maintenanceToInspect.estimatedCompletionTime).toISOString().split('T')[0]
          : ''
      );
    } else {
      // Reset form if maintenanceToInspect is null
      resetForm();
    }
  }, [maintenanceToInspect]);

  const resetForm = useCallback(() => {
    setExpense({
      laborCost: 0,
      equipmentCost: [{
        quantity: 0,
        pricePerUnit: 0,
        total: 0,
        description: ''
      }]
    });
    setEstimatedCompletionTime('');
    setError(null);
  }, []);

  const handleEquipmentCostChange = (index, field, value) => {
    const updatedEquipmentCost = [...expense.equipmentCost];
    const newEquipmentCost = { ...updatedEquipmentCost[index] }; // Create a copy

    if (field === 'description') {
      newEquipmentCost[field] = value;
    } else {
      const numValue = Number(value) || 0;

      newEquipmentCost[field] = numValue;

      // Automatically calculate total when quantity or pricePerUnit changes
      if (field === 'quantity' || field === 'pricePerUnit') {
        const quantity = Number(newEquipmentCost.quantity) || 0;
        const pricePerUnit = Number(newEquipmentCost.pricePerUnit) || 0;
        newEquipmentCost.total = quantity * pricePerUnit;
      }
    }

    updatedEquipmentCost[index] = newEquipmentCost; // Set the copied object
    setExpense(prev => ({
      ...prev,
      equipmentCost: updatedEquipmentCost
    }));
  };


  const handleExpenseChange = (field, value) => {
    const numValue = Number(value) || 0;
    setExpense(prev => ({ ...prev, [field]: numValue }));
  };

  const handleAddEquipmentCost = () => {
    setExpense(prev => ({
      ...prev,
      equipmentCost: [
        ...prev.equipmentCost,
        { quantity: 0, pricePerUnit: 0, total: 0, description: '' }
      ]
    }));
  };

  const handleRemoveEquipmentCost = (index) => {
    const updatedEquipmentCost = [...expense.equipmentCost];
    updatedEquipmentCost.splice(index, 1);
    setExpense(prev => ({
      ...prev,
      equipmentCost: updatedEquipmentCost
    }));
  };

  const handleEstimatedCompletionTimeChange = (event) => {
    setEstimatedCompletionTime(event.target.value);
  };

  const validateForm = () => {
    if (!estimatedCompletionTime) {
      setError('Please set an estimated completion time');
      return false;
    }

    if (expense.laborCost < 0) {
      setError('Labor cost cannot be negative.');
      return false;
    }

    for (const item of expense.equipmentCost) {
      if (item.quantity < 0 || item.pricePerUnit < 0) {
        setError('Quantity and Price Per Unit cannot be negative.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;
  
    try {
      // Format the expense data
      const formattedExpense = {
        laborCost: Number(expense.laborCost),
        equipmentCost: expense.equipmentCost.map(item => ({
          quantity: Number(item.quantity),
          pricePerUnit: Number(item.pricePerUnit),
          total: Number(item.quantity * item.pricePerUnit), // Recalculate total to ensure accuracy
          description: item.description || ''
        }))
      };
  
      // Calculate total expenses
      const totalExpenses = Number(formattedExpense.laborCost) +
        formattedExpense.equipmentCost.reduce((sum, item) => sum + Number(item.total), 0);
  
      // Create the final payload
      const payload = {
        status: 'Inspected',
        estimatedCompletionTime: new Date(estimatedCompletionTime).toISOString(),
        expense: formattedExpense, // Send the formatted expense object
        totalExpenses: Number(totalExpenses) // Ensure it's a number
      };
  
      console.log('Submitting inspection payload:', payload); // For debugging
  
      await confirmInspection(payload);
      setInspectionModalVisible(false);
  
    } catch (err) {
      console.error("Error submitting inspection data:", err);
      setError('Failed to submit inspection data. Please try again.');
    }
  };

  const handleClose = () => {
    setInspectionModalVisible(false);
    resetForm(); // Reset the form when closing
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Update Expense and Set to Inspected</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm>
          <div className="mb-3">
            <CFormLabel>Estimated Completion Time</CFormLabel>
            <CFormInput
              type="date"
              value={estimatedCompletionTime}
              onChange={handleEstimatedCompletionTimeChange}
              required
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Labor Cost</CFormLabel>
            <CFormInput
              type="number"
              min="0"
              value={expense.laborCost}
              onChange={(e) => handleExpenseChange('laborCost', e.target.value)}
            />
          </div>

          {expense.equipmentCost.map((cost, index) => (
            <div key={index} className="mb-3 border p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Equipment Cost #{index + 1}</h6>
                {expense.equipmentCost.length > 1 && (
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleRemoveEquipmentCost(index)}
                  >
                    Remove
                  </CButton>
                )}
              </div>

              <div className="mb-2">
                <CFormLabel>Quantity</CFormLabel>
                <CFormInput
                  type="number"
                  min="0"
                  value={cost.quantity}
                  onChange={(e) => handleEquipmentCostChange(index, 'quantity', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <CFormLabel>Price Per Unit</CFormLabel>
                <CFormInput
                  type="number"
                  min="0"
                  value={cost.pricePerUnit}
                  onChange={(e) => handleEquipmentCostChange(index, 'pricePerUnit', e.target.value)}
                />
              </div>

              <div className="mb-2">
                <CFormLabel>Total</CFormLabel>
                <CFormInput
                  type="number"
                  value={cost.total}
                  readOnly
                />
              </div>

              <div className="mb-2">
                <CFormLabel>Description</CFormLabel>
                <CFormInput
                  type="text"
                  value={cost.description}
                  onChange={(e) => handleEquipmentCostChange(index, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}

          <CButton
            color="primary"
            size="sm"
            onClick={handleAddEquipmentCost}
            className="mb-3"
          >
            Add Equipment Cost
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

MaintenanceInspectionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setInspectionModalVisible: PropTypes.func.isRequired,
  maintenanceToInspect: PropTypes.shape({
    estimatedCompletionTime: PropTypes.string,
    expense: PropTypes.shape({
      laborCost: PropTypes.number,
      equipmentCost: PropTypes.arrayOf(
        PropTypes.shape({
          quantity: PropTypes.number,
          pricePerUnit: PropTypes.number,
          total: PropTypes.number,
          description: PropTypes.string,
        })
      ),
    }),
  }),
  confirmInspection: PropTypes.func.isRequired,
};

export default MaintenanceInspectionModal;