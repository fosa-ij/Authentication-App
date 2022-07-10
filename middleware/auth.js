const jwt = require('jsonwebtoken')
const jwtSecret = 'b1d93640aca66efd3fdb7f7c6e1fa24abad8307abca4298c281f9bca5bda54364ffde9'

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            if (decodedToken.role !== "Admin") {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                next()
            }
        }
      })
    } else {
        return res.status(401).json({ message: "Not authorized, token not available" })
    }
  }

  exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            if (decodedToken.role !== "Basic") {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                next()
            }
        }
      })
    } else {
        return res.status(401).json({ message: "Not authorized, token not available" })
    }
  }