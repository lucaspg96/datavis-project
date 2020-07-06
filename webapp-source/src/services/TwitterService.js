import axios from 'axios';

let API_URL = process.env.REACT_APP_API_URL;

const service = axios.create({baseURL: API_URL});
export default {

    find() {
        return service.get();
    }

}
