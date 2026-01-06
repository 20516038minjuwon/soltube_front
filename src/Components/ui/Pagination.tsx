import { twMerge } from "tailwind-merge";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
    currentPage: number; //현재 페이지 번호
    totalPages: number; //전체 페이지 수
    onPageChange: (page: number) => void; //부모에서 작성한 페이지 변경 핸들러
}
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pageNumbers: number[] = [];
        const maxPagesToShow = 5;

        // 시작 페이지 계산
        // Math.max():파라미터로 전달받은 숫자들 중 가장 큰 값을 반환
        // Math.floor() : 소수점이 있는 숫자를 정수로 반환
        //              : 양수일때 버림 ( ex 4.7 = 4)
        //              : 음수일때 올림 ( ex -4.7 = -5)

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;
        /* startPage가 1이면 1 + 5 - 1 = 5*/
        /* startPage가 2이면 2 + 5 - 1 = 6*/
        /* startPage가 5이면 5 + 5 - 1 = 9*/
        /* startPage가 7이면 7 + 5 - 1 = 11 이므로 if endPage로 막아줌*/

        if (endPage > totalPages){
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        for (let i = startPage; i <= endPage; i++){
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
    return (
        <div className={twMerge(["flex", "justify-center", "items-center", "gap-2", "mt-8"])}>
            {/*이전버튼*/}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={twMerge(
                    ["p-2", "rounded-full"],
                    [
                        "hover:bg-background-paper",
                        "disabled:opacity-30",
                        "disabled:cursor-not-allowed",
                    ],
                )}>
                <MdChevronLeft />
            </button>
            {/*번호버튼*/}
            {getPageNumbers().map(page => (
                <button
                    onClick={()=>onPageChange(page)}
                    className={twMerge(
                        ['w-9','h-9','flex items-center justify-center'],
                        ['rounded-full','text-sm','font-medium'],
                        currentPage===page
                            ?['bg-text-default','text-background-default','font-bold']
                            :['border','border-divider']
                    )}
                >
                    {page}
                </button>
            ))}

            {/*다음버튼*/}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={totalPages === currentPage}
                className={twMerge(
                    ["p-2", "rounded-full"],
                    [
                        "hover:bg-background-paper",
                        "disabled:opacity-30",
                        "disabled:cursor-not-allowed",
                    ],
                )}>
                <MdChevronRight />
            </button>
        </div>
    );
}
export default Pagination;
