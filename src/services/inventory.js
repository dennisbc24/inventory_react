import axios from 'axios'
 
 export class InventoryService{
    constructor(){}
    async CompareInventories(){
        const response1 = await axios.get('http://localhost:3000/api/v1/existence/inventary?branch=1')
        const response2 = await axios.get('http://localhost:3000/api/v1/existence/inventary?branch=3')
        const branch1 = response1.data
        const branch2 = response2.data
        function compare(json1, json2) {
        const productosNoCoincidentes = [];
        const SiCoincidentes = [];
    
        for (let producto2 of json2) {
            let coincide = false;
    
            for (let producto1 of json1) {
                if (producto2.product === producto1.product) {
                    if (producto1.amount <= 0) {
                        SiCoincidentes.push({nombre: producto2.product,cantidad: producto2.amount})
                    }
                    
                    coincide = true;
                    break;
                }
            }
    
            if (!coincide) {
                productosNoCoincidentes.push({nombre: producto2.product, cantidad: producto2.amount});
            }
        }
    
        return {productosNoCoincidentes, SiCoincidentes};
    }
    const {productosNoCoincidentes, SiCoincidentes} = compare(branch1, branch2)
    console.log(productosNoCoincidentes, SiCoincidentes);
    }
        
 }



