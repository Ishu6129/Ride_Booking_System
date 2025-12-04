import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const setDriverOnlineApi = async () => {
  // sample request - adapt to your backend
  const res = await axios.post(`${API_URL}/driver/online`, {
    driverId: "driver-sample-id",
  });
  return res.data;
};