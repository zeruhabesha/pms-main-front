import httpCommon from "../http-common"; // Adjust path as needed

const API_URL = "/guests"; // Adjust if your API endpoint is different

const createGuest = async (guestData) => {
  const response = await httpCommon.post(API_URL, guestData);
  return response.data;
};

const fetchAllGuests = async () => {
  const response = await httpCommon.get(API_URL);
  return response.data;
};
const fetchGuestById = async (id) => {
  const response = await httpCommon.get(`${API_URL}/${id}`);
  return response.data;
};

const updateGuest = async (id, guestData) => {
  const response = await httpCommon.put(`${API_URL}/${id}`, guestData);
  return response.data;
};
const deleteGuest = async (id) => {
  const response = await httpCommon.delete(`${API_URL}/${id}`);
  return response.data;
};
const getGuestsByRegisteredBy = async (registeredBy) => {
  const response = await httpCommon.get(
    `${API_URL}/registeredBy/${registeredBy}`
  );
  return response.data;
};
const guestService = {
  createGuest,
  fetchAllGuests,
  fetchGuestById,
  updateGuest,
  deleteGuest,
  getGuestsByRegisteredBy,
};

export default guestService;