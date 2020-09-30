// a const express = require('express')

// a  const router = express.Router()

const router = require("express").Router();
const posts = require("../data/db");

//d -- get posts

router.get("/", (req, res) => {
  posts
    .find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

//d -- get post by id

router.get("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      // post ? res.status(200).json(post) : res.status(404).json({message: 'The post could not be found with that id'})
      if (post == 0) {
        res.status(404).json({ message: "The post could not be found" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

//d -- get post comments by id
router.get("/:id/comments", (req, res) => 
{
    posts
    .findPostComments(req.params.id)
    .then(post =>{
        post ? res.status(200).json(post) : res.status(404).json({ message: "The post with this ID does not exist"})
    })
    .catch(err =>{
    res.status(500).json({
        message: "The comments information could not be retrieved"
            })
    })
})



//d -- post _posts_
router.post("/", (req, res) =>{

    if (!req.body.title || !req.body.contents){
        return res.status(400).json({ message: "Please provide title and content for the post"})
    }

    posts
    .insert(req.body)
    .then(post =>{
        res.status(201).json(post);
    })
    .catch(err =>{
        res.status(500).json({ message: "There was an error while saving the post to the database"})
    })
})


//d --post post comments
router.post("/:id/comments", (req, res) =>{
    const { text } = req.body; //If you look in the seeds, you will see that the comments have a text. You will get this from the request body.
    const { id: post_id } = req.params // this time, you are needing to use the post_id for you id. Remember, ids will come from the parameter

    if (!text){
        return res.status(400).json({ message: "Please profide text for the comment."})
    } // This is here to check if there is text in the comment

        posts
          .insertComment({ text, post_id }) //so we found that the inserComment promise will work best for what we want to do here.
          .then(comment => {
            console.log("comment", comment);
            if (!comment.id) {
              res.status(404).json({
                message: "The post with the specified ID does not exist."
              }); //here you are checking to see if the id is being specified. notice you need to pass /:id in the route. 
            } else {
              res.status(201).json(comment); // give us back the comment!!!
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({
              message: "There was an error while saving the comment to the database"
            });
          });
      });
      
      // handles the route DELETE /api/posts/:id
      
router.delete("/:id", (req, res) => {
        posts
          .remove(req.params.id) //Never forget! If you want to access the id, you will find it in params. you are wanting to make sure you are deleting something by it's ID, else you delete EVERYTHING.... The horror!!! 
          .then(post => {
            if (post > 0) { // this is literally saying if there is even a post, then you can delete it.. You don't want to try and delete something that isn't there
              res.status(200).json({
                message: "The post has been deleted"
              });
            } else {
              res.status(404).json({
                message: "The post with the specified ID does not exist"
              });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({
              error: "The post could not be removed"
            });
          });
      });
      
 router.put("/:id", (req, res) => {
        if (!req.body.title || !req.body.contents) { //again, checking to see if the client is putting in the title and contents 
          return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        }
      
        posts
          .update(req.params.id, req.body)
          .then(post => {
            if (post) {
              res.status(200).json(post);
            } else {
              res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({
              error: "The post information could not be modified."
            });
          });
      });

module.exports = router;
