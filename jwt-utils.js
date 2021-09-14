const jwt = require('jsonwebtoken');
const { TokenExpiredError } = jwt;
const RefreshToken = require('/models/Token');


module.exports = {
    accessTokenSign: (user)=>{
        const payload = {
            id: user.username,
            role: user.isAdmin,
        };
        return jwt.sign(payload, process.env.SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '1h',
        });
    },
    
    verify: (req, res, next)=>{
        const authHeader = req.headers.token;
        if(authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
                if(err) {res.status(403).json('Token is not valid')}
                req.user = user;
                next();
            });
            console.log('Verifying succeed');
        } else {
            res.status(401).json('You are not authenticated');
        }
    },

    refreshTokenSign: ()=>{
        return jwt.sign({}, process.env.SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    },

    refreshVerify: (refreshToken)=>{
        jwt.verify()
    },

    catchError: (err, res)=>{
        if(err instanceof TokenExpiredError) {
            return res.status(401).send({ message: "Unauthorized! Access token was expired" });
        }
        return res.sendStatus(401).send({ message: "Unauthorized!" });
    }   
};