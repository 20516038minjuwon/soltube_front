import {twMerge} from "tailwind-merge";
import {useLayoutStore} from "../Stores/useLayoutStore.ts";
import { Link, useLocation } from "react-router";
import {
    MdAccountBox,
    MdHistory,
    MdHome,
    MdSubscriptions,
    MdThumbUp,
} from "react-icons/md";
import type {IconType} from "react-icons";
import {useAuthStore} from "../Stores/useAuthStore.ts";
import Backdrop from "../Components/ui/Backdrop.tsx";

type MenuItemType={
    icon:IconType;
    text:string;
    path:string;
}
function Sidebar(){
    const {pathname} =useLocation();

    const {isSidebarOpen , closeSidebar} = useLayoutStore();
    const {user,isLoggedIn}=useAuthStore();

    const menuItems : MenuItemType[] = [
        {icon : MdHome , text:"HOME", path:"/"},
        {icon: MdSubscriptions, text:"SUBSCRIPTIONS", path:"/channels/subscriptions"},
        {icon : MdHistory, text:"HISTORY", path:"/videos/history"},
    ];
    const userMenuItems:MenuItemType[] = [
        {icon: MdThumbUp,text:"LIKED",path:"/playlist/liked"},
        {icon:MdAccountBox,text:"MY CHANNEL",path: user? `/channels/${user.id}`:"/sign-in"}
    ]
    const handleMenuClick=()=>{
        //window.innerWidth : 사용자가 보고있는 화면의 가로 크기 px
        if(window.innerWidth<640){
            closeSidebar();
        }
    }
    return<>
        {isSidebarOpen &&(
            <div className={twMerge(['sm:hidden'])}>
                <Backdrop onClose={closeSidebar} className={'z-30'}/>
            </div>
        )}
        <aside className={twMerge(
            /*공통으로 들어가는 클래스*/
            ['fixed','left-0','top-14','bottom-0','z-40','w-60'],
            ['bg-background-paper','border-r','border-divider'],
            //overflow-y-auto : overflow가 되는 것을 허용하고 그 범위를 넘긴다면 스크롤바를 남김
            ['overflow-y-auto','transition-all','duration-200'],
            /*데스크톱 동작 클래스*/
            isSidebarOpen ? ['sm:w-60'] : ['sm:w-18'],
            /*모바일 동작 클래스*/
            isSidebarOpen ?['translate-x-0']:['-translate-x-full'],
            //순서가 중요함 나중에 써준 클래스가 최종적으로 작동함.
            "sm:translate-x-0"
        )}>
            <div className={twMerge(['flex','flex-col','p-3','gap-1'])}>
                {menuItems.map(item=>(
                    <MenuItem
                        key={item.text}
                        item={item}
                        isOpen={isSidebarOpen}
                        isActive={pathname===item.path}
                        onClose={handleMenuClick}
                    />
                ))}
                <div className={'my-2 border-t border-divider'}/>
                    {userMenuItems.map(item=>(
                        <MenuItem
                            key={item.text}
                            item={item}
                            isOpen={isSidebarOpen}
                            isActive={pathname===item.path}
                            onClose={handleMenuClick}
                        />
                    ))}
                {!isLoggedIn && isSidebarOpen&&(
                    <div className={'p-4 text-sm flex justify-center flex-col items-center'}>
                        <p className={'mb-3 text-center'}>
                            로그인하면 동영상에 좋아요를 표시하고 댓글을 읽거나 구독할 수 있습니다.
                        </p>
                        <Link to={"/sign-in"}
                              onClick={handleMenuClick}
                            className={twMerge(
                                ['p-4','py-1.5','text-secondary-main'],
                                ['border','border-secondary-main','rounded-md']
                            )}
                        >로그인</Link>
                    </div>
                )}
            </div>
        </aside>
    </>
}
export default Sidebar;

type MenuItemProps={
    item:MenuItemType;
    isOpen:boolean;
    isActive:boolean;
    onClose:VoidFunction;
}
function  MenuItem( {item,isOpen,isActive,onClose}:MenuItemProps){
    return<Link
        onClick={onClose}
        to={item.path}
        className={twMerge(
            ['flex','items-center','gap-5','px-3','py-2.5'],
            ['rounded-lg','transition-colors'],
            isActive ?['bg-text-default/10','text-text-default','font-semibold']
                :
                ['text-text-default','hover:bg-text-default/5']
        )}
    >
        <item.icon className={twMerge(['w-6 h-6'], isActive && 'text-primary-main')}/>
        <span className={twMerge(['text-sm','truncate'], !isOpen && "sm:hidden")}>
            {item.text}
        </span>
    </Link>
}