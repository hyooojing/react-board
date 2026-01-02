// header + menu + Outlet
import {Link, Outlet, useNavigate} from 'react-router'
import {useQueryClient} from '@tanstack/react-query'
import {AppBar, Box, Button, Container, Stack, Toolbar, Typography} from '@mui/material'
import {IoLogoOctocat} from "react-icons/io";
import {useMe} from "../hooks/useMe.js";
import {clearAuth} from "../api/authApi.js";

function AppLayout() {
    const queryClient = useQueryClient();
    const { data: me, isLoading: meIsLoading} = useMe();
    const navigate = useNavigate();

    // 로그아웃 이벤트 핸들러
    const handleLogout = () => {
        clearAuth();
        queryClient.setQueryData(["me"], null);     // 즉시 업데이트
        navigate("/posts");
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'rgba(225,246,255,0.52)'}}>
            <AppBar position="fixed">
                <Container maxWidth='md'>
                    <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                        {/* 로고 */}
                        <Box component={Link} to="/posts"
                             sx={{ display: 'flex', alignItems: 'center',  textDecoration: 'none', color: '#fff'}}>
                            {/* font-icon */}
                            <Box
                                sx={{
                                width: 35, height: 35, borderRadius: '50%', // 둥근 모서리
                                bgcolor: '#fff',
                                display: 'grid',    // 바둑판 형태의 레이아웃 스타일
                                placeItems: 'center',    // grid일 때만 적용 가능한 x, y 중앙정렬
                                mr: 1.5
                            }}>
                                <IoLogoOctocat style={{color: '#2b76ff', fontSize: 23}} />
                            </Box>
                            <Typography variant='h6' component="h1" sx={{fontWeight: 700}}>게시판</Typography>
                        </Box>
                        {/* 회원가입/로그인 */}
                        <Stack direction="row" spacing={0.8} alignItems="center">
                            { !meIsLoading && me ? (
                                // 로그아웃
                                <Button variant='text' sx={{color: '#fff'}} onClick={handleLogout}>로그아웃</Button>
                            ) : (
                                <>
                                    <Button component={Link} to="/auth/login" variant='text' sx={{color: '#fff'}}>로그인</Button>
                                    <Button component={Link} to="/auth/register" variant='text' sx={{color: '#fff'}}>회원가입</Button>
                                </>
                            )}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth='md' component="main" sx={{pt: 10, mb: 4}}>
                <Outlet />
            </Container>
        </Box>
    );
}

export default AppLayout;