import Api from "../service/axios"

export const createItem = async(itemData:any)=>{
    try {
        const response = await Api.post('/api/item/create',itemData)
        return response.data
    } catch (error) {
        throw error
    }
}
export const getEachItem = async(itemId:string)=>{
    try {
        const response = await Api.get(`/api/item/${itemId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const getAllItem = async()=>{
    try {
        const response = await Api.get('/api/item/getAll');
        return response.data
    } catch (error) {
        throw error
    }
}
export const editItem = async(itemData:any,itemId:string)=>{
    try {
        const response = await Api.put(`/api/item/${itemId}`,itemData)
        return response.data
    } catch (error) {
        throw error
    }
}