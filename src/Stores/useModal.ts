import { create } from "zustand";
import { persist } from "zustand/middleware";

/*비회원이 회원 전용 메뉴게 접근했을 때 띄워줘야하는 모달
* 기본적으로 나와야하는 템플린 type을 지정해서 손쉽게 꺼내 쓸 수 있도록  type마련*/

type ModalType ="LOGIN_REQUIRED"|"ADDRESS_SEARCH" |null;
interface ModalState {
    isOpen: boolean;
    type:ModalType;
    props?: any;

    openModal: (type:ModalType,props?:any)=>void;
    closeModal:()=>void;
}
export const useModalStore = create<ModalState>()(
    persist(
        (set) => ({
            isOpen: false,
            type: null,
            props: undefined,

            openModal: (type, props) =>
                set({
                    isOpen: true,
                    type,
                    props,
                }),
            closeModal: () =>
                set({
                    isOpen: false,
                    type: null,
                    props: undefined,
                }),
        }),
        { name: "soltube-modal" },
    ),
);