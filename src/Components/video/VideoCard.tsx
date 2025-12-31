import dayjs from "dayjs";
import type { Video } from "../../api/video.ts";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import "dayjs/locale/ko"
import relativeTime from "dayjs/plugin/relativeTime";
import Avatar from "../ui/Avatar.tsx";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type VideoCardProps = {
    video:Video;
}
function VideoCard({video}: VideoCardProps) {

    return<Link
        to={`/video/${video.id}`}
        className={twMerge(['flex','flex-col','gap-3'],['cursor-pointer','group'])}
    >
        {/*썸네일*/}
        <div className={twMerge(
            ['relative','rounded-xl','overflow-hidden'],
            //aspect-video : 영역의 비율을 16:9로 자른다
            ['aspect-video']
            )}>
            <img
                src={video.thumbnailPath}
                alt={video.title}
                className={twMerge(
                    ['w-full','h-full','object-cover'],
                    ['group-hover:scale-105','transition-all', "duration-500"]
                )}
            />
        </div>
        {/*정보 출력 영역*/}
        <div className={'flex gap-3'}>
            <Avatar nickname={video.author.nickname} src={video.author.profileImage} size={"sm"}/>
            <div></div>
            <div className={'flex flex-col'}>
                <h3 className={'font-semibold'}>{video.title}</h3>
                <div className={twMerge(['text-text-disabled','text-sm'])}>
                    <p className={'text-text-default'}>
                        {video.author.nickname}
                    </p>
                    <p>
                        {/*
                            ~초 전, ~분 전, ~시간 전, ~일 전 과 같은 기능들은 직잡 구현할 수도 있음.
                            현재 시각에서 업로드된 시간을 뺀 후,
                            60초 전이라면 ~초 전
                            60분 전이라면 ~분 전
                            24시간 전이라면 ~시간 전
                            그 이상이라면 ~일 전, 으로 직접 구현할 수도 있음

                            javascript에서 시간을 관리하는 내용은 Date객체를 사용해서 구현할 수 있으나,
                            Date 객체는 다루기 어려움. 따라서 날짜/시간에 관련된 라이브러리가 많이 존재한다.
                            Moment.js , Day.js , date-fns 등이 많이 사용된다.

                            dayjs(원하는날짜)  ex) dayjs("2025-10-05")   > dayjs 객체로 반환
                            dayjs().toString  > dayjs 객체를 string으로 반환
                            dayjs 기본 언어셋은 영어
                            한국어로 변경하기 위해서는 컴포넌트 밖에다 작성한다.(파일의 맨 윗부분)
                            1) import "dayjs/locale/ko";
                            2) dayjs.locale("ko")

                            ~초 전,~분 전,~시간 전 이라는 현재 시간 대비 시간을 출력해주려면
                            1) import relativeTime from "dayjs/plugin/relativeTime";
                            2) dayjs.extend(relativeTime);
                            1,2를 컴포넌트 밖에 써주고 (파일의 맨 윗 부분)
                            3) 실제 사용하는 곳에서는 .fromNow()를 사용.
                       */}
                        조회수 {video.views.toLocaleString()}회 • {dayjs(video.createdAt).fromNow()}
                    </p>
                </div>
            </div>
        </div>
    </Link>
}
export default VideoCard;