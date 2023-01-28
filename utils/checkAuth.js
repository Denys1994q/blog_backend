import jwt from "jsonwebtoken";

// вирішує чи можна надавати якусь інформацію чи ні (на основі токену)
export default (req, res, next) => {
    // надсилаємо в запиті через хедери свій токен як клієнта, забираємо з нього слово Bearer
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    // якщо токен є, розшифровуємо його
    if (token) {
        try {
            const decoded = jwt.verify(token, "secret123");
            // зберіг _id з токена (бо ми передавали саме _id в токен) в req.userId
            req.userId = decoded._id;
            next()
        } catch (err) {
            // статус 403 - немає доступу 
            return res.status(403).json({
                message: "Немає доступу",
            });
        }
    } else {
        return res.status(403).json({
            message: "Немає доступу",
        });
    }
};
