import { twMerge } from "tailwind-merge";
import { Outlet } from "react-router";
import Header from "../Components/Header.tsx";
import { useThemeStore } from "../Stores/useTheme.ts";
import { useEffect } from "react";
import GlobalModal from "../Components/ui/GlobalModal.tsx";

function Layout() {
    const {theme}=useThemeStore();

    /*theme라는 값이 변경이 될때 html태그에 class="dark"를 추가/제거 */
    useEffect(()=>{
        const html=document.documentElement;
        if(theme==="dark"){
            html.classList.add("dark");
        }else{
            html.classList.remove("dark");
        }
    },[theme]);
    return (
        <div className={twMerge(['min-h-calc[100dvh-var(--height-header)]','pt-14'])}>
            <Header />
            <main className={'p-4'}>
                <Outlet/>
            </main>
            <GlobalModal/>
        </div>
    )
}
export default Layout;