import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { FaYoutube } from "react-icons/fa";
import Input from "../../Components/ui/Input.tsx";
import Button from "../../Components/ui/Button.tsx";

type SignUpFormData = {
    username: string;
    email: string;
    password: string;
    nickname: string;
    birthDate: string;
    phoneNumber: string;
    gender:"MALE"|"FEMALE";
    zipCode: string;
    address1: string;
    address2?: string;
}
function SignUp(){
    const{
        register,
        handleSubmit,
        formState:{errors,isSubmitting}
    } = useForm<SignUpFormData>();
    return<div className={twMerge(
        ['min-h-[calc(100dvh-var(--height-header))]'],
        ['flex','justify-center','items-center'],
    )}>
        <div className={twMerge(
            ['w-full','max-w-[500px]','space-y-8','p-8'],
            ['border','border-divider','rounded-xl','shadow-lg','bg-background-paper']
        )}>
            {/*로고영역*/}
            <div className={twMerge(['flex','flex-col','items-center','gap-2'])}>
                <FaYoutube className={twMerge(['w-12','h-12','text-primary-main'])}/>
                <h1 className={twMerge('font-bold','text-2xl')}>회원가입</h1>
                <p className={'text-sm text-text-disabled'}>SolTube와 함께하세요.</p>
            </div>
            <form className={'space-y-6'}>
                <div className={'space-y-4'}>
                    <h3 className={twMerge(
                        ['text-lg','font-semibold','pb-2'],
                        ['border-b','border-divider']
                    )}>계정 정보</h3>
                    <div className={twMerge(['flex','gap-2'])}>
                        <Input
                            label={"아이디"}
                            placeholder={"아이디를 입력하세요"}
                            {...register("username",{
                                required:"아이디는 필수입니다.",
                                minLength:{value:4,message:"4자 이상 입력해주세요"}
                            })}
                            error={errors.username?.message}
                        />
                        <Button type={"button"} variant={"secondary"}
                        className={twMerge(['w-32','mt-5.5','text-sm',''])}
                        >중복확인</Button>
                    </div>
                </div>
            </form>
        </div>
    </div>
}
export default SignUp;