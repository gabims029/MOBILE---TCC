import axios from "axios";
import * as SecureStore from "expo-secure-store";
const api = axios.create({
  baseURL: "https://tcc.southafricanorth.cloudapp.azure.com:3000/api",
  headers: { accept: "application/json" },
});
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const sheets = {
  // Usuário
  postLogin: (user) => api.post("/user/login", user),
  postCadastro: (user) => api.post("/user", user),
  getUser: (id) => api.get(`/user/${id}`),
  updateUser: (user) => api.put("/user", user),
  deleteUser: (id) => api.delete(`/user/${id}`),
  getUsuarios: () => api.get("/user"),

  // Salas
  getSalas: () => api.get("/sala"),
  postSalas: (sala) => api.post("/sala", sala),
  getSalasPorBloco: (bloco) => api.get(`/sala/${bloco}`),
  getHorarios: ({ id_sala, data }) =>
    api.get(`/reserva/horarios/${id_sala}/${data}`),
  deleteSala: (numero) => api.delete(`/sala/${numero}`),

  // Reservas
  createReserva: (data) => api.post("/reserva", data),
  confirmarReserva: (reserva) => api.post("/schedule", reserva),
  getSchedulesByUserID: (id) => api.get(`/reserva/usuario/${id}`),
  getReservasByData: (data) => api.get(`/reservas/data/${data}`),
  deleteReserva: (id) => api.delete(`/reserva/${id}`),
  getAllPeriodos: () => api.get("/periodo"),
  getPeriodoStatus: (idSala, data) =>
    api.get("/periodo/status", { params: { idSala, data } }),
};

export default sheets;
