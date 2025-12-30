import {type MouseEvent}from "react";
import {twMerge} from "tailwind-merge";
import {Link} from "react-router";
import {MdCampaign, MdDarkMode, MdLightMode, MdMenu, MdSearch, MdVideoCall} from "react-icons/md";
import {FaRegUserCircle, FaYoutube} from "react-icons/fa";
import {useThemeStore} from "../Stores/useTheme.ts";
import { useModalStore } from "../Stores/useModal.ts";
import { useAuthStore } from "../Stores/useAuthStore.ts";

function Header() {
    const {theme,toggleTheme}=useThemeStore();
    const{openModal}=useModalStore();
    const{isLoggedIn}=useAuthStore();

    /* > 외부와 통신할 필요 없기 때문에 async 안 붙여도 됨.

    *  > MouseEvent 라는 이름의 타입이 javascript에도 있고 react에도 있음
    *   우리가 써야하는 건 react의 MouseEvent 타입이라 이름을 명시적으로 수동으로 적어줘야 함*/
    const handleUploadClick=(e:MouseEvent<HTMLAnchorElement>)=>{
        /*비회원이 누르면, 모달을 띄우고 작업을 끝내는 함수*/
        if(!isLoggedIn){
            /* a 태그에 onClick을 사용하고 있기 때문에 a의 기본기능인 "이동"을 막을 필요가 있음.
            *  이벤트 버블링 : 클릭 이벤트 등의 이벤트가 상위 요소로 전파되는 현상*/
            e?.preventDefault();
            openModal("LOGIN_REQUIRED");
        }
    }

    return<header className={twMerge(
        ['fixed','top-0','left-0','right-0','h-header','px-4'],
        ['border-b','border-divider'],
        ['flex','justify-between','items-center'],
        ['z-50']
    )}>
        {/*왼족*/}
        <div className={twMerge(['flex','items-center','gap-4'])}>
            <button className={twMerge(
                ['p-2','rounded-full','hover:bg-text-default/10']
            )}>
                <MdMenu className={twMerge(['w-6','h-6'])}/>
            </button>
            <Link to={"/"} className={'flex items-center gap-2'}>
                <FaYoutube className={twMerge(['w-8','h-8','text-primary-main'])}/>
                <span className={'text-xl font-bold italic'}>SolTube</span>
            </Link>
        </div>
        {/*가운데*/}
        <div className={twMerge(
            ['flex-1','max-w-[600px]'],
            ['flex','items-center']
        )}>
            <div className={'flex w-full'}>
                <input
                    placeholder={"검색"}
                    className={twMerge(
                        ['border','border-divider','shadow-inner'],
                        ['w-full','rounded-l-full','px-4','py-2'],
                        ['text-text-default','placeholder:text-text-disabled'],
                        ['focus:outline-none','focus:border-secondary-main'],
                        )}
                />
                <button className={twMerge(
                    ['px-4','py-2'],
                    ['border','border-divider','rounded-r-full','border-l-0']
                )}>
                    <MdSearch className={twMerge(['w-6','h-6'])}/>
                </button>
            </div>
        </div>
        {/*오른쪽*/}
        <div className={twMerge(['flex','items-center','gap-2'])}>
            <Link to={"/notices"} className={twMerge(
                ['flex','items-center','justify-center','p-2'],
                ['rounded-full','hover:bg-text-default/10']
            )}
                  title={"공지사항"}
            >
                <MdCampaign className={'w-6 h-6'}/>
            </Link>
            <button
                onClick={toggleTheme}
                className={twMerge(
                ['flex','items-center','justify-center','p-2'],
                ['rounded-full','hover:bg-text-default/10']
            )}
                title={theme === "dark" ? "라이트모드로 변경":"다크모드로 변경"}
            >
                {theme === "dark" ?(
                    <MdLightMode className={'w-6 h-6'}/>
                ):(
                    <MdDarkMode className={'w-6 h-6'}/>
                )}
            </button>
            <Link
                onClick={handleUploadClick}
                to={"/upload"} className={twMerge(
                ['flex','items-center','justify-center','p-2'],
                ['rounded-full','hover:bg-text-default/10']
            )}
                  title={"동영상 업로드"}
            >
                <MdVideoCall className={'w-6 h-6'}/>
            </Link>
            <Link to={"/sign-in"} className={twMerge(
                ['flex','items-center','gap-2','px-4','py-2'],
                ['border','border-divider','rounded-full'],
                ['text-secondary-main','font-medium','hover:bg-secondary-main/10']
            )}>
                <FaRegUserCircle className={'w-5 h-5'}/>
                <span className={'text-sm'}>로그인</span>
            </Link>
        </div>
    </header>
}
export default Header;
