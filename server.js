require('dotenv').config()

const express=require ('express')
const app=express()
const jwt=require ('jsonwebtoken')
app.use(express.json())

const bcrypt=require('bcrypt')

const posts=[
    {
        name: 'Ron',
        title: 'Post 1'
    },
    {
        name: 'Jack',
        title: 'Post 2'
    }
]

app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post => post.name === req.user.name));
})

app.post('/posts', async (req,res)=>{
   
   const name = req.body.name
   const user = { name: name }
   const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
   res.json({ accessToken : accessToken}) // creates an access token for the above user (authentication of the user is done in the auth module above)
    
});

function authenticateToken(req,res,next)
{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) 
        return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if (err)
           return res.sendStatus(403)

        req.user = user
        next()
    })
}

app.listen(3000)
