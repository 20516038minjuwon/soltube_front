import { type FormEvent, type MouseEvent, useState } from "react";
import {twMerge} from "tailwind-merge";
import { Link, useNavigate } from "react-router";
import {
    MdAccountBox,
    MdCampaign,
    MdDarkMode,
    MdEdit,
    MdLightMode, MdLogout,
    MdMenu,
    MdNotifications,
    MdSearch,
    MdSupportAgent,
    MdVideoCall,
} from "react-icons/md";
import {FaRegUserCircle, FaYoutube} from "react-icons/fa";
import {useThemeStore} from "../Stores/useTheme.ts";
import { useModalStore } from "../Stores/useModal.ts";
import { useAuthStore } from "../Stores/useAuthStore.ts";
import Backdrop from "../Components/ui/Backdrop.tsx";
import Avatar from "../Components/ui/Avatar.tsx";
import {useLayoutStore} from "../Stores/useLayoutStore.ts";

function Header() {
    const navigate = useNavigate();
    const {theme,toggleTheme}=useThemeStore();
    const{openModal}=useModalStore();
    const{user, logout,isLoggedIn}=useAuthStore();
    const { toggleSidebar } = useLayoutStore();

    const[isMenuOpen, setIsMenuOpen]=useState(false);

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
    const handleLogout=()=>{
        logout();
        setIsMenuOpen(false);
        navigate("/sign-in");
    }
    const [keyword, setKeyword] = useState("");
    const handleSearch=(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!keyword.trim())return;
        navigate(`/result?q=${keyword}`);
    }

    return<>
        <header className={twMerge(
            ['fixed','top-0','left-0','right-0','h-header','px-4'],
            ['border-b','border-divider'],
            ['flex','justify-between','items-center'],
            ['z-50','bg-background-paper']
        )}>
            {/*왼족*/}
            <div className={twMerge(['flex','items-center','gap-4'])}>
                <button
                    onClick = {toggleSidebar}
                    className={twMerge(
                    ['p-2','rounded-full','hover:bg-text-default/10']
                )}>
                    <MdMenu className={twMerge(['w-6','h-6'])}/>
                </button>
                <Link to={"/"} className={'flex items-center gap-1'}>
                    <FaYoutube className={twMerge(['w-8','h-8','text-primary-main'])}/>
                    <span className={'text-xl font-bold italic'}>SolTube</span>
                </Link>
            </div>
            {/*가운데*/}
            <div className={twMerge(
                ['flex-1','max-w-[600px]'],
                ['hidden','md:flex','items-center']
            )}>
                <form
                    onSubmit={handleSearch}
                    className={'flex w-full'}>
                    <input
                        placeholder={"검색"}
                        value={keyword}
                        onChange={e=>setKeyword(e.target.value)}
                        className={twMerge(
                            ['border','border-divider','shadow-inner'],
                            ['w-full','rounded-l-full','px-4','py-2'],
                            ['text-text-default','placeholder:text-text-disabled'],
                            ['focus:outline-none','focus:border-secondary-main'],
                        )}
                    />
                    <button
                        type={"submit"}
                        className={twMerge(
                        ['px-4','py-2'],
                        ['border','border-divider','rounded-r-full','border-l-0']
                    )}>
                        <MdSearch className={twMerge(['w-6','h-6'])}/>
                    </button>
                </form>
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
                    to={"/video/upload"} className={twMerge(
                    ['flex','items-center','justify-center','p-2'],
                    ['rounded-full','hover:bg-text-default/10']
                )}
                    title={"동영상 업로드"}
                >
                    <MdVideoCall className={'w-6 h-6'}/>
                </Link>
                {isLoggedIn &&user ?(
                    <>
                        <button className={twMerge(
                            ['flex','items-center','justify-center','p-2'],
                            ['rounded-full','hover:bg-text-default/10']
                        )}>
                            <MdNotifications className={'w-6 h-6'}/>
                        </button>
                        <div className={'relative'}>
                            <Avatar
                                nickname={user.nickname}
                                size={"sm"}
                                src={user.profileImage}
                                onClick={()=>setIsMenuOpen(!isMenuOpen)}
                            />
                            {isMenuOpen &&
                                <div className={twMerge(
                                    ['absolute','top-full','right-0','mt-2','w-60'],
                                    ['bg-background-paper','border','border-divider','rounded-xl'],
                                    ['shadow-lg','overflow-hidden'],
                                )}>
                                    <div className={twMerge(
                                        ['px-4','py-3','border-b','border-divider']
                                    )}>
                                        <p className={'font-semibold'}>{user.nickname}</p>
                                        <p className={'text-text-disabled text-xs'}>{user.email}</p>
                                    </div>
                                    <div className={"py-2"}>
                                        <Link to={"users/edit"}
                                              onClick={()=>setIsMenuOpen(false)}
                                              className={twMerge(
                                                  ['flex','items-center','gap-2','px-4','py-2'],
                                                  ['text-xs','hover:bg-text-default/10']
                                              )}>
                                            <MdEdit className={'w-4 h-4'}/>
                                            프로필 수정
                                        </Link>
                                        <Link to={`/channel/${user.id}`}
                                              onClick={()=>setIsMenuOpen(false)}
                                              className={twMerge(
                                                  ['flex','items-center','gap-2','px-4','py-2'],
                                                  ['text-xs','hover:bg-text-default/10']
                                              )}>
                                            <MdAccountBox className={'w-4 h-4'}/>
                                            내 채널
                                        </Link>
                                        <Link to={"/inquiries"}
                                              onClick={()=>setIsMenuOpen(false)}
                                              className={twMerge(
                                                  ['flex','items-center','gap-2','px-4','py-2'],
                                                  ['text-xs','hover:bg-text-default/10']
                                              )}>
                                            <MdSupportAgent className={'w-4 h-4'}/>
                                            고객센터 (1:1문의)
                                        </Link>
                                    </div>
                                    <div className={twMerge(['border-t','border-divider','my-1'])}></div>
                                    <button
                                        onClick={handleLogout}
                                        className={twMerge(
                                            ['w-full','flex','items-center','gap-3','px-4','py-2'],
                                            ['text-sm','text-error-main','hover:bg-error-main/5']
                                        )}
                                    >
                                        <MdLogout className={'w-5 h-5'}/>
                                        로그아웃
                                    </button>
                                </div>
                            }

                        </div>
                    </>
                ):(
                    <Link to={"/sign-in"} className={twMerge(
                        ['flex','items-center','gap-2','px-4','py-2'],
                        ['border','border-divider','rounded-full'],
                        ['text-secondary-main','font-medium','hover:bg-secondary-main/10']
                    )}>
                        <FaRegUserCircle className={'w-5 h-5'}/>
                        <span className={'text-sm'}>로그인</span>
                    </Link>
                )}
            </div>
        </header>
        {isMenuOpen &&<Backdrop
            onClose={()=>setIsMenuOpen(false)}
            className={twMerge(['bg-transparent','backdrop-blur-none'])}
        />}
    </>
}
export default Header;
