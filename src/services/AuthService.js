import { store } from '@/store'
import axios from 'axios';
const url = import.meta.env.VITE_APP_RUTA_API;

export default new class {
    //metodo para obtener token de un usuario enviando sus credenciales (correo,contraseña)
    async obtain_token(credentials) {
        const response = await axios
            .post(url + 'user/token/', credentials);
        store.commit("SET_TOKEN", response.data.access);
        store.commit("SET_REFRESH", response.data.refresh);
        await store.commit("SET_ID", response.data.user_id);
        this.getUser(response.data.user_id);
        return response.data;
    }
    //metodo para extender el tiempo de vida de un token
    async refresh_token (token) {
        const response = await axios
            .post(url + 'user/refresh-token/', token);
        store.commit("SET_TOKEN", response.data.access);
        store.commit("SET_REFRESH", response.data.refresh);
        return response.data;
    }
    //metodo para registrar un usuario enviando sus credenciales(correo,contraseña)
    async register (credentials) {
        console.log(credentials);
        console.log(url);
        const response = 
        await axios
            .post(url + 'user/register/', credentials).then((response) => {
                console.log(response);
              }, (error) => {
                console.log(error);
              });
        //return response.data;
        return response;
    }
    //metodo para obtener todos los datos de un usuario logueado
    async getUser(id) {
        console.log("Entre en GetUser");
        const response = await axios.get(url + 'user/api/'+id+"/");
        const user = response.data;
        await store.commit("SET_USER",user);
        console.log("sali en GetUser");
        return user;
    }
    async setUser(data){
        store.commit("SET_USER",data);
    }
    prueba(){
        console.log("hola");
        store.commit("SET_ID", 10);

        console.log("Nuevo id: "+store.getters.getId);
        console.log("Nuevo token: "+store.getters.isLoggedIn);
    }

};