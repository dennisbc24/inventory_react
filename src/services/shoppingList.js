import axios from 'axios'

const getList = async (urlBase) => {
  const { data } = await axios.get(`${urlBase}/api/v1/shoppingList`)
  return data
}

const addManual = async (urlBase, id_product) => {
  const { data } = await axios.post(`${urlBase}/api/v1/shoppingList`, { id_product })
  return data
}

const checkProduct = async (urlBase, id_product) => {
  const { data } = await axios.get(`${urlBase}/api/v1/shoppingList/byProduct?product=${id_product}`)
  return data
}

const markPurchased = async (urlBase, id_shopping) => {
  const { data } = await axios.patch(`${urlBase}/api/v1/shoppingList/${id_shopping}/purchased`)
  return data
}

const reorder = async (urlBase, orderedIds) => {
  const { data } = await axios.put(`${urlBase}/api/v1/shoppingList/order`, { orderedIds })
  return data
}

const remove = async (urlBase, id_shopping) => {
  const { data } = await axios.delete(`${urlBase}/api/v1/shoppingList/${id_shopping}`)
  return data
}

export default { getList, addManual, checkProduct, markPurchased, remove, reorder }