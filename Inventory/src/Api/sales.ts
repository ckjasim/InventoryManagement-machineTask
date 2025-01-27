import Api from "../service/axios"

export const placeorder = async (placeorderData: any, customerId: string,itemId:string) => {
    try {
        const response = await Api.post(`/api/sales/placeorder/${customerId}/${itemId}`, placeorderData)
        return response.data

    } catch (error) {
        throw error
    }
}
export const salesReport = async () => {
    try {
        const response = await Api.get('/api/sales/salesreport')
        return response.data

    } catch (error) {
        throw error
    }
}
export const editSaleReport = async(saleData:any,customerId:string,itemId:string,saleId:string)=>{
    try {
        const response = await Api.put(`/api/sales/${customerId}/${itemId}/${saleId}`,saleData)
        return response.data
    } catch (error) {
        throw error
    }
}
export const deleteSaleReport = async(saleId:string)=>{
    try {
        const response = await Api.delete(`/api/sales/${saleId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

// export const saleCount = async(customerId:string)=>{
//     try {
//         const 
//     } catch (error) {
//         throw error
//     }
// }