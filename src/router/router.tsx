import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../Pages/Home.tsx";
import SignIn from "../Pages/(auth)/SignIn.tsx";
import SignUp from "../Pages/(auth)/SignUp.tsx";
import ProfileEdit from "../Pages/ProfileEdit.tsx";
import VideoUpload from "../Pages/videos/VideoUpload.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element :<Layout/>,
        children:[
            {path: "",element:<Home/>},
            {path: "sign-in",element:<SignIn/>},
            {path: "sign-up",element:<SignUp/>},
            {path: "profile/edit",element:<ProfileEdit/>},
            {path:"videos",children:[
                    {path:"upload",element:<VideoUpload/>}
                ]}
        ]
    },
]);

export default router;
