import express, {Router} from "express";
import {AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword} from "./controller/auth.controller";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {CreateUsers, DeleteUser, GetUser, GetUsers, UpdateUser} from "./controller/user.controller";
import {Permissions} from "./controller/permission.controller";
import {CreateRole, DeleteRole, GetRole, GetRoles, UpdateRole} from "./controller/roles.controller";
import {CreateProduct, DeleteProduct, GetProduct, GetProducts, UpdateProduct} from "./controller/product.controller";
import {Upload} from "./controller/image.controller";
import {Chart, Export, GetOrders} from "./controller/order.controller";
import {PermissionMiddleware} from "./middleware/permission.middleware";

export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/UpdateInfo', AuthMiddleware, UpdateInfo);
    router.put('/api/user/UpdatePassword', AuthMiddleware, UpdatePassword);

    router.get('/api/users', AuthMiddleware, PermissionMiddleware('users'), GetUsers);
    router.post('/api/users', AuthMiddleware, PermissionMiddleware('users'), CreateUsers);
    router.get('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), GetUser);
    router.put('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), UpdateUser);
    router.delete('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), DeleteUser);

    router.get('/api/permissions', AuthMiddleware, Permissions);

    router.get('/api/roles', AuthMiddleware, PermissionMiddleware('roles'), GetRoles);
    router.post('/api/roles', AuthMiddleware, PermissionMiddleware('roles'), CreateRole);
    router.get('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), GetRole);
    router.put('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), UpdateRole);
    router.delete('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), DeleteRole);

    router.get('/api/products', AuthMiddleware, PermissionMiddleware('products'), GetProducts);
    router.post('/api/products', AuthMiddleware,PermissionMiddleware('products'), CreateProduct);
    router.get('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), GetProduct);
    router.put('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), UpdateProduct);
    router.delete('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), DeleteProduct);

    router.post('/api/upload', AuthMiddleware, Upload);
    router.use('/api/uploads', express.static('./uploads'));

    router.get('/api/orders', AuthMiddleware, PermissionMiddleware('orders'), GetOrders);
    router.post('/api/export', AuthMiddleware, PermissionMiddleware('orders'), Export);

    router.get('/api/chart', AuthMiddleware, Chart);

}