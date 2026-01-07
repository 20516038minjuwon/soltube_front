import { useEffect, useState } from "react";
import  {fetchSubscribedVideos, type Video} from "../../api/video.ts";
import Spinner from "../../Components/ui/Spinner.tsx";
import {twMerge} from "tailwind-merge";
import {MdSubscriptions} from "react-icons/md";
import VideoCard from "../../Components/video/VideoCard.tsx";


function Subscriptions(){
    const [videos, setVideos] = useState<Video[]>([]);
    const[loading,setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadVideos().then(() => {});
    }, []);
    const loadVideos = async () => {
        try {
            const data=await fetchSubscribedVideos();
            setVideos(data);
        }catch (e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    };
    if(loading)return <div className={'p-10 flex justify-center items-center'}>
        <Spinner color={"disabled"}/>
    </div>

    if(videos.length===0){
        return <div className={twMerge(
            ['flex','flex-col','items-center','justify-center','h-[50dvh]']
        )}>
            <MdSubscriptions className={'w-16 h-16 text-text-disabled'}/>
            <h2 className={'text-xl font-bold mb-2'}>
                새로운 동영상을 놓치지 마세요
            </h2>
            <p className={'text-text-disabled mb-6 max-w-60 text-center'}>
                즐겨찾는 채널을 구독하시면 여기서 최신 동영상을 모아볼 수 있습니다.
            </p>
        </div>
    }
    return<div className={twMerge(['p-4','sm:p-6'])}>
        <h1 className={twMerge(
            ['text-2xl','font-bold','mb-6'],
            ['flex','items-center','gap-3']
        )}>

        </h1>
        <div className={'flex flex-wrap'}>
            {videos.map((video)=>(
                <div
                    key={video.id}
                    className={twMerge(
                        ['w-full','sm:w-1/2','md:w-1/3','lg:w-1/4'],
                        ['px-2','mb-8']
                    )}
                >
                    <VideoCard video={video} />
                </div>
            ))}
        </div>
    </div>
}
export default Subscriptions;