const exp=require('express')
const app=exp()
const cors=require('cors')
app.use(cors({
    origin:['http://localhost:5173','http://localhost:5174']
}))
require('dotenv').config()

const {MongoClient}=require('mongodb')
let mClient=new MongoClient(process.env.DB_URL)

mClient.connect()
.then((connectionObj)=>{
    const fsddb=connectionObj.db('residence-finder')
    const registrationsCollection=fsddb.collection('registrations')
    const housesCollection=fsddb.collection('houses')
    const wishlistCollection=fsddb.collection('wishlist')
    app.set('registrationsCollection',registrationsCollection)
    app.set('housesCollection',housesCollection)
    app.set('wishlistCollection',wishlistCollection)

    console.log('DB connection successful')
    app.listen(process.env.PORT,()=>console.log('http server started on port 4000'))
})
.catch(err=>console.log("Error in DB connection",err))

const registrationsApp=require('./APIs/registrationsApi')
const housesApp=require('./APIs/housesApi')
const wishlistApp=require('./APIs/wishlistApi')

app.use('/registrations-api',registrationsApp)
app.use('/houses-api',housesApp)
app.use('/wishlist-api',wishlistApp)

app.use('*',(req,res,next)=>{
    res.send({message:`Invalid path`})
})

app.use((err,req,res,next)=>{
    res.send({message:"error occurred",errorMessage:err.message})
})