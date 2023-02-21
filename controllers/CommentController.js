import PostModel from "../models/Post.js";
import Comment from "../models/Comment.js";

export const createComment = (req, res) => {
    const comment = new Comment({
        content: req.body.content,
        user: req.userId,
    });

    comment
        .save()
        .then(() => PostModel.findById(req.params.id))
        .then(post => {
            post.comments.unshift(comment);
            return post.save();
        })
        .then(() =>
            res.json({
                success: true,
            })
        )
        .catch(err => {
            console.log(err);
        });
};

export const removeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const postId = req.params.postId;

        await PostModel.updateOne(
            { _id: postId },
            {
                $pullAll: {
                    comments: [{ _id: commentId }],
                },
            }
        );

        Comment.findOneAndDelete({ _id: commentId }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Не вдалося видалити коментар",
                });
            }
            // якщо не було помилки, але статті не знайдено
            if (!doc) {
                return res.status(404).json({
                    message: "Коментар не знайдено",
                });
            }
            res.json({
                success: true,
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося отримати статті",
        });
    }
};

export const updateComment = (req, res) => {
    const commentId = req.body.commentId;
    const userId = req.body.userId;
    try {
        Comment.findOne({ _id: commentId })
            .then(doc => {
                doc.votes.map(vote => {
                    if (vote.user == userId) {
                        vote["result"] = req.body.vote.result;
                    }
                });
                doc.save();
                res.json({ status: "ok" });
            })
            .catch(err => {
                console.log("Oh! Dark");
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can not update comment",
        });
    }
};

// може тут робити populate
export const addVote = (req, res) => {
    const commentId = req.body.commentId;
    try {
        Comment.findOneAndUpdate(
            {
                _id: commentId,
            },
            {
                $push: {
                    votes: req.body.vote,
                },
            },
            {
                returnDocument: "after",
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не вдалося повернути статтю",
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Статтю не знайдено",
                    });
                }
                res.json(doc);
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can not update comment",
        });
    }
};

// щоб можна було видалити голос при клікі на ThumbUpIcon
export const removeVote = async (req, res) => {
    // console.log(1111111111111111111111);

    try {
        const commentId = req.params.commentId;
        const userId = req.params.userId;
        console.log(commentId);
        console.log(userId);
        await Comment.updateOne(
            { _id: commentId },
            {
                $pull: {
                    votes: { user: userId },
                },
            }
        );
        res.json({ status: "ok" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can not update comment",
        });
    }
};
