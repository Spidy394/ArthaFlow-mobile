import { Router } from "express";
import { 
    addTransaction, 
    deleteTransaction, 
    getTranscationsByUserId, 
    getTranscationsSummaryByUserId 
} from "../controllers/transcationControllers";

const router = Router();

router.get("/:userId", getTranscationsByUserId);
router.post("/", addTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTranscationsSummaryByUserId);

export default router;