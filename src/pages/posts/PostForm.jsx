import {Box, Paper, Stack, Typography} from '@mui/material';
import PostFormFields from "../../components/posts/PostFormFields.jsx";
import PostFormImage from "../../components/posts/PostFormImage.jsx";
import PostFormSubmit from "../../components/posts/PostFormSubmit.jsx";
import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createPosts, updatePosts, fetchPostsDetail} from "../../api/postsApi.js";
import {useNavigate, useParams} from "react-router";
import Loader from "../../components/common/Loader.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import {uploadImage} from "../../api/fileApi.js";

// mode: create → 새 글 작성
// mode: edit → 수정
function PostForm({mode}) {
    const isEdit = mode == 'edit';              // true면 수정, false면 작성
    const queryClient = useQueryClient();               // Query 캐시 무효화
    const navigate = useNavigate();     // 다른 페이지로 이동
    const {id} = useParams();                   // url에서 :id(동적 파라미터) 읽음
    const postId = Number(id);                 // 파라미터는 기본적으로 문자열이므로 숫자 변환

    // 폼 입력 값
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // 이미지
    const [imageName, setImageName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // TanStavk Query =============================================
    // 생성
    const createMutation = useMutation({
        mutationFn: createPosts,        // API 함수 호출
        onSuccess: (create) => {
            queryClient.invalidateQueries({queryKey: ['posts']});
            navigate(`/posts/${create.id}`)
        },
        onError: () => {
            alert('게시글 등록에 실패했습니다.');
        }
    });

    // 수정일 때 기존 데이터 조회
    const {data: post, isLoading, isError} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostsDetail(postId),
        enabled: isEdit     // true일 때만 이 쿼리가 동작, false일 때는 작성이기 때문에 굳이 기존 데이터를 가져올 필요 X
    })

    // 수정
    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(postId, payload),
        onSuccess: (update) => {
            // 목록 캐시 무효화
            queryClient.invalidateQueries({queryKey: ['posts']});
            queryClient.invalidateQueries({queryKey: ['post', postId]});
            navigate(`/posts/${update.id}`)
        },
        onError: () => {
            alert('수정에 실패했습니다.');
        }
    });

    // 이미지 업로드 Mutation
    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            setImageUrl(result.imageUrl);
        },
        onError: () => {
            alert('이미지 업로드에 실패했습니다.');
        }
    });

    // 사이드 이펙트: 렌더링 후 정해진 변수의 상태에 따라 실행
    // useEffect(콜백함수, [변수]);
    // useEffect(() => {}, []); 한 번만 실행
    useEffect(() => {
        if(isEdit && post) {
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.imageUrl || null);
            // setImageName("");
        }
    }, [isEdit, post]); // 수정모드이고 데이터가 바뀌면 실행

    // 이벤트 핸들러 ==================================================
    // 이미지 업로드
    const handleImage = (evt) => {
        // JS File 객체
        const file = evt.target.files?.[0];
        if(!file) return;

        setImageName(file.name);

        if(file.size > 1024 * 1024 * 5) {
            alert('이미지는 5MB 이하만 첨부 가능합니다.');
            evt.target.value="";
            return;
        }

        uploadMutation.mutate(file);

        evt.target.value="";
    }

    // 폼 전송 **
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const payload = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imageUrl || null
        }

        // 필수값 검증
        if( !title.trim() || !content.trim()) {
            alert('제목과 내용은 필수입니다.');
            return;
        }

        // 이미지 업로드 중이면 폼 전송 중지
        if(uploadMutation.isPending) {
            alert('이미지 업로드 중입니다.');
            return;
        }

        // props에 따라 mutation 호출(생성/수정)
        if (isEdit) {
            updateMutation.mutate(payload);     // 수정
        } else {
            createMutation.mutate(payload);     // 작성
        }
        // updateMutation.mutate(payload)
    }
    if(isEdit && isLoading) return <Loader />
    if(isEdit && isError) return <ErrorMessage message='불러오지 못함' />

    return (
        <Box>
            <Paper sx={{
                width: '100%',
                borderRadius: 3,
                p: 4,
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0'
            }}>
                {/* 제목 */}
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 3}}>
                    {isEdit ? '게시글 수정' : '새 글 작성'}
                </Typography>

                <Box component='form' onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        {/* 입력 필드 */}
                        <PostFormFields
                            title={title}
                            content={content}
                            onChangeTitle={setTitle}
                            onChangeContent={setContent}
                        />

                        {/* 이미지 업로드 */}
                        <PostFormImage imageName={imageName}
                                       onChangeImage={handleImage}
                                       uploading={uploadMutation.isPending}
                        />

                        {/* 등록, 수정 버튼 */}
                        <PostFormSubmit isEdit={isEdit}/>
                    </Stack>
                </Box>

            </Paper>
        </Box>
    );
}

export default PostForm;