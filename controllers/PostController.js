import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        // .populate().exec() треба для того, щоб в базі даних правильно відображалася інформацію про юзера, який запостив статтю
        const posts = await PostModel.find().populate("user").exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося отримати статті",
        });
    }
};

export const getOne = async (req, res) => {
    // статтю треба знайти і відразу оновити інфу щодо її переглядів (додати 1). І повернути вже оновлену статтю
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
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
            message: "Не вдалося отримати статті",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({ _id: postId }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Не вдалося видалити статтю",
                });
            }
            // якщо не було помилки, але статті не знайдено
            if (!doc) {
                return res.status(404).json({
                    message: "Статтю не знайдено",
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

export const create = async (req, res) => {
    try {
        // готуємо документ
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            // userId ми з клієнту не передаємо, ми його самі беремо. Він в нас з'являється при авторизації користувача і додається до його запитів нами ж (тобто, його юзер сам не записує, але браузер нам передає на сервер)
            user: req.userId,
        });
        // створюємо документ
        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося створити статтю",
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            }
        );
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося оновити статтю",
        });
    }
};
