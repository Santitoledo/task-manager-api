import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser} from "../controllers/users.controller";
import {apiKey} from "../middlewares/apiKey.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.use(apiKey);

router.get("/", authMiddleware, getUsers);

router.get("/:id", authMiddleware, getUserById);

router.post("/", createUser);
 
router.put("/:id",authMiddleware, updateUser);

router.delete("/:id",authMiddleware, deleteUser);


export default router;