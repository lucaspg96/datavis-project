import axios from 'axios';
import { apiURL } from '.';

let API_URL = apiURL;

const service = axios.create({ baseURL: API_URL });
export default {

    find() {
        return service.get("/historical-tweets").then(res => res.data)
    },

    getStaticData() {
        return axios.get(window.location.href + "data.json").then(res => res.data)
    }

}
