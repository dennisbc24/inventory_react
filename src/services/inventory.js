import axios from "axios";

export class InventoryService {
  constructor() {}

  async CompareInventories({store, deposit, urlBase, baseCount }) {
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
               
                if (product1.amount <= baseCount && product2.amount >=1) {
                    siCoincidentes.push({
                        nombre: product2.product,
                        [product2.sucursal]: product2.amount,
                        origen: product1.amount
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
                    [producto2.sucursal]: producto2.amount,
                    origen: 0
                                });
            }
          
        }
      }

      return { productosNoCoincidentes };
    }

    const { siCoincidentes } = compare1(branch1, branch2);
    const { productosNoCoincidentes } = compare2(branch1, branch2);


    const joinArrays = siCoincidentes.concat(productosNoCoincidentes)
    const sortArray = joinArrays.sort((a,b)=>{
      return a.nombre.localeCompare(b.nombre, 'en')
    })


    return { sortArray };
  }

  async registerTransaction(urlBase, {branchA,branchB,count,idUser,dateTrans,id_product}){
    const urlTransactions = `${urlBase}/api/v1/transactions`;


    const sendData = await axios.post(urlTransactions,{
      pointA: branchA,
      pointB: branchB,
      amount: count,
      fk_user:idUser,
      date: dateTrans,
      fk_product: id_product
  })
  }
  async registerEntries(urlBase, {idBranch,count,idUser,idProduct}) {
    const urlEntries = `${urlBase}/api/v1/entries`;

    const sendEntry = await axios.post(urlEntries, {
      pointB: idBranch,
             amount: count,
             fk_user:idUser,
             fk_product: idProduct
    });
  }
}
