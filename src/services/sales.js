import axios from 'axios'

export class SalesService {
    constructor(){}
    async register(urlBase, body){
        const urlUploadVendings = `${urlBase}/api/v1/ventas/vendings`;
        const urlUMofifyExistence = `${urlBase}/api/v1/existence/vendings`;
        const {dateSell, count, total,PUnit, revenue, dataCustomer, product, idUser, idBranch} = body
        try {
            const sendData = await axios.post(urlUploadVendings,{
              date: dateSell,
              amount: count,
              p_total: total,
              p_unit: parseInt(PUnit),
              revenue: revenue,
              customer: dataCustomer,
              fk_id_product: product.id_product,
              fk_id_user: idUser,
              fk_id_branch:idBranch,
              branch:'nuevo',
              product:product.name
            })
    
            const modifyExistence = await axios.patch(urlUMofifyExistence,{
              amount: count, 
              fk_branch: idBranch, 
              fk_product:product.id_product, 
              fk_user:idUser
            })
            console.log('sale successfully recorded');
            
          } catch (error) {
            console.error("Error al obtener todos los productos:", error);
          }
    }

    async delete(urlBase, id) {
      const urlApi = `${urlBase}/api/v1/ventas`;
      try {
        const urlWithQuery =`${urlApi}?id=${id}`
          const deleteSale = await axios.delete(urlWithQuery)
  
          console.log(deleteSale.data);
          
        } catch (error) {
          console.error("Error al borrar:", error);
        }
      }
    async getSumMonthly(urlBase,id_product){
      const urlApi = `${urlBase}/api/v1/ventas/salesMonthly?fk_id_product=${id_product}`
      try {
        const response = await axios.get(urlApi)
        return response.data
      } catch (error) {
        console.error(error);
      }
    }
    async getByProduct(urlBase, id_product) {
      const urlApi = `${urlBase}/api/v1/ventas/saleByProduct?fk_id_product=${id_product}`
      try {
        const response = await axios.get(urlApi)
        return response.data
      } catch (error) {
        console.error(error);
      }
    }

}

