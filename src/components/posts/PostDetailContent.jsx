import React from 'react';
import {Box, Divider, Typography} from "@mui/material";

function PostDetailContent({ post, apiBase }) {
    const { content, imageUrl, title } = post;
    const imageSrc = imageUrl ? `${apiBase}${imageUrl}` : null;

    return (
        <>
            { imageSrc && (
                <Box sx={{mb: 1.5}}>
                    <img src={imageSrc} alt={title} style={{ maxWidth: 300, display: 'block'}} />
                </Box>
            )}
            <Typography sx={{ lineHeight: 1.6, p: 3}}>
                {content}
            </Typography>

            <Divider sx={{mb: 2.5}} />
        </>
    );
}

export default PostDetailContent;