import React from 'react';
import {Box, Paper} from "@mui/material";
import PostDetailHeader from "../../components/posts/PostDetailHeader.jsx";
import PostDetailContent from "../../components/posts/PostDetailContent.jsx";
import PostDetailButtons from "../../components/posts/PostDetailButtons.jsx";
import {useNavigate, useParams} from "react-router";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deletePosts, fetchPostsDetail} from "../../api/postsApi.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import PostComments from "../../components/comments/PostComments.jsx";
import {useMe} from "../../hooks/useMe.js";

/*
    URL에서 id를 읽음 → 서버에서 해당 아이디 데이터 가져옴
    → 화면 출력
    →　삭제 버튼 클릭 시 삭제 API 호출 → 목록으로 이동
    → 수정 버튼 클릭 시 → 수정으로 이동
 */
function PostDetail() {
    const { id } = useParams();
    const postId = Number(id);
    const navigate = useNavigate();     // navigate(-1) 바로 직전 페이지 이동
    const queryClient = useQueryClient();
    const { data:me, isLoading:meIsLoading } = useMe();

    // 이미지 경로 설정
    const apiBase = import.meta.env.VITE_API_BASE_URL;

    // TanStack Query =============================================
    // 상세 글 조회
    const {data: post, isLoading, isError} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostsDetail(postId)
    });

    const checkEdit = (authorId) => {
        return (
            !meIsLoading &&
            me?.id != null &&
            authorId != null &&
            Number(me.id) === Number(authorId)  // 로그인한 아이디 === 작성자 아이디
        )
    }

    // 삭제
    const deleteMutation = useMutation({
        mutationFn: () => deletePosts(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts']});
            navigate('/posts');
        },
        onError: () => {
            alert('삭제에 실패했습니다.')
        }
    });

    if(isLoading) return <Loader />
    if(isError || !post) return <ErrorMessage message="존재하지 않는 게시글입니다."/>

    const loginedEdit = checkEdit(post?.author?.id);

    return (
        <Box>
            <Paper sx={{
                width: '100%',
                borderRadius: 3,
                p: 4,
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0'
            }}>
                {/* 제목, 작성자, 조회수, 작성일, 수정일 ... */}
                <PostDetailHeader post={post} />

                {/* 본문 내용 */}
                <PostDetailContent post={post} apiBase={apiBase}/>

                {/* 댓글 */}
                <PostComments postId={postId} />

                {/* 수정, 삭제 버튼 - 내가 작성한 글에 한해서만 */}
                <PostDetailButtons id={postId} deleteMutation={deleteMutation} loginedEdit={ loginedEdit } />

            </Paper>
        </Box>
    );
}

export default PostDetail;