import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../Stores/useAuthStore.ts";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "../../Components/ui/Button.tsx";
import { fetchInquires, type Inquiry } from "../../api/inquiry.ts";

dayjs.extend(relativeTime);
dayjs.locale("ko");

function InquiryList(){
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInquired().then(() => {});
    }, []);

    const loadInquired = async () => {
        try {
            const data = await fetchInquires();
            setInquiries(data.inquiries);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={twMerge(["w-full", "max-w-4xl", "mx-auto", "px-4"])}>
            {/*header 부분*/}
            <div className={twMerge(["flex", "justify-between", "items-center", "mb-6"])}>
                <h1 className={twMerge(["text-2xl", "font-bold"])}>1:1 문의</h1>
                {user?.role === "ADMIN" && (
                    <Button onClick={() => navigate("/inquiries/create")}>문의하기</Button>
                )}
            </div>
            {/*게시판 목록*/}
            <div  className={twMerge(["border", "border-divider", "rounded-lg",])}>
                <table className={'w-full'}>
                    <thead className={'border-b border-divider'}>
                    <tr>
                        <th className={twMerge(
                            ['w-[10%]','min-w-20','px-6','py-3'],
                            ['text-sm','font-medium']
                        )}>상태</th>
                        <th className={twMerge(
                            ['w-[70%]','min-w-20','px-6','py-3'],
                            ['text-sm','font-medium']
                        )}>제목</th>
                        <th className={twMerge(
                            ['w-[20%]','min-w-20','px-6','py-3'],
                            ['text-sm','font-medium']
                        )}>날짜</th>
                    </tr>
                    </thead>
                    {/* "divide-y"클래스 : 내부에 들어가는 요소의 u축 사이에 선을 쳐 줌*/}
                    <tbody className={twMerge(['divide-y','divide-divider'])}>
                    {loading ? (
                        <tr>
                            <td colSpan={3} className={twMerge(["p-8", "text-center"])}>로딩중</td>
                        </tr>
                    ):(
                        //2가지 상황
                        //1.게시글이 아예 없을 때
                        //2.게시글이 있을 때
                        inquiries.length === 0? (
                            <tr>
                                <td colSpan={3} className={twMerge(["p-8", "text-center"])}>
                                    문의 내역이 없습니다.
                                </td>
                            </tr>
                        ):(
                            inquiries.map(inquiry=>(
                                <tr key={inquiry.id} className={twMerge(['hover:bg-text-disabled/10','transition-colors'])}>
                                    <td className={twMerge(['px-6','py-4'])}>
                                        <span className={twMerge(
                                            ['rounded-full','px-2','py-1','text-xs','whitespace-nowrap'],
                                            inquiry.isAnswered
                                                ?['bg-success-main/10','text-success-main']
                                                :['bg-text-disabled/30','text-text-disabled']
                                        )}>
                                            {inquiry.isAnswered ? "답변 완료":"답변 대기"}
                                        </span>
                                    </td>
                                    <td className={twMerge(['px-6','py-4'])}>
                                        <Link to={`/inquiries/${inquiry.id}`}>
                                            {inquiry.title}
                                        </Link>
                                    </td>
                                    <td className={twMerge(['px-6','py-4'])}>
                                        {dayjs(inquiry.createdAt).format('YYYY.MM.DD')}
                                    </td>
                                </tr>
                            ))
                        )
                    )}

                    </tbody>
                </table>
            </div>

        </div>
    );
}
export default  InquiryList;