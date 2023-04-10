import React from 'react';
import Post from './Post/Post';


const Posts = () => {
    return(
        <Container maxWidth= "lg">
            <AppBar position="static" color="inherit">
                <Typography variant= "h2" align= "center"> Memories</Typography>
                <img src= {memories} alt= "memories" height="60"/>
            </AppBar>
            <Grow in>
                <Container>
                    <Grid container justify="space-between" alignItems = "stretch" spacing = {3}>
                        <Grid items xs = {12} sm={7}>
                            <Posts />
                        </Grid>
                        <Grid items xs = {12} sm={4}>
                            <Form />
                        </Grid>
                    </Grid>
                </Container>
            </Grow>
        </Container>
    )
}
export default Posts;