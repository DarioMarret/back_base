import jwt from "jsonwebtoken";



export const JwtSingle = async (data, secret) => {
    const token = await jwt.sign(data, secret, { expiresIn: '24h' })
    return token
}

export const JwtVerify = async (token, secret) => {
    const verify = await jwt.verify(token, secret)
    return verify
}