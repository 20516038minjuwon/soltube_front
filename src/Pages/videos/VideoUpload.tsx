import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { useEffect, useState, type KeyboardEvent} from "react";
import { MdCloudUpload, MdImage } from "react-icons/md";
import Input from "../../Components/ui/Input.tsx";
import Button from "../../Components/ui/Button.tsx";
import { useNavigate } from "react-router";
import { api } from "../../api/axios.ts";
import type { AxiosError } from "axios";

interface UploadFormData{
    title: string;
    description: string;
    video:FileList;
    thumbnail:FileList;
}
function VideoUpload(){
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        /* watch : 실시간으로 감시해서 값이 변경되면 그 변경된 값으로 가져옴
        *  watch와 비슷한 역할을 하는 것 setValue*/
        watch,
        formState: { errors ,isSubmitting },
    } = useForm<UploadFormData>();

    /* 비디오 파일 선택 시 미리보리 생성*/
    const videoFile=watch("video");
    /* 사용자의 컴퓨터에 잇는 파일 경로를 임실 인터넷 URL처럼 작성한 걸 video 파일에 src에 넣을 state
    *  파일 자체가 필요한 것이 아니라 미리보기할 URl만 필요하므로 그것만 담은 State를 활용 */
    const [videoPreview,setVideoPreview]=useState<string|null>(null);
    /* videoFile이 변경될 때마다 바뀔 useEffect가 필요함
    *  만약 비디오 파일이 있고 그 파일이 하나 보다 더 많으면 일단은 파일 첫번째 것을 선택하고 나서
    *  임시URl을 발급받아서 비디오의 미리보기가 보이게 한다. */
    useEffect(()=>{
        if(videoFile && videoFile.length>0){
            const file=videoFile[0];
            //URL.createObjectURL() : 임시 URL 발급
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
            /* 해체하지 않으면 프로그램이 끝날 때 까지 계쏙 메모리에 상주하게 되므로
            *  URL.createObjectURL() 로 발급 받았던 URL은 사용 후 반드시 해제해야함.*/
            return()=>URL.revokeObjectURL(url);
        }
    },[videoFile])
    /*썸네일 파일 선택 시 미리보기 생성*/
    const thumbnailFile =watch("thumbnail");

    const [thumbnailPreview,setThumbnailPreview]=useState<string|null>(null);

    useEffect(()=>{
        if(thumbnailFile&&thumbnailFile.length>0){
            const file=thumbnailFile[0];
            const url = URL.createObjectURL(file);
            setThumbnailPreview(url);
            return()=>URL.revokeObjectURL(url);
        }
    },[thumbnailFile])
    /* 해시태그 관리용 코드*/
    const [tagInput,setTagInput]=useState("");
    const[tags,setTags]=useState<string[]>([]);
    //KeyboardEvent도 javascript 타입과 react 타입  두 가지가 있어 타입을 수동 임포트 함
    const handleKeyDown=(e:KeyboardEvent<HTMLInputElement>) => {
        //엔터나 콤마 (,) 를 사용자가 입력했을 때
        if(e.key === "Enter"||e.key === ","){
            //submit의 기본기능이 동작하지 않게 함
            e.preventDefault();
            /* trim() : string의 양 끝단에 존재하는 공백 제거
            *  replace(정규표현식, 대체문자열) : 정규표현식에 해당하는 문자열을 대체 문자열로 변경 */
            const newTag=tagInput.trim().replace(/^#/,"");
            if(newTag && !tags.includes(newTag)){
                setTags([...tags,newTag]);
                setTagInput("");
            }
        }
    };
    const removeTag=(tagToRemove:string)=>{
        /*외부에서 주입받은 tagToRemove에 해당하는 string과
        * 내부 요소가 다른 것들만 필터링해서 출력한 뒤, tags state에 저장*/
        setTags(tags.filter(tag=>tag!==tagToRemove));
    }
    {/* onSubmit */}
    const onSubmit=async (data:UploadFormData)=>{
        try {
            /* onSubmit 할 때 전달받은 정보는 UploadFormData 뿐 임.
            *  그런데 그 내용에는 해시태그에 대한 내용이 없음
            * (해스태그는 따로 수동으로 만들어줬기 때문) */

            const formData=new FormData(); // 전달하려고 하는 FormData 형식을 새로 만들어줌
            formData.append("title",data.title);
            formData.append("description",data.description);
            formData.append("video",data.video[0]);
            formData.append("thumbnail",data.thumbnail[0]);
            formData.append("hashtags",JSON.stringify(tags))

            //서버 전송
            await api.post("/videos",formData,{
                headers:{
                    /*파일이 포함된 전송을 할 때에는 꼭!!!!! 필수로 !!!!!!!
                    *  "Content-Type":"multipart/form-data"로 해줘야 함*/
                    "Content-Type":"multipart/form-data"
                },
            });
            alert("업로드가 완료되었습니다.")
            navigate("/");
        }catch(e){
            const axiosError=e as AxiosError<{message:string}>
            const msg=axiosError.response?.data.message ||"업로드 실패"
            alert(msg)
        }

    }

    return<div className={twMerge(
        ['min-h-[calc(100dvh-56px)]','px-4','py-10'],
        ['flex','justify-center','items-center']
    )}>
        <div className={twMerge(['w-full','max-w-200','space-y-6'])}>
            <h1 className={twMerge(['text-2xl','font-bold'])}>동영상 업로드</h1>
            <form className={'space-y-8'} onSubmit={handleSubmit(onSubmit)}>
                {/*동영상 업로드*/}
                <div className={'space-y-2'}>
                    <label className={twMerge(['block','text-sm','font-medium'])}>동영상 파일</label>
                    <div className={twMerge(
                        ['relative flex flex-col justify-center items-center'],
                        ['w-full h-64 border-2 border-divider rounded-lg border-dashed'],
                        ['bg-background-paper','hover:bg-gray-200/30','overflow-hidden','cursor-pointer']
                    )}>
                        {videoPreview ? (
                            <video
                                src={videoPreview}
                                className={twMerge(['w-full h-full object-contain bg-black'])}
                            />
                        ):(
                                <div className={twMerge(['flex flex-col items-center justify-center'])}>
                                    <MdCloudUpload className={'w-10 h-10 mb-3'}/>
                                    <p className={'text-sm font-semibold'}>클릭하여 업로드 또는 드래그</p>
                                </div>
                        )}
                        {/*label 태그는 htmlFor 속성을 통해서 label클릭 시 input이 동작되게 했었으나,
                        지금은 영역이 div이기 때문에 그러한 방법은 사용이 불가.
                        부모의 div를 눌렀을 때 input이 배치되게 하기 위해서 absolute를 주고
                         w-full,h-full을 통해 넓이 높이에 맞춰준다.
                        마지막으로input이 보이지 않게 하기 위해서
                        opacity-0을 주면 부모div를 눌렀을 때 input이 작동된다.*/}
                        <input type="file" accept={"video/*"}
                               className={twMerge(['absolute inset-0 w-full h-full opacity-0'])}
                               {...register("video",{required:"비디오 파일을 선택해주세요."})}
                        />
                    </div>
                    {errors.video&&(
                        <p className={'text-error-main text-xs'}>{errors.video.message}</p>
                    )}
                </div>
                {/*동영상 정보 입력*/}
                <div className={twMerge(['flex','gap-6','flex-col','lg:flex-row'])}>
                    <div className={twMerge(['w-full','md:w-2/3','space-y-4'])}>
                        <Input
                            label={"제목"}
                            placeholder={"동영상 제목을 입력해주세요"}
                            error={errors.title?.message}
                            registration={register("title",{required:"제목은 필수 입니다."})}
                        />
                        <div className={twMerge(['flex','flex-col','gap-1'])}>
                            <label className={'text-sm font-medium'}>설명</label>
                            <textarea
                                className="w-full h-32 rounded-md border border-divider bg-background-default px-3 py-2 text-sm text-text-default placeholder:text-text-disabled focus:outline-none focus:border-secondary-main resize-none"
                                placeholder="동영상에 대한 설명을 입력하세요"
                                {...register("description", {
                                    required: "설명은 필수입니다.",
                                })}></textarea>
                            {errors.description && (
                                <span className="text-xs text-error-main">
                                        {errors.description.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={twMerge(['w-full','md:w-1/3'])}>
                        <label className="block text-sm font-medium text-text-default">
                            썸네일
                        </label>
                        <div className="relative w-full aspect-video border border-divider rounded-md bg-background-paper overflow-hidden flex items-center justify-center group">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-text-disabled flex flex-col items-center">
                                    <MdImage className="w-8 h-8 mb-1" />
                                    <span className="text-xs">이미지 업로드</span>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                {...register("thumbnail", {
                                    required: "썸네일을 선택해주세요.",
                                })}
                            />

                            {/* 호버 시 안내 */}
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-sm font-medium pointer-events-none">
                                변경하기
                            </div>
                        </div>
                        {errors.thumbnail && (
                            <p className="text-error-main text-xs">
                                {errors.thumbnail.message}
                            </p>
                        )}
                    </div>
                </div>
                {/*해시태그*/}
                <div className={'space-y-2'}>
                    <label className={'block text-sm font-medium'}>해시태그</label>
                    <div className={twMerge(
                        ['flex flex-wrap gap-2 p-3'],
                        ['border border-divider rounded-md'],
                        //focus-within 접두사 : 내 안의 자식들까지 포함해서 focus가 걸리면 발동
                        ['focus-within:border-secondary-main']
                    )}>
                        {/*해시태그 자체*/}
                        {tags.map((tag) => (
                            <span key={tag} className={twMerge(
                                ['flex','items-center','gap-1'],
                                ['bg-secondary-main/10','text-secondary-main'],
                                ['px-2','py-1','rounded-full','text-sm']
                            )}>
                                #{tag}
                                <button
                                    type={"button"}
                                    onClick={() => removeTag(tag)}
                                    className={'hover:text-error-main'}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        {/* input */}
                        <input
                            value={tagInput}
                            onChange={e=>setTagInput(e.target.value)}
                            /* onKeyDown : 어떠한 키보드의 키를 누르게되면 발동되는 함수를 작성 */
                            onKeyDown={handleKeyDown}
                            placeholder={"태그 입력 후 엔터 (예: 사랑해민솔 )"}
                            className={twMerge(
                                ['flex min-w-30 outline-none'],
                            )}
                        />
                    </div>
                </div>
                <div className={'flex justify-end gap-2'}>
                    <Button type={"button"} variant={"ghost"}>취소</Button>
                    <Button type={"submit"} disabled={isSubmitting}>
                        {isSubmitting? "업로드 중...":"업로드"}
                    </Button>
                </div>
            </form>
        </div>

    </div>
}
export default VideoUpload;