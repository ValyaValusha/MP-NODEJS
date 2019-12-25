"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = __importDefault(require("uuid"));
const Joi = __importStar(require("@hapi/joi"));
const app = express_1.default();
const port = 3000;
const schema = Joi.object().keys({
    login: Joi.string()
        .alphanum()
        .min(6)
        .max(16)
        .required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9]{6,16}$/)
        .min(6)
        .required(),
    age: Joi.number()
        .greater(4)
        .less(130)
        .required()
});
let users = [];
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get('/users', (req, res) => {
    if (req.query.login && req.query.limit) {
        let autoSuggestedUsers = users.filter(item => item.login.includes(req.query.login));
        autoSuggestedUsers.splice(req.query.limit);
        res.json(autoSuggestedUsers);
    }
    else {
        res.json(users);
    }
});
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    for (let user of users) {
        if (user.id === id) {
            res.json(user);
            return;
        }
    }
    res.status(404).send('User not found');
});
app.post('/user', (req, res) => {
    const id = uuid_1.default();
    let user = req.body;
    const { error, value } = schema.validate(user);
    if (error) {
        res.status(400).json({
            status: 'Bad Request',
            message: error.details[0].message,
            data: user
        });
    }
    else {
        user.id = id;
        user.isDeleted = false;
        users.push(user);
        res.send('User is added to the database');
    }
});
app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    let isUserExists = false;
    const { error, value } = schema.validate(newUser);
    if (error) {
        res.status(400).json({
            status: 'Bad Request',
            message: error.details[0].message,
            data: newUser
        });
    }
    else {
        users.forEach((user, index) => {
            if (user.id === id) {
                users[index] = newUser;
                users[index].id = id;
                isUserExists = true;
                res.send('User is edited');
            }
        });
        if (!isUserExists) {
            res.status(404).send('User not found');
        }
    }
});
app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    let isUserExists = false;
    users.forEach((user, index) => {
        if (user.id === id) {
            users[index].isDeleted = true;
            isUserExists = true;
            res.send('User is deleted');
        }
    });
    if (!isUserExists) {
        res.status(404).send('User not found');
    }
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
