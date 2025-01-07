import axios from 'axios'

export class BoxService {
    constructor(){}
    async register(urlBase, body){
        const urlToAPI = `${urlBase}/api/v1/box/newDebt`;
        
        const {debt, expiration_date, description, currency, fk_user} = body
        try {
            const sendData = await axios.post(urlToAPI,{
                debt, expiration_date, description, currency, fk_user
            })
            
          } catch (error) {
            console.error( error);
          }
    }

    

}

