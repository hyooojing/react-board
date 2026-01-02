import {createBrowserRouter, Navigate} from "react-router";
import AppLayout from "../layouts/AppLayout.jsx";
import PostList from "../pages/posts/PostList.jsx";
import PostForm from "../pages/posts/PostForm.jsx";
import PostDetail from "../pages/posts/PostDetail.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                // 가장 처음으로 보여질 자식 컴포넌트
                index: true,
                // 리다이렉트 컴포넌트, ./ 접근하면 /posts로 자동 이동
                element: <Navigate to="posts" replace />
            },
            {
                path: 'posts',
                element: <PostList />
            },
            {
                // 게시글 작성
                path: 'posts/new',
                element: <PostForm mode="create" />
            },
            {
                // 게시글 상세
                path: 'posts/:id',  // id 동적 파라미터 -> useParam()을 통해 id 값을 가져옴
                element: <PostDetail />
            },
            {
                // 게시글 수정
                path: 'posts/:id/edit',
                element: <PostForm mode="edit" />
            },
            {
                // 로그인
                path: 'auth/login',
                element: <LoginPage />
            },
            {
                // 회원가입
                path: 'auth/register',
                element: <RegisterPage />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);