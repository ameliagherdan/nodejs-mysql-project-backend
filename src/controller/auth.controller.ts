import {Request, Response} from "express";
import {RegisterValidation} from "../validation/register.validation";
import {getManager, getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import bcrypt from "bcryptjs";
import {sign, verify} from "jsonwebtoken";


export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    const {error} = RegisterValidation.validate(body);

    if (error) {
        return res.status(400).send(error.details)
    }

    if (body.password !== body.confirm_password) {
        return res.status(400).send({
            message: "Password must be equal with confirm_password"
        })
    }

    const repository = getManager().getRepository(User);

    const {password, ...user} = await repository.save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        secret_question: body.secret_question,
        secret_answer: body.secret_answer,
        password: await bcrypt.hash(body.password, 10)
    })

    res.send(user);
}

export const Login = async (req: Request, res: Response) => {
    const body = req.body;
    const repository = getManager().getRepository(User);

    const user = await repository.findOne({email: body.email});

    if (!user) {
        return res.status(400).send({message: "invalid credentials"});
    }

    if (!await bcrypt.compare(body.password, user.password)) {
        return res.status(400).send({message: "invalid credentials"});
    }

    const token = sign({
        id: user.id
    }, "" + process.env.SECRET_KEY);

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    const {password, id, first_name, last_name, ...data} = user;

    res.send({
        message: "Success!"
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const {password, ...user} = req['user'];
    return res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: "Success!"
    });
}

export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req['user'];

    const repository = getManager().getRepository(User);

    await repository.update(user.id, req.body);

    const {password, ...data} = await repository.findOne(user.id);

    res.send(data);
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req['user'];

    const repository = getManager().getRepository(User);

    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).send({
            message: "Password must be equal with confirm_password"
        })
    }

    await repository.update(user.id, {
        password: await bcrypt.hash(req.body.password, 10)
    });

    const {password, ...data} = user;

    res.send(data);
}