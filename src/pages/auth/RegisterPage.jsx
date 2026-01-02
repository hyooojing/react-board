import React, {useState} from 'react';
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import {register} from "../../api/authApi.js";
import {useNavigate} from "react-router";

function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        nickname: "",
        password: "",
        rePassword: ""
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => navigate("/posts")
    });

    // 이벤트 핸들러
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        // 이전 상태 복사 후 변경된 필드만
        setForm((prev) => ({...prev, [name] : value}));
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if(form.password !== form.rePassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        registerMutation.mutate({
            email: form.email.trim(),
            password: form.password.trim(),
            nickname: form.nickname.trim()
        });
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
                        회원가입
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField type="email" label="이메일" size="small" name="email" fullWidth placeholder="test@test.com" required value={form.email} onChange={handleChange} />
                            <TextField type="text" label="별명" size="small" name="nickname" fullWidth placeholder="별명" required value={form.nickname} onChange={handleChange} />
                            <TextField type="password" label="비밀번호" size="small" name="password" fullWidth required value={form.password} onChange={handleChange} />
                            <TextField type="password" label="비밀번호 확인" size="small" name="rePassword" fullWidth required value={form.rePassword} onChange={handleChange}/>

                            {
                                registerMutation.isError && (
                                    <Typography variant="body2" color="error">회원가입에 실패했습니다.</Typography>
                                )
                            }

                            <Button type="submit" variant="contained" sx={{ mt : 1, py: 1.2, borderRadius: 2, textTransform: "none", "&:hover": {backgroundColor: 'rgba(43,118,255,0.68)'}}} disabled={registerMutation.isPending}>
                                {registerMutation.isPaused ? "회원가입 중 ... " : "회원가입"}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>

            </Box>
        </Container>
    );
}

export default RegisterPage;