import axios from 'axios';
import { serverBaseUrl } from '@/lib/data';

export async function login(){
    return axios({
        url: serverBaseUrl + '/auth/login',
        method: 'get'
    })
}

export async function getUserData(token: string){
    return axios({
        url: serverBaseUrl + '/user/info',
        method: 'get',
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
            
        }
    })
}

export async function getStoryData(id: string, token: string){
    return axios({
        url: serverBaseUrl + '',
        method: 'get',
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}