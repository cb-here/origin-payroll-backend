import express from "express";
import {
  getDashboardStats,
  savePaymentBatch,
  getPaymentBatches,
  getPaymentBatchById,
  deletePaymentBatch,
  getBatchProviders,
  sendPaymentEmails,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);
router.post("/batch", protect, savePaymentBatch);
router.get("/batches", protect, getPaymentBatches);
router.get("/batch/:id", protect, getPaymentBatchById);
router.get("/batch/:id/providers", protect, getBatchProviders);
router.delete("/batch/:id", protect, deletePaymentBatch);
router.post("/send-emails", protect, sendPaymentEmails);

export default router;
