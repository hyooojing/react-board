import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import {FaArrowCircleLeft, FaArrowCircleRight} from "react-icons/fa";
import {Link} from 'react-router'

function PostPageNation({ page, totalPages, onPrev, onNext, logined }) {
    return (
        <Stack direction='row' alignItems={'center'}
                              justifyContent={'space-between'} sx={{ mt: 3 }}>
            {/* 페이지네이션 */}
            <Stack direction='row' alignItems='center' spacing={1.8}>
                <Button size='medium' disabled={page === 0} onClick={onPrev}>
                    <FaArrowCircleLeft />
                </Button>
                <Typography>
                    {page + 1} / {totalPages}
                </Typography>
                <Button size='medium' disabled={page + 1 >= totalPages} onClick={onNext}>
                    <FaArrowCircleRight />
                </Button>
            </Stack>

            {/* 새 글 작성 버튼*/}
            {
                logined && (
                    <Button component={Link} to={`/posts/new`} variant='contained' size='small' sx={{borderRadius: '5px', px: 2, fontWeight: 500}}>새 글 작성</Button>
                )
            }
        </Stack>
    );
}

export default PostPageNation;