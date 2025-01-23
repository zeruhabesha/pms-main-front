import httpCommon from "../http-common"; // Adjust path as needed

const API_URL = "/guests"; // Adjust if your API endpoint is different

const createGuest = async (guestData) => {
  const response = await httpCommon.post(API_URL, guestData);
  return response.data;
};

const fetchGuests = async ({ page, limit, search }) => {
  let url = `${API_URL}?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }
  const response = await httpCommon.get(url);
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

const getGuestsByRegisteredBy = async (registeredBy, { page = 1, limit = 10, search = "" }) => {
    let url = `${API_URL}/registeredBy/${registeredBy}?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }
  const response = await httpCommon.get(url);
  return response.data;
};

const guestService = {
  createGuest,
  fetchGuests,
  fetchGuestById,
  updateGuest,
  deleteGuest,
    getGuestsByRegisteredBy,
};

export default guestService;