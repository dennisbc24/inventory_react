import axios from 'axios'

export class ProductService {
    constructor(){}
    async create(urlBase,payload){
        const urlUpload = `${urlBase}/api/v1/products`
        const {proveedor,nameProduct,costProduct,PUnit,pMayor} = payload
        try {
            await axios.post(urlUpload,{
              //fk_user: idUser,
              //fk_branch:idBranch,
              fk_supplier:proveedor.id_supplier,
              //amount: count,
              name:nameProduct,
              cost: costProduct,
              lowest_price: parseFloat(PUnit),
              list_price: parseFloat(pMayor),
            })
    
            return 'product created successfully'
            
          } catch (error) {
            
            console.error("Error creating product:", error);
            return error
          }
    }
    async updateCostAndSupplier(urlBase, product, { cost, fk_supplier, supplier }) {
        const fd = new FormData();
        fd.append('name', product.name);
        fd.append('cost', cost);
        fd.append('sugested_price', product.list_price ?? '');
        fd.append('wholesale_price', product.lowest_price ?? '');
        fd.append('fk_category', product.fk_category ?? '');
        fd.append('is_online', product.is_online ? 'true' : 'false');
        fd.append('attributes', JSON.stringify(product.attributes || {}));
        fd.append('fk_supplier', fk_supplier === null || fk_supplier === undefined ? '' : fk_supplier);
        fd.append('supplier', supplier || '');
        await axios.patch(`${urlBase}/api/v1/products/${product.id_product}`, fd);
        return 'product updated successfully';
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

