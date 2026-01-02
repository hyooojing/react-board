import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PostSearch from "../../components/posts/PostSearch.jsx";
import PostTable from "../../components/posts/PostTable.jsx";
import PostPageNation from "../../components/posts/PostPageNation.jsx";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Loader from "../../components/common/Loader.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import { fetchPosts } from "../../api/postsApi.js";
import {useMe} from "../../hooks/useMe.js";

function PostList(props) {
    // 현재 페이지 상태
    const [page, setPage] = useState(0);
    // 키워드 상태
    const [keyword, setKeyword] = useState('');

    // 조회 Query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['posts', page, keyword],
        queryFn: () => fetchPosts({ page, size: 10, keyword }),
        // 페이지 전환 시 기존 데이터 유지, 화면에 빈 화면이 생기지 않음
        placeholderData: keepPreviousData
    });

    const { data:me, isLoading: meIsLoading } = useMe();

    if (isLoading) return <Loader />;
    if (isError) return <ErrorMessage />;

    const { content, totalPages } = data;

    // 이벤트 핸들러 ======================
    // 검색
    const handleSearch = (evt) => {
        evt.preventDefault();
        setPage(0);
    };

    // 페이지 이동
    const handlePrev = () => {
        setPage(prev => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));
    };

    return (
        <Box sx={{ px: { xs: 1.5, sm: 3 }, py: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    p: 4,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                    bgcolor: '#fff'
                }}
            >
                {/* 제목 */}
                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#222',
                        mb: 1.5
                    }}
                >
                    게시글 목록
                </Typography>

                {/* 제목 하단 구분선 */}
                <Box
                    sx={{
                        height: 1,
                        bgcolor: '#eaeaea',
                        mb: 1.2
                    }}
                />

                {/* 검색 영역 */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 2
                    }}
                >
                    <PostSearch
                        keyword={keyword}
                        onSubmit={handleSearch}
                        onChangeKeyword={setKeyword}
                    />
                </Box>

                {/* 테이블 */}
                <Box sx={{ mt: 1.5 }}>
                    <PostTable posts={content} />
                </Box>

                {/* 페이지네이션 */}
                <PostPageNation
                    page={page}
                    totalPages={totalPages}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    logined={ !meIsLoading && !!me }
                />
            </Paper>
        </Box>
    );
}

export default PostList;