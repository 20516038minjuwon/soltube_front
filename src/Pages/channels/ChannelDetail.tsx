import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { type ChannelData, fetchChannel } from "../../api/channel.ts";
import Spinner from "../../Components/ui/Spinner.tsx";
import { useAuthStore } from "../../Stores/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import Avatar from "../../Components/ui/Avatar.tsx";
import { toggleSubscription } from "../../api/subscription.ts";
import { useModalStore } from "../../Stores/useModal.ts";
import VideoCard from "../../Components/video/VideoCard.tsx";

function ChannelDetail(){
    const {id}=useParams();
    const navigate = useNavigate();
    const{user,isLoggedIn}=useAuthStore();
    const{openModal}=useModalStore();

    const[channel,setChannel]=useState<ChannelData|null>(null);
    const[loading,setLoading]=useState(true);
    const[activeTab, setActiveTab] = useState(1);

    const tabList =[
        {index:1, label:"홈",name:"Home"},
        {index:2, label:"동영상",name:"Video"},
        {index:3, label:"재생목록",name:"PlayList"},
        {index:4, label:"커뮤니티",name:"Community"},
    ];

    useEffect(()=>{
        loadChannel().then(()=>{})
    },[])

    const loadChannel=async()=>{
        try {
            const result=await fetchChannel(Number(id));
            setChannel(result);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleSubscribeClick = async () => {
        if (!channel) return;
        if (!isLoggedIn) {
            openModal("LOGIN_REQUIRED");
            return;
        }

        const prevIsSubscribed = channel.isSubscribed;      // 요청하기 이전 상태를 기억
        const prevSubscriberCount = channel.subscriberCount;

        const newSubscriberCount=prevIsSubscribed ? prevSubscriberCount - 1 : prevSubscriberCount + 1

        setChannel({...channel,isSubscribed:!prevIsSubscribed,subscriberCount:newSubscriberCount});

        try {
            await toggleSubscription(channel.id);
        } catch (e) {
            console.log(e);
            setChannel({ ...channel,isSubscribed:prevIsSubscribed ,subscriberCount:newSubscriberCount});
        }
    }
    if(loading)return (
        <div className={'items-center justify-center flex h-[50dvh]'}>
            <Spinner color={"disabled"}/>
        </div>
    );
    if(!channel)return (
        <div className={'items-center justify-center flex h-[50dvh]'}>
            채널을 찾을 수 없습니다.
        </div>
    );
    const isMyChannel=user?.id===channel.id;

    return<div className={twMerge(['w-full','min-h-screen','pb-10'])}>
        {/*채널 Header*/}
        <div className={twMerge(['max-w-6xl','mx-auto','px-4','mb-4','sm:px-6'])}>
            <div className={twMerge(
                ['flex','flex-col','sm:flex-row','items-start','sm:items-center','gap-6']
            )}>
                <Avatar nickname={channel.nickname} size={"xl"} src={channel.profileImage}/>
                <div className={twMerge(['flex','flex-1','flex-col','gap-2'])}>
                    <h1 className={twMerge(['text-2xl','sm:text-3xl','font-bold'])}>
                        {channel.nickname}
                    </h1>
                    <div className={twMerge()}>
                        {/* split : string타입의 메소드이며
                                    해당 스트링이 문자열에 들어있을 경우,
                                    그 글자를 기준으로 분할하여 array로 반환
                                    ex) abc@abc.com => ['abc','@','abc.com']
                        */}
                        <p>@{channel.email.split("@")[0]}</p>
                        <p>구독자 {channel.subscriberCount}명 / 동영상 {channel.videoCount}개</p>
                    </div>
                    <div className={'mt-2'}>
                        {isMyChannel ?(
                            /*내 채널일 때엔 "프로필 수정"버튼과 "동영상 등록" 버튼 삽입*/
                            <div className={'flex gap-2'}>
                                <button
                                    onClick={()=>navigate("/users/edit")}
                                    className={twMerge(
                                        ['px-4','py-2'],
                                        ['border','border-divider','rounded-full'],
                                        ['text-sm','font-semibold'],
                                        ['cursor-pointer','hover:bg-gray-300/20']
                                    )}
                                >
                                    프로필 수정
                                </button>
                                <button
                                    onClick={()=>navigate("/video/upload")}
                                    className={twMerge(
                                        ['px-4','py-2'],
                                        ['border','border-divider','rounded-full'],
                                        ['text-sm','font-semibold'],
                                        ['cursor-pointer','hover:bg-gray-300/20']
                                    )}
                                >
                                    동영상 관리
                                </button>
                            </div>
                        ):(
                            /*내 체널이 아닐때엔 "구독"버튼*/
                            <button
                                className={twMerge(
                                    ["ml-4", "px-4", "py-2", "rounded-full"],
                                    ["text-sm", "font-medium", "hover:opacity-90"],
                                    channel.isSubscribed
                                        ? ["bg-success-main", "text-success-contrastText"]
                                        : ["bg-text-default", "text-background-default"],
                                )}
                                onClick={handleSubscribeClick}
                            >
                                {channel.isSubscribed ? "구독중" : "구독"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
        {/*Tab*/}
        <div className={twMerge(
            ['sticky','top-14','z-100'],
            ['border-b','border-divider','mb-6']
        )}>
            <div className={twMerge(
                ['max-w-6xl','mx-auto','px-4','flex','gap-6','overflow-x-auto']
            )}>
                {tabList.map(tab=>(
                    <button
                        key={tab.index}
                        className={twMerge(
                            ['py-3','text-sm','font-semibold','border-b-2'],
                            tab.index ===activeTab
                                ? ['border-text-default','text-text-default']
                                :['border-transparent','text-text-disabled']
                        )}
                        onClick={()=>setActiveTab(tab.index)}
                    >{tab.name}</button>
                ))}
            </div>
        </div>
        {/*동영상 목록*/}
        <div className={twMerge(['max-w-400','mx-auto','px-4'])}>
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-6"], ["flex", "items-center", "gap-3"])}>
                동영상
            </h1>
            <div className={twMerge(["flex", "flex-wrap"])}>
                {channel.videos.map((video) => (
                    <div
                        key={video.id}
                        className={twMerge(
                            ["w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4"],
                            ["px-2", "mb-8"],
                        )}
                    >
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    </div>
}
export default ChannelDetail;