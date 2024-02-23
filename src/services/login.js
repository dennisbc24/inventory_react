import axios from 'axios'


const login = async (urlBase, credentials) => {
    const url = `${urlBase}/api/v1/auth/login`
    const {data} = await axios.post(url, credentials)
    return data
}

export default {login}