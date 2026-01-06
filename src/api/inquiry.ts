import { api } from "./axios.ts";

export interface Inquiry{
    id: number;
    title: string;
    content: string;
    answer?: string;
    isAnswered: boolean;
    answeredAt?: string;
    createdAt: string;
    author:{
        id: number;
        nickname: string;
        email?: string;
        profileImage?: string;
    }
}
interface InquiryListResponse{
    inquiries: Inquiry[];
    total: number;
    page: number;
    totalPages: number;
}
// 1:1 문의사항 목록을 출력해주기 위해서는
// 사용자가 보고 있는 페이지 수와 한 페이지에 출력하는 게시글 수를 같이 적어서 전달해야 하는데
// 방식이 GET임. GET은 주소에 파라메터를 적어줘야 함. => queryString 이와같이 전달해도 되지만
// api.get(주소,옵션) 옵션자리에 {params:{page,limit}}를 넣어도 자동으로 쿼리 스트링을 붙여줌
export const fetchInquires = async (page = 1, limit = 10) => {
    //const response = await api.get(`/inquiries?page=${page}&limit=${limit}`);
    const response = await api.get<InquiryListResponse>(`/inquiries`,{
        params:{page,limit}
    });
    return response.data;
};

//문의사항 등록 API
export const createInquiry = async (title: string,content:string) => {
    const response =await api.post<Inquiry>("/inquiries", {title,content});
    return response.data;
}

// 문의사항 상세 조회 API
export const fetchInquiry = async (inquiryId: number) => {
    const response = await api.get<Inquiry>(`/inquiries/${inquiryId}`);
    return response.data;
};

//문의사항 삭제 API
export const deleteInquiry = async (inquiryId: number) => {
    const response = await api.delete(`/inquiries/${inquiryId}`);
    return response.data;
}

//문의사항 답변 삭제 API
export const deleteInquiryAnswers=async (inquiryId: number)=>{
    const response =await api.delete(`/inquiries/${inquiryId}/answer`);
    return response.data;
}

//문의사항 수정API
export const updateInquiry = async (inquiryId: number,data:{title:string;content:string;}) => {
    const response =await api.patch<Inquiry>(`/inquiries/${inquiryId}`, data);
    return response.data;
}