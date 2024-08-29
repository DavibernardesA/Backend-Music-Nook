import { Router } from 'express';
import { UserResource } from '../adapters/resources/user';

const userRoutes = Router();

userRoutes.get('/:id?', (req, res) => new UserResource().getUsers(req, res));

export default userRoutes;
