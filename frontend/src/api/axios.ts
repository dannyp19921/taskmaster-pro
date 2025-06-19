// axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Our backend-base
  withCredentials: true, // If we use cookies later 
});

export default instance;
