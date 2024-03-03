import axios from 'axios';
import { serverBaseUrl } from '@/lib/data';
import { BlockType } from '@/components/ui/editorBlocks';

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

export type StoryResponse = {
    data: {
        content: string,
        storyID: string,
    }
}
export async function getStoryData(id: string | null, token: string): Promise<StoryResponse>{
    console.log('Get Story Data');
    if(id){
        return axios({
            url: serverBaseUrl + `/story/?storyID=${id}`,
            method: 'get',
            withCredentials: false,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }else{
        return axios(
            {
                url: serverBaseUrl + '/story/new',
                method: 'get',
                withCredentials: false,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

}

export async function updateStoryData(token: string, id: string, data: Array<BlockType>){
    console.log('Update Story Data');
    return axios({
        url: serverBaseUrl + "/story/update",
        method: "post",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            storyID: id,
            content: JSON.stringify(data),
        }
    })
}