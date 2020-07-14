const express = require("express");
const posts = require("./data/db");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("req.query", req.query);
  posts
    .find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

// this handles GET /api/posts/:id
router.get("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      console.log("post", post);
      if (post == 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The post information could not be retrieved"
      });
    });
});

router.get("/:id/comments", (req, res) => {
  posts
    .findPostComments(req.params.id)
    .then(post => {
      if (post.length) {
        res.status(201).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

// This handles the route POST /api/posts

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  }

  posts
    .insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

// This handles the route POST /api/posts/:id/comments

router.post("/:id/comments", (req, res) => {
  const { text } = req.body;
  const { id: post_id } = req.params;

  if (!req.body.text) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }

  posts
    .insertComment({ text, post_id })
    .then(comment => {
      console.log("comment", comment);
      if (!comment.id) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        res.status(201).json(comment);
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
    .remove(req.params.id)
    .then(count => {
      if (count > 0) {
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
  if (!req.body.title || !req.body.contents) {
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