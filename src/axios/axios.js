import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://10.89.240.88:3000/api",
  headers: {
    accept: "application/json",
  },
});
// Intercepta todas as requisições e adiciona o token, se existir
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
  postCadastro:(user) => api.post("/user",user),
  getUser: (id) => api.get(`/user/${id}`),
  updateUser: (user) => api.put("/user", user),
  deleteUser: (id) => api.delete(`/user/${id}`),
  getUsuarios: () => api.get("/user"), 

  // Salas
  getSalas:(sala) => api.get("/sala", sala),
  postSalas:(sala) => api.post("/sala/", sala),
  getSalasPorBloco: (bloco) => api.get(`/sala/${bloco}`),
  getSalasPorData: (data) => api.get(`/sala/${data}`),
  getHorarios: ({ id_sala, data }) => api.get(`/reserva/horarios/${id_sala}/${data}`),

  // Reservas
  getHorarios: ({ id_sala, data }) =>api.get(`/reserva/horarios/${id_sala}/${data}`),
  getSalas:(sala) => api.get("/sala", sala),
  postSalas:(sala) => api.post("/sala/", sala),
  getSalasPorBloco: (bloco) => api.get(`/sala/${bloco}`),
  getSalasPorData: (data) => api.get(`/sala/${data}`),   
  createReserva: (data) => {
    console.log("Dados enviados para createReserva:", data);
    return api.post("/reserva", data);
  },
  // Reservas
  confirmarReserva: (reserva) => api.post("/schedule", reserva),
  getTodasReservas: () => api.get("/schedule"),
  getSchedulesByUserID: (id) => api.get(`/reserva/usuario/${id}`),
  deleteReserva: (id) => api.delete(`/reserva/${id}`),
  getAllPeriodos: () => api.get("/periodo"),
};

export default sheets;