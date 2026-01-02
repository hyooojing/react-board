import React from 'react';
import {
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { Link } from 'react-router';
import dayjs from "dayjs";

function PostTable({ posts }) {
    const lists = posts ?? [];

    return (
        <TableContainer>
            <Table>
                {/* 테이블 머릿말 */}
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: '#fafafa',
                            '& th': {
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#555',
                                borderBottom: '1px solid #eaeaea'
                            }
                        }}
                    >
                        <TableCell align="center" width={80}>번호</TableCell>
                        <TableCell>제목</TableCell>
                        <TableCell align="center" width={140}>작성자</TableCell>
                        <TableCell align="center" width={100}>조회수</TableCell>
                        <TableCell align="center" width={180}>작성일</TableCell>
                    </TableRow>
                </TableHead>

                {/* 테이블 본문 */}
                <TableBody>
                    {lists.map(({ id, title, readCount, createAt, author }) => (
                        <TableRow
                            key={id}
                            hover
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f9fafb'
                                }
                            }}
                        >
                            {/* 번호 */}
                            <TableCell align="center" sx={{ color: '#777' }}>
                                {id}
                            </TableCell>

                            {/* 제목 */}
                            <TableCell>
                                <Typography
                                    component={Link}
                                    to={`/posts/${id}`}
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: '#222',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: '#1976d2'
                                        }
                                    }}
                                >
                                    {title}
                                </Typography>
                            </TableCell>

                            {/* 작성자 */}
                            <TableCell align="center">
                                { author?.nickname && author.nickname !== '작성자' ? (
                                    <Chip
                                        label={author.nickname}
                                        size="small"
                                        sx={{
                                            bgcolor: '#f1f3f5',
                                            color: '#555',
                                            fontSize: 12,
                                            height: 28,
                                            borderRadius: 999
                                        }}
                                    />
                                ) : (
                                    <Typography sx={{ fontSize: 14 }}>{author?.nickname || '??'}</Typography>
                                ) }
                            </TableCell>

                            {/* 조회수 */}
                            <TableCell align="center" sx={{ color: '#666' }}>
                                {readCount}
                            </TableCell>

                            {/* 작성일 */}
                            <TableCell
                                align="center"
                                sx={{
                                    color: '#888',
                                    fontSize: 13
                                }}
                            >
                                {dayjs(createAt).format('YY.MM.DD HH:mm')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;