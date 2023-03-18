import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    const { page, limit, search = "", sort = "all" } = req.query;
    const regex = new RegExp(search, "i"); // i for case insensitive
    try {
        // .populate().exec() треба для того, щоб в базі даних правильно відображалася інформацію про юзера, який запостив статтю
        const t = sort === "date" ? { createdAt: -1 } : { viewsCount: -1 };

        const posts = await PostModel.find({ title: { $regex: regex } })
            .sort(sort !== "all" ? t : { createdAt: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate(["user", "comments"])
            .exec();

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
        const { views } = req.query;
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: views === "1" ? 1 : 0 },
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
        ).populate(["user", { path: "comments", populate: { path: "user" } }]);
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
            ingredients: req.body.ingredients,
            energy: req.body.energy,
            cookTime: req.body.cookTime,
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
                ingredients: req.body.ingredients,
                energy: req.body.energy,
                cookTime: req.body.cookTime,
                user: req.userId,
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
