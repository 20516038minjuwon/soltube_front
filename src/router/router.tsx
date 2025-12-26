import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../Pages/Home.tsx";
import SignIn from "../Pages/(auth)/SignIn.tsx";
import SignUp from "../Pages/(auth)/SignUp.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element :<Layout/>,
        children:[
            {path: "",element:<Home/>},
            {path: "sign-in",element:<SignIn/>},
            {path: "sign-up",element:<SignUp/>}
        ]
    },
]);

export default router;
