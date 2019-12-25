import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Request, Response } from 'express';
import uuidv4 from 'uuid';
import * as Joi from '@hapi/joi';

const app = express();
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

type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

let users: Array<User> = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/users', (req: Request, res: Response) => {
  if (req.query.login && req.query.limit) {
    let autoSuggestedUsers = users.filter(item =>
      item.login.includes(req.query.login)
    );
    autoSuggestedUsers.splice(req.query.limit);
    res.json(autoSuggestedUsers);
  } else {
    res.json(users);
  }
});

app.get('/user/:id', (req: Request, res: Response) => {
  const id: string = req.params.id;

  for (let user of users) {
    if (user.id === id) {
      res.json(user);
      return;
    }
  }
  res.status(404).send('User not found');
});

app.post('/user', (req: Request, res: Response) => {
  const id: string = uuidv4();
  let user = req.body as User;

  const { error, value } = schema.validate(user);

  if (error) {
    res.status(400).json({
      status: 'Bad Request',
      message: error.details[0].message,
      data: user
    });
  } else {
    user.id = id;
    user.isDeleted = false;
    users.push(user);
    res.send('User is added to the database');
  }
});

app.put('/user/:id', (req: Request, res: Response) => {
  const id: string = req.params.id;
  const newUser = req.body as User;
  let isUserExists: boolean = false;

  const { error, value } = schema.validate(newUser);
  if (error) {
    res.status(400).json({
      status: 'Bad Request',
      message: error.details[0].message,
      data: newUser
    });
  } else {
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

app.delete('/user/:id', (req: Request, res: Response) => {
  const id: string = req.params.id;
  let isUserExists: boolean = false;

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

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
