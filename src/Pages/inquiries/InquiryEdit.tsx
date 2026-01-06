import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../Stores/useAuthStore.ts";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Input from "../../Components/ui/Input.tsx";
import Button from "../../Components/ui/Button.tsx";
import { fetchInquiry, updateInquiry } from "../../api/inquiry.ts";

type InquiryEditFormData = {
    title: string,
    content: string,
}
function InquiryEdit(){
    const navigate=useNavigate();
    const{user}=useAuthStore();
    const{id}=useParams();

    const{
        register,
        handleSubmit,
        setValue,
        formState:{errors,isSubmitting},
    }=useForm<InquiryEditFormData>();
    //Edit는 기본데이터를 불러와서, input 등에 그 데이터를 넣어줘야 함

    useEffect(() => {
        loadInquiry().then(()=>{})
    },[])

    const loadInquiry = async ()=>{
        try {
            const result=await fetchInquiry(Number(id));

            if(result.isAnswered){
                alert("답변이 달린 글은 수정할 수 없습니다.")
                navigate(-1);
                return;
            }
            setValue("title",result.title);
            setValue("content",result.content);
        }catch(e){
            console.log(e);
            alert("데이터를 불러오지 못했습니다.")
            navigate("/inquiries")
        }
    }

    const onSubmit=async (formDate:InquiryEditFormData)=>{
        try {
            const result=await updateInquiry(Number(id),formDate);
            navigate(`/inquiries/${result.id}`);
        }catch(e){
            console.log(e)
            alert("수정에 실패했습니다.")
        }
    }

    if(!user || user.role !=="ADMIN") return null;

    return <div className={twMerge(['max-w-4xl','mx-auto','px-4'])}>
        <h1 className={twMerge(['text-2xl','font-bold','mb-6'])}>문의사항 작성</h1>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={'space-y-6 p-6 border border-divider rounded-lg'}>
            <Input
                label={"제목"}
                placeholder={"문의사항 제목을 입력하세요"}
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
                    placeholder={"문의사항 내용을 입력하세요."}
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
export default InquiryEdit