const express = require("express");
const app = express();
const path = require('path')
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrls");
const alert = require("alert");

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true, useUnifiedTopology:true
})

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))

app.get("/", async (req,res)=>{
    const shortUrls = await shortUrl.find()
    res.render('index', {shortUrls:shortUrls})
})

app.post("/shortUrls", async (req, res)=>{
    const isPresent = await shortUrl.findOne({full:req.body.fullUrl})
    console.log(isPresent)
    if(!isPresent || isPresent == null ){
        await shortUrl.create({full: req.body.fullUrl})
    }
    else alert("Already Present in Table below")
    res.redirect("/")
})

app.post("/clearall", async(req, res)=>{
    await shortUrl.remove({})
    res.redirect("/")
})

app.get("/:shortUrl", async (req,res)=>{
    
    const shorturl = await shortUrl.findOne({short:req.params.shortUrl})
    if(!shorturl) return res.sendStatus(404)
    shorturl.clicks++   
    shorturl.save()

    res.redirect(shorturl.full)
})

app.post("/delete/:id", async (req,res)=>{
    console.log(req.params.id)
    await shortUrl.deleteOne({short:req.params.id})
    res.redirect("/")

})

app.listen(process.env.PORT, ()=>{
    console.log("App Running on PORT 5000 :)");
})