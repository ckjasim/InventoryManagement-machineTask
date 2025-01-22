import Api from "../service/axios"

export const createCustomer = async(customerData:any)=>{
try {
    const response = await Api.post('/api/customer/create',customerData)
    return response.data
} catch (error) {
    throw error
}
}
export const getAllCustomer = async()=>{
    try {
        const response = await Api.get('/api/customer/getAll')
     
        return response.data
    } catch (error) {
        throw error
    }
}
export const editCustomer = async(custoemrData:any,customerId:string)=>{
    try {
        console.log(custoemrData,':before the fetch')
        const response = await Api.patch(`/api/customer/${customerId}`,custoemrData)
        console.log(response.data,':after fetch')
        return response.data
    } catch (error) {
        throw error
    }
}