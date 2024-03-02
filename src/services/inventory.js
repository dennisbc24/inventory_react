import axios from "axios";

export class InventoryService {
  constructor() {}

  async CompareInventories({store, deposit, urlBase }) {
    const b17 = await axios.get(
      `${urlBase}/api/v1/existence/inventary?branch=${store}`
    );
    const depa = await axios.get(
      `${urlBase}/api/v1/existence/inventary?branch=${deposit}`
    );
    const branch1 = b17.data;
    const branch2 = depa.data;

    function compare1(json1, json2) {
        const siCoincidentes = [];
        for (let product2 of json2) {

           for (let product1 of json1) {
            if (product2.product === product1.product) {
               
                if (product1.amount <= 0 && product2.amount >=1) {
                    siCoincidentes.push({
                        nombre: product2.product,
                        cantidad: product2.amount,
                    })
                }
                
                break;
              }
           }
            
        }
        
        return {siCoincidentes}
    }

    function compare2(json1, json2) {
      const productosNoCoincidentes = [];

      for (let producto2 of json2) {
        let coincide = false;

        for (let producto1 of json1) {
          if (producto2.product === producto1.product) {
            coincide = true;
            break;
          }
        }

        if (!coincide) {
            if (producto2.amount >= 1) {
                productosNoCoincidentes.push({
                    nombre: producto2.product,
                    cantidad: producto2.amount,
                  });
            }
          
        }
      }

      return { productosNoCoincidentes };
    }

    const { siCoincidentes } = compare1(branch1, branch2);
    const { productosNoCoincidentes } = compare2(branch1, branch2);

    return { siCoincidentes, productosNoCoincidentes };
  }
}
