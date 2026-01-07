import { useCallback, useEffect, useRef, useState } from "react";
import { fetchVideos, type Video } from "../api/video.ts";
import { twMerge } from "tailwind-merge";
import VideoCard from "../Components/video/VideoCard.tsx";
import Spinner from "../Components/ui/Spinner.tsx";

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    const [fetching, setFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const LIMIT = 12;
    //바로 try catch문을 바로 쓰는 것은 좋은 방법이 아님 함수를 사용한 후 사용
    const loadVideos = useCallback(async (pageNum: number) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setFetching(true);

            const result = await fetchVideos(pageNum, LIMIT);

            /*state의 set함수인 매개변수에는 함수가 들어갈 수 있음
             * 함수를 사용하면, 매개변수 자리엔 원래 있던 값이 들어감*/
            setVideos((prev) => {
                if (pageNum === 1) return result.videos;

                /*그냥 이대로 덧붙여주기만 하면 시간차가 존재하기 때문에 중복이 될 수 있음
                 * 새로 도착한 result.videos 에 filter을 사용해 중복을 방지해줘야함
                 * 그 새로운 요소(newV)를 순회하여 판단을 함
                 * 기존데이터 (prev)에 조건(prevV의 id와 newV의 id가 같으면) 탈락 되도록*/
                const newVideos = result.videos.filter(
                    (newV) => !prev.some((prevV) => prevV.id === newV.id),
                );
                return [...prev, ...newVideos];
            });
            setHasNextPage(result.hasNextPage);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, []);
    /*초기 로딩에 대해서만 관여함
    * loadVideos는 useCallback으로 감싸줬지 때문에 변하지 않기 때문 */
    useEffect(() => {
        loadVideos(1).then(() => {});
    }, [loadVideos]);

    /* useRef : 해당 HTML 컴포넌트를 대상으로 선택하는 훅*/
    const observerTarget =useRef<HTMLDivElement>(null);

    useEffect(() => {
        /* 1) 타깃에 대한 감지 기능 작성
        * IntersectionObserver(동작함수, 옵션)*/
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting &&hasNextPage&& !loading && !fetching){
                setPage(prev=>prev+1);
            }
        },{
            /*감지 기분을 0 ~ 1
            * 감지 기준을 50%로 설정*/
            threshold: 0.5,
        })
        if(observerTarget.current){
            observer.observe(observerTarget.current);
        }
        //해단 컴포넌트를 사용자가 벗어나게되면 실행됨. 메모리 누수 방지
        return () => observer.disconnect();
    }, [hasNextPage, loading,fetching]);

    //page 번호가 바뀔 때 등장하는 useEffect
    useEffect(() => {
        if(page>1){
            loadVideos(page).then(()=>{});
        }
    }, [page,loadVideos]);
    if (loading) {
        return (
            <div className={"p-8 text-center text-text-disabled"}>
                로딩 중 ...
            </div>
        );
    }
    if (videos.length === 0) {
        return (
            <div
                className={twMerge(
                    ["flex", "flex-col", "justify-center", "items-center"],
                    ["h-[50dvh]", "text-text-disabled"],
                )}
            >
                <p className={"text-lg"}>등록된 영상이 없습니다.</p>
                <p className={"text-sm"}>첫 번째 영상을 업로드 해보세요 !!</p>
            </div>
        );
    }
    return (
        <div className={twMerge(["p-4", "sm:p-6"])}>
            <div className={"flex flex-wrap"}>
                {videos.map((video) => (
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
            <div ref={observerTarget} className={twMerge(
                ['h-10','flex','justify-center','items-center','mt-8'])}>
                {fetching && <Spinner color={"primary"} />}
            </div>
            {!hasNextPage && videos.length > 0 && (
                <div className={twMerge(['text-center','text-sm','py-10'])}>
                    모든 동영상을 불러왔습니다.
                </div>
            )}
        </div>
    );
}
export default Home;
