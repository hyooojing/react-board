import React from 'react';
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login, setAuth} from "../../api/authApi.js";

function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            setAuth(data);      // localStorage 저장
            queryClient.invalidateQueries({ queryKey: ["me"] });
            navigate("/posts");
        }
    });

    // 이벤트 핸들러
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const fd = new FormData(evt.currentTarget);
        loginMutation.mutate({
            email: String(fd.get("email")).trim(),
            password: String(fd.get("password"))
        })
    }

    return (
        <Container maxWidth="sm">
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
                        로그인
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField type="email" label="이메일" size="small" name="email" fullWidth placeholder="test@test.com" required />
                            <TextField type="password" label="비밀번호" size="small" name="password" fullWidth required />

                            {
                                loginMutation.isError && (
                                    <Typography variant="body2" color="error">로그인에 실패했습니다.</Typography>
                                )
                            }

                            <Button type="submit" variant="contained" fullWidth sx={{ mt : 1, py: 1.2, borderRadius: 2, textTransform: "none", "&:hover": {backgroundColor: 'rgba(43,118,255,0.68)'}}} disabled={loginMutation.isPending}>
                                {loginMutation.isPending ? "로그인 중... " : "로그인"}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;