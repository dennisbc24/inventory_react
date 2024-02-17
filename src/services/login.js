import axios from 'axios'

const url = 'http://localhost:3000/api/v1/auth/login'

const login = async credentials => {
    const {data} = await axios.post(url, credentials)
    return data
}

export default {login}