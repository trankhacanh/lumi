import jwt from 'jsonwebtoken';
const genToken = async (userId) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return token;
    } catch (error) {
        return resizeBy.status(500).json('gen token error ' + error.message);
    }
}
export default genToken;