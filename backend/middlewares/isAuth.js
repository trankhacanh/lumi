import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        const token = req.cookies.token; // lấy từ cookie
        if (!token) {
            return res.status(401).json({ message: "Token is not found" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // gắn userId vào req để controller dùng
        req.userId = decoded.id; // phải trùng key khi bạn sign token

        next();
    } catch (error) {
        return res.status(401).json({ message: `Unauthorized: ${error.message}` });
    }
};

export default isAuth;
