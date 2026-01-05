import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../Stores/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import Input from "../../Components/ui/Input.tsx";
import Button from "../../Components/ui/Button.tsx";
import { createNotice } from "../../api/notice.ts";

type NoticeCreateFormData = {
    title: string,
    content: string,
}
function NoticeCreate() {
    const navigate=useNavigate();
    const{user}=useAuthStore();
    const{
        register,
        handleSubmit,
        formState:{errors,isSubmitting},
    }=useForm<NoticeCreateFormData>();

    const onSubmit=async (formDate:NoticeCreateFormData)=>{
        try {
            const result=await createNotice(formDate.title,formDate.content);
            navigate(`/notices/${result.id}`);
        }catch(e){
            console.log(e)
            alert("등록에 실패했습니다.")
        }
    }

    if(!user || user.role !=="ADMIN")return null;
    return <div className={twMerge(['max-w-4xl','mx-auto','px-4'])}>
        <h1 className={twMerge(['text-2xl','font-bold','mb-6'])}>공지사항 작성</h1>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={'space-y-6 p-6 border border-divider rounded-lg'}>
            <Input
                label={"제목"}
                placeholder={"공지사항 제목을 입력하세요"}
                error={errors.title?.message}
                registration={register("title",{required:"제목은 필수입니다."})}
            />
            <div className={'flex flex-col gap-2'}>
                <label className={'text-sm font-medium'}>내용</label>
                <textarea
                    className={twMerge(
                        ['h-88','p-3','rounded-md','border','border-divider'],
                        ['focus:outline-none','focus:border-secondary-main','resize-none'],
                        )}
                    placeholder={"공지사항 내용을 입력하세요."}
                    {...register("content",{required:"내용은 필수입니다."})}
                />
                {errors.content &&(
                    <span className={'text-xs text-error-main'}>
                        {errors.content.message}
                    </span>
                )}
            </div>
            <div className={twMerge(
                ['flex','justify-end','gap-3'],
                ['pt-4','border-t','border-divider']
            )}>
                <Button variant={"ghost"}>취소</Button>
                <Button type={"submit"} disabled={isSubmitting}>
                    {isSubmitting ? "동록 중 ...":"등록하기"}
                </Button>
            </div>
        </form>
    </div>;
}

export default NoticeCreate;
