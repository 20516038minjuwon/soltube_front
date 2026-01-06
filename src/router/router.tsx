import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../Pages/Home.tsx";
import SignIn from "../Pages/(auth)/SignIn.tsx";
import SignUp from "../Pages/(auth)/SignUp.tsx";
import ProfileEdit from "../Pages/users/ProfileEdit.tsx";
import VideoUpload from "../Pages/videos/VideoUpload.tsx";
import VideoDetail from "../Pages/videos/VideoDetail.tsx";
import NoticeList from "../Pages/notices/NoticeList.tsx";
import NoticeCreate from "../Pages/notices/NoticeCreate.tsx";
import NoticeDetail from "../Pages/notices/NoticeDetail.tsx";
import NoticeEdit from "../Pages/notices/NoticeEdit.tsx";
import InquiryList from "../Pages/inquiries/InquiryList.tsx";
import InquiryCreate from "../Pages/inquiries/InquiryCreate.tsx";
import InquiryDetail from "../Pages/inquiries/InquiryDetail.tsx";
import InquiryEdit from "../Pages/inquiries/InquiryEdit.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "sign-in", element: <SignIn /> },
            { path: "sign-up", element: <SignUp /> },
            { path: "users", children: [{ path: "edit", element: <ProfileEdit /> }] },

            //    경로 : /videos/upload > Upload
            //          /videos/:id    > Detail
            {
                path: "video",
                children: [
                    { path: "upload", element: <VideoUpload /> },
                    { path: ":id", element: <VideoDetail /> },
                ],
            },
            //      경로 : /notices       > NoticeList
            //             /notices/create  > NoticeCreate
            //             /notices/:id    > NoticeDetail
            //             /notices/:id/edit   > NoticeEdit
            {
                path: "notices",
                children: [
                    { index: true, element: <NoticeList /> },
                    { path: "create", element: <NoticeCreate /> },
                    { path: ":id", element: <NoticeDetail /> },
                    { path: ":id/edit", element: <NoticeEdit /> },
                ],
            },
            {
                path:"inquiries",
                children:[
                    {index: true,element:<InquiryList/>},
                    { path: "create", element: <InquiryCreate /> },
                    { path: ":id", element: <InquiryDetail /> },
                    { path: ":id/edit", element: <InquiryEdit/> },
                ]
            },
        ],
    },
]);

export default router;
