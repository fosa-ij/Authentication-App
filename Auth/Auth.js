const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = 'b1d93640aca66efd3fdb7f7c6e1fa24abad8307abca4298c281f9bca5bda54364ffde9'

exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 6) {
        return res.status(400).json({message: "password less than 6 characters"})
    }
    try{
        bcrypt.hash(password, 10).then(async hash => 
        await User.create({
            username,
            password: hash,
        })).then(user => {
            const maxAge = 3 * 60 * 60
            const token = jwt.sign(
                {
                    id: user._id,
                    username, 
                    role: user.role
                },
                jwtSecret,
                {
                    expiresIn: maxAge // 3hrs
                }
            )
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            })
            res.status(201).json({
                message: "User created",
                user: user._id,
                role: user.role
            })
        })
    } catch(err){
        res.status(401).json({
            message: "User creation not successfull",
            error: err.message
        })
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or password is empty"
        })
    }
    try {
        const user = await User.findOne({username})
        if (!user){
            return res.status(401).json({
                message: "login Unsuccessful",
                error: "user not found"
            })
        }
        bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    const maxAge = 3 * 60 * 60
                    const token = jwt.sign(
                        {
                            id: user._id,
                            username, 
                            role: user.role
                        },
                        jwtSecret,
                        {
                            expiresIn: maxAge
                        }
                    )
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    })
                    res.status(201).json({
                        message: "User successfully logged in",
                        user: user._id,
                        role: user.role
                    })
                } else {
                    res.status(400).json({
                        message: "login failed"
                    })
                }
            })
    }
    catch(err){
        res.status(400).json({
            message: "An error happened? I dunno",
            error: err.message
        })
    }
}

exports.update = async (req, res, next) => {
    const {role, id} = req.body
    if (role && id) {
        if (role === 'Admin') {
            return await User.findById(id)
                .then(user => {
                    if (user.role !== 'Admin'){
                        user.role = role
                        user.save(err => {
                            if (err){
                                res.status(400).json({
                                    message: "An error occured",
                                    error: err.message
                                })
                                process.exit(1)
                            }
                            res.status(200).json({message: "update successful", user})
                        })
                    } else {
                        res.status(400).json({
                            message: "User is already an Admin"
                        })
                    }
                })
                .catch(err => {
                    res.status(400).json({
                        message: 'an error happened',
                        error: err.message
                    })
                })
        }
        return res.status(400).json({
            message: "Role is not Admin",
        })
    }
    res.status(400).json({
        message: "Role or ID is missing"
    })
}

exports.deleteUser = async (req, res, next) => {
    const {id} = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user => res.status(201).json({
            message: "User deleted", user
        }))
        .catch(err => {
            res.status(400).json({
                message: "An error occured",
                error: err.message
            })
        })
}

exports.getUsers = async (req, res, next) => {
    await User.find({})
        .then(users => {
            const userFunction = users.map(user => {
                const container = {}
                container.username = user.username 
                container.role = user.role
                container.id = user._id
                return container
            })
            res.status(200).json({ user: userFunction })
        })
        .catch(err => res.status(401).json({ message: "not successful", error: err.message }))
}