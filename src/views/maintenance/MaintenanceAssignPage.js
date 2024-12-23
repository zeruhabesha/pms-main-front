import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MaintenanceAssign from './MaintenanceAssign';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenances, updateMaintenance } from '../../api/actions/MaintenanceActions';

const MaintenanceAssignPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
     const dispatch = useDispatch();
     const [maintenance , setMaintenance] = useState(null);

      const {
         maintenances = [],
    } = useSelector((state) => state.maintenance);

        useEffect(() => {
          dispatch(fetchMaintenances({}))
    }, [dispatch])

        useEffect(() => {
          const foundMaintenance = maintenances?.find((m) => m._id === id);
            setMaintenance(foundMaintenance)
    }, [id, maintenances]);


    const handleAssign = async (maintenanceId, selectedUsers) => {
      try {
          await dispatch(updateMaintenance({
            id:maintenanceId,
            maintenanceData:{
            assignedUsers: selectedUsers
            }
          }));
            navigate('/maintenance');
      } catch (error) {
           console.error("Assign Error", error)
      }

    };

    return (
        <div>
            {maintenance && <MaintenanceAssign maintenance={maintenance} onAssign={handleAssign}/>}
        </div>
    );
};

export default MaintenanceAssignPage;