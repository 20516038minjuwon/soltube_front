/*
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../Stores/useAuthStore.ts";


type ProfileEditProps = {
    nickname: string;
    username: string;
    email: string;
}
function ProfileEdit ({nickname,username,email}: ProfileEditProps){
    const{user}=useAuthStore();
    return<>
        <div className={twMerge(
            ['flex','justify-center','items-center'],
        )}>
            <button
                className={twMerge(
                    ['w-20','h-20','flex','justify-center','items-center'],
                    ['rounded-full','bg-primary-main'],
                    ['text-sm','font-bold','text-primary-contrastText'],
                    ['hover:opacity-80','focus:outline-none'],
                )}
            >
                {user?.nickname.toUpperCase()}
            </button>
            <div className={'flex flex-col'}>
                <p>{user?.username}</p>
                <p>{user?.email}</p>
            </div>

        </div>
    </>
}
export default ProfileEdit;

 */
function ProfileEdit(){
    return (<></>)
}
export default ProfileEdit;