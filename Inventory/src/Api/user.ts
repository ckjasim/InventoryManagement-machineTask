import Api from "../service/axios";
export const userLoing= async (formData:any)=>{
    try {
        const response = await Api.post('/api/users/signin',formData)
        return response.data
    } catch (error:any) {
        throw error
    }
}
export const userSignUp = async (formData:any)=>{
    try {
        const response = await Api.post('/api/users/signup',formData)
        return response.data
    } catch (error) {
        throw error
    }
}
export const logout = async ()=>{
    try {
        const response = await Api.post('/api/users/signout')
        return response.data
    } catch (error) {
        throw error
    }
}
export const currentUser =async ()=>{
    try {
        const response = await Api.get('/api/users/currentuser')
        return response.data
    } catch (error) {
        throw error
    }
} 