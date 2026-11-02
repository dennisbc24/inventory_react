import axios from 'axios'

const getOrders = async (urlBase) => {
  const { data } = await axios.get(`${urlBase}/api/v1/shoppingOrders`)
  return data
}

const getOrder = async (urlBase, id_order) => {
  const { data } = await axios.get(`${urlBase}/api/v1/shoppingOrders/${id_order}`)
  return data
}

const createOrder = async (urlBase, payload) => {
  const { data } = await axios.post(`${urlBase}/api/v1/shoppingOrders`, payload)
  return data
}

const updateOrder = async (urlBase, id_order, payload) => {
  const { data } = await axios.put(`${urlBase}/api/v1/shoppingOrders/${id_order}`, payload)
  return data
}

const confirmOrder = async (urlBase, id_order) => {
  const { data } = await axios.patch(`${urlBase}/api/v1/shoppingOrders/${id_order}/confirm`)
  return data
}

const deleteOrder = async (urlBase, id_order) => {
  const { data } = await axios.delete(`${urlBase}/api/v1/shoppingOrders/${id_order}`)
  return data
}

export default { getOrders, getOrder, createOrder, updateOrder, confirmOrder, deleteOrder }
