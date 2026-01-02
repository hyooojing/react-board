import {Alert, Box, Button, Divider, IconButton, Paper, Stack, TextField, Tooltip, Typography} from "@mui/material";
import { CiPickerEmpty } from "react-icons/ci";
import { LuSave } from "react-icons/lu";
import { MdOutlineDelete, MdOutlineCancel } from "react-icons/md";
import {FaArrowCircleUp} from "react-icons/fa";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createComment, fetchComments, updateComment, deleteComment} from "../../api/commentApi.js";
import Loader from "../common/Loader.jsx";
import {useState} from "react";
import ErrorMessage from "../common/ErrorMessage.jsx";
import {useMe} from "../../hooks/useMe.js";

function PostComments({postId}) {
    const queryClient = useQueryClient();
    // 댓글 입력
    const [newComment, setNewComment] = useState("");
    // 수정
    const [editComment, setEditComment] = useState();
    const [editId, setEditId] = useState(null); // true면 수정, false면 작성

    const { data:me, isLoading:meIsLoading } = useMe();
    const isMe = !meIsLoading && !!me;

    // Tanstack Query ==============================================
    // 조회
    const { data: comments=[], isLoading: isCommentsLoading, isError: isCommentsError } = useQuery({
        queryKey: ['postComments', postId],
        queryFn: () => fetchComments(postId)
    });

    const checkEdit = (authorId) => {
        return (
            !meIsLoading &&
            me?.id != null &&
            authorId != null &&
            Number(me.id) === Number(authorId)  // 로그인한 아이디 === 작성자 아이디
        )
    }

    // 작성
    const createCommentMutation = useMutation({
        mutationFn: (content) => createComment(postId, { content }),
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 등록에 실패했습니다.');
        }
    });

    // 수정
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, { content }),
        onSuccess: () => {
            setEditId(null);    // 수정 끝났으니까 수정 모드 해제
            setEditComment("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 수정에 실패했습니다.');
        }
    });

    // 삭제
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 삭제에 실패했습니다.');
        }
    });

    // 이벤트 핸들러 ===================================================
    // 작성
    const handleNewComment = (evt) => {
        evt.preventDefault();
        if (!isMe) return;
        if (!newComment.trim()) return;
        createCommentMutation.mutate(newComment.trim());
    }

    // 수정 모드 진입
    const handleStartEdit = ({ author, id, content }) => {
        if(!checkEdit(author?.id)) return;
        // '수정 중' 변경을 위한 변수 업데이트
        setEditId(id);
        // 기존 내용 불려오기
        setEditComment(content);
    }

    // 수정 저장
    const handleSaveEdit = (commentId) => {
        if(!editComment.trim()) return;
        updateCommentMutation.mutate({ commentId, content: editComment.trim() });
    }

    // 수정 취소
    const handleCancelEdit = () => {
        setEditId(null);    // 수정 모드 해제
    }

    // 삭제
    const handleDeleteComment = (commentId) => {
        const comment = comments.find((elem) => elem.id === commentId);

        if (!comment) return;
        if (!checkEdit(comment.author?.id)) {
            alert('본인의 댓글만 삭제할 수 있습니다.');
            return;
        }

        if(!window.confirm('댓글을 삭제하시겠습니까?')) return;
        deleteCommentMutation.mutate(commentId);
    }

    return (
        <Box>
            {/* 댓글 목록 */}
            <Typography variant='h6' fontSize={15}>댓글</Typography>

            { isCommentsLoading && <Loader />}
            { isCommentsError && <ErrorMessage message="댓글을 불러오지 못했습니다" />}

            {/* 댓글 리스트 */}
            {
                !isCommentsLoading && !isCommentsError &&
                comments.map((comment) => {
                    const { id, content, createdAt, author } = comment;

                    // 본인 댓글 여부 확인
                    const loginedEdit = checkEdit(author?.id);

                    return (
                        <Paper key={id} variant='outlined' sx={{p: 2, mb: 1.5}}>
                            {
                                editId === id ? (
                                    <>
                                        {/* 댓글 수정 true */}
                                        <TextField fullWidth
                                                   value={editComment}
                                                   onChange={(evt) => setEditComment(evt.target.value)} />
                                        <Stack direction='row' spacing={0.8} sx={{ mt: 1}} justifyContent="flex-end">
                                            <Tooltip title="저장">
                                                <IconButton size='small' variant='contained' onClick={() => handleSaveEdit(id)}>
                                                    <LuSave size={15}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="취소">
                                                <IconButton size='small' color='inherit' variant='outlined' onClick={handleCancelEdit}>
                                                    <MdOutlineCancel size={15}/>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </>
                                ) : (
                                    <>
                                    {/* 댓글 리스트 false */}
                                        <Typography fontSize={14}>
                                            {content}
                                        </Typography>

                                        <Stack direction="row" justifyContent="space-between" alignItems='flex-end' sx={{ mt:0.5 }}>
                                            <Typography variant='caption' fontSize={11}>
                                                { author?.nickname || '익명' } ー {" "}
                                                {createdAt && new Date(createdAt).toLocaleString()}
                                            </Typography>
                                            {/* 본인 댓글일 때만 버튼 표시 */}
                                            {
                                                loginedEdit && (
                                                    <Stack direction="row">
                                                        <IconButton size='small' onClick={() => handleStartEdit(comment)}><CiPickerEmpty size={15}/></IconButton>
                                                        <IconButton size='small' onClick={() => handleDeleteComment(id)}><MdOutlineDelete size={15}/></IconButton>
                                                    </Stack>
                                                )
                                            }
                                        </Stack>
                                    </>
                                )
                            }
                        </Paper>
                    )
                })
            }

            {/* 댓글 작성 - 로그인한 사람만 */}
            {
                !meIsLoading && !!me ? (
                    <Paper elevation={0} sx={{p: 2, mb: 2, borderRadius: 2}}>
                        <Box component="form" sx={{display: 'flex', gap: 1, alignItems: 'flex-start'}} onSubmit={handleNewComment}>
                            <TextField
                                value={newComment}
                                onChange={(evt) => setNewComment(evt.target.value)}
                                label="댓글 작성"
                                placeholder="댓글을 입력하세요"
                                size="small"
                                fullWidth
                            />

                            <IconButton type="submit" color="primary" sx={{ mt: '4px', color: '#fff' }}>
                                <FaArrowCircleUp size={20} color="#1976d2"/>
                            </IconButton>
                        </Box>
                    </Paper>
                ) : (
                    <Alert severity={"info"} sx={{mb: 2}}>댓글을 작성하려면 로그인을 해 주세요.</Alert>
                )
            }

            {/* 댓글 목록 */}
        </Box>
    );
}

export default PostComments;