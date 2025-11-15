import axios from 'axios'

export default axios.create({
    baseURL : 'http://localhost:5000/api/v1'
    // baseURL: 'https://lost-and-found-react.onrender.com/api/v1'
})