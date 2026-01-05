import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    nickname: string;
    birthData: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    zipCode: string;
    address1: string;
    address2?: string;
    profileImage?: string;
    role: "USER" | "ADMIN";
};
interface AuthStore {
    user: User|null;
    isLoggedIn: boolean;
    /*백엔드와 내용을 주고받을 때, 진짜 값인 id나 username을 주고받으면 보안 상
     * 취약점이 발생되기 때문에 실제 값을 주고받지 않고 암호화 된 token이라는 값으로 주고 받음*/
    token: string | null;
    /*로그인 기능*/
    login:(token: string,user:User) => void;
    /*로그아웃 기능*/
    logout: () => void;
    /*업데이트 기능*/
    updateUser: (user: Partial<User>) => void;
}
export const useAuthStore =create<AuthStore>()(
    persist(
        set=>({
            token: null,
            user: null,
            isLoggedIn: false,

            /*login,logout 은 기존 값과 상관없이 세로운 값을 넣어주시만 하면
            * 되기 때문에 set뒤에 함수가 아님*/
            login:(token,user) => set({token:token, user:user,isLoggedIn:true}),
            logout:() => set({token:null,user:null,isLoggedIn:false}),
            /*updateUser은 기존 값을 불러와서 그에 따라 저장하는 내용이
            * 달라져야 되기 때문에 set 뒤에 함수가 와야한다
            * state.user 는 User | null타입이기 때문에,
            * state.user 가 있으면 ~ , 없으면 ~ 처리를 해준다.*/
            updateUser:(updateData)=>set(
                state=>({user:state.user ?{...state.user,...updateData}:null})
            ),
        }),
    {name:"soltube-auth"}
    )
)
