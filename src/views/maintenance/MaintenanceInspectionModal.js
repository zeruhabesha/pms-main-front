import React, { useState, useEffect } from 'react';
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


const MaintenanceInspectionModal = ({
  visible,
  setInspectionModalVisible,
  maintenanceToInspect,
  confirmInspection,
}) => {
  const initialExpenseState = {
    laborCost: 0,
    equipmentCost: [{
      quantity: 0,
      pricePerUnit: 0,
      total: 0,
      description: ''
    }]
  };

  const [expense, setExpense] = useState(initialExpenseState);
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!maintenanceToInspect) return;
  
    setExpense(maintenanceToInspect.expense || initialExpenseState);
    setEstimatedCompletionTime(
      maintenanceToInspect.estimatedCompletionTime
        ? new Date(maintenanceToInspect.estimatedCompletionTime).toISOString().split('T')[0]
        : ''
    );
  }, [maintenanceToInspect]);
  

  const handleEquipmentCostChange = (index, field, value) => {
  setExpense(prevExpense => {
    // Create a new copy of the equipmentCost array
    const updatedEquipmentCost = prevExpense.equipmentCost.map((item, i) =>
      i === index ? { ...item, [field]: field === 'description' ? value : Number(value) || 0 } : item
    );

    // Ensure total is recalculated when quantity or pricePerUnit changes
    if (field === 'quantity' || field === 'pricePerUnit') {
      updatedEquipmentCost[index].total = 
        (Number(updatedEquipmentCost[index].quantity) || 0) * 
        (Number(updatedEquipmentCost[index].pricePerUnit) || 0);
    }

    return { ...prevExpense, equipmentCost: updatedEquipmentCost };
  });
};




  const handleExpenseChange = (field, value) => {
    const numValue = field === 'laborCost' ? Number(value) || 0 : value;
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
      // Ensure expense object is correctly structured
      const formattedExpense = {
        laborCost: Number(expense.laborCost),
        equipmentCost: expense.equipmentCost.map(item => ({
          quantity: Number(item.quantity),
          pricePerUnit: Number(item.pricePerUnit),
          total: Number(item.quantity * item.pricePerUnit), 
          description: item.description || ''
        }))
      };
  
      // Ensure `totalExpenses` is correctly calculated
      const totalExpenses = Number(formattedExpense.laborCost) +
        formattedExpense.equipmentCost.reduce((sum, item) => sum + Number(item.total), 0);
  
      // Create the final payload
      const payload = {
        status: 'Inspected',
        expense: formattedExpense, // Ensure this is an object, not a string
        totalExpenses: totalExpenses // Ensure it's a number
      };
  
      console.log('Formatted Payload:', JSON.stringify(payload, null, 2)); // Debugging output
  
      await confirmInspection(payload);
      setInspectionModalVisible(false);
    } catch (err) {
      console.error("Error submitting inspection data:", err);
      setError('Failed to submit inspection data. Please try again.');
    }
  };
  
  
  
  

  const handleClose = () => {
    setInspectionModalVisible(false);
    setError(null);
  };

  return (
    <CModal visible={visible} onClose={() => setInspectionModalVisible(false)}>
      <CModalHeader onClose={() => setInspectionModalVisible(false)}>
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
              onChange={(e) => setEstimatedCompletionTime(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Labor Cost</CFormLabel>
            <CFormInput
              type="number"
              min="0"
              value={expense.laborCost}
              onChange={(e) => setExpense(prev => ({ ...prev, laborCost: Number(e.target.value) || 0 }))}
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
        <CButton color="secondary" onClick={() => setInspectionModalVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MaintenanceInspectionModal;