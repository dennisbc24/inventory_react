import axios from 'axios'

export class ProductService {
    constructor(){}
    async create(urlBase,payload){
        const urlUpload = `${urlBase}/api/v1/products`
        const {proveedor,nameProduct,costProduct,PUnit,pMayor} = payload
        try {
            const sendData = await axios.post(urlUpload,{
              //fk_user: idUser,
              //fk_branch:idBranch,
              fk_supplier:proveedor.id_supplier,
              //amount: count,
              name:nameProduct,
              cost: costProduct,
              lowest_price: parseInt(PUnit),
              list_price: parseInt(pMayor),
            })
    
            return 'product created successfully'
            
          } catch (error) {
            
            console.error("Error creating product:", error);
            return error
          }
    }
    /* async delete(urlBase, body) {
        
        const {} = body
        const urlQuery = ''
        try {
            const sendData = await axios.delete(urlQuery)
        } catch (error) {
            console.log(error);
        }
    } 
     */

}

