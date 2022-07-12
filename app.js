// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs'); // setting up a view engine to use ejs

app.use(bodyParser.urlencoded({ //
    extended:true
}));
app.use(express.static("public")); //finally we are going to use the public directory to store our static files such as images and  css code


// mongoose.connect("mongodb://localhost:127.0.0.1/wikiDB", {useNewURLParser:true});
mongoose.connect("mongodb://127.0.0.1/wikiDB",{useNewUrlParser: true});


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


// <----------------------REQUEST TARGETTING ALL THE ARTICLES-------------------------->

app.route("/articles")

.get(function(req ,res){
    Article.find(function(req, foundArticles){
        if(!err){
        res.send(foundArticles);
        }
        else{
            res.send(err);
        }

    });
})

.post(function(req,res){
   

    const newArticle = new Article({ 
        title:req.body.title,
        content: req.body.content

    });
    newArticle.save(function(err){
        if(!err){
            res.send("succesfully added a new article");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req ,res){
    Article.deleteMany(function(err){
        if(!err){
            console.log("Successful jalo...");
            res.send("Successfully deleted all articles.");
        }else{
            res.send(err);
        }
    });
});


// <---------------------- REQUEST TARGETTING A SINGLE ARTICLE ------------------------>

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles matching that title were found.");
        }
    });
})

.put(function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
   Article.updateMany(
    {title: req.params.articleTitle},
    {title: req.body.title , content: req.body.content},
    // {overwrite: true},
    function(err){
        if(!err){
            res.send("Successfully uodated article.");
        }else{
            console.log(err);
        }
    }
   );
})

.patch(function(req,res){
    Article.updateMany(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully update article");
            }else{
                res.send(err);
            }
        }
    );
})

.delete(function(req ,res){
    Article.deleteOne({title: req.params.articleTitle} ,function(err){
        if(!err){
            console.log("Successful jalo...");
            res.send("Successfully deleted ONE SPECIFIC article.");
        }else{
            res.send(err);
        }
    });
});


app.listen(3000,function(){
    console.log("server started on port 3000");
});
