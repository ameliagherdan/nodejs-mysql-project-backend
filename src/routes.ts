import {Router} from "express";
import {AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword} from "./controller/auth.controller";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {CreateUsers, DeleteUser, GetUser, GetUsers, UpdateUser} from "./controller/user.controller";


export const routes = ( router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/UpdateInfo', AuthMiddleware, UpdateInfo);
    router.put('/api/user/UpdatePassword', AuthMiddleware, UpdatePassword);

    router.get('/api/users', AuthMiddleware, GetUsers);
    router.post('/api/users', AuthMiddleware, CreateUsers);
    router.get('/api/users/:id', AuthMiddleware, GetUser);
    router.put('/api/users/:id', AuthMiddleware, UpdateUser);
    router.delete('/api/users/:id', AuthMiddleware, DeleteUser);
};
