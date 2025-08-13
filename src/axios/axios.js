import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL:"http://10.89.240.77:3000/api",
    headers:{
        "accept":"application/json"
    }
});

api.interceptors.request.use(
    async (config) =>{
        const token = await SecureStore.getItemAsync("token");
        if (token){
        config.headers.Authorization = token;
        }
        return config;
    },(error) => Promise.reject(error)
);

const sheets = {
    postLogin:(user) => api.post("/user/login/",user),
    postCadastro:(user) => api.post("User/",user),
    getSalas:(sala) => api.get("/sala", sala),
    getHorarios: ({ id_sala, data }) => api.get(`/reserva/horarios/${id_sala}/${data}`),
    confirmarReserva:(reserva) => api.post("reserva", reserva),
    getUser: (id) => api.get(`/user/${id}`),
    updateUser:(user) => api.put(`/user`, user),
    deleteReserva: (id) => api.delete(`/reserva/${id}`),
    getReservasPorUsuario: (id) => api.get(`/reserva/usuario/${id}`),
    deleteUser: (id) => api.delete(`/user/${id}`),

}
export default sheets;