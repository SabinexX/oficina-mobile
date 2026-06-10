import axios from 'axios';

const MEU_IP = '192.168.0.175';

export const apiOficina = axios.create({
  baseURL: `http://${MEU_IP}:8080`,
});

export const apiIA = axios.create({
  baseURL: `http://${MEU_IP}:8000`,
});


