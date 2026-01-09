import type { Video } from "./video.ts";
import { api } from "./axios.ts";

export interface ChannelData {
    id:number;
    email:string;
    nickname:string;
    profileImage?:string|null;
    videoCount:number;
    subscriberCount:number;
    isSubscribed:boolean;
    videos:Video[];
}
export const fetchChannel =async (channelId:number) => {
    const response =await api.get<ChannelData>(`channels/${channelId}`);
    return response.data;
}