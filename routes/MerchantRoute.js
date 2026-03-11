const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewhere/authMiddleware"); 
const { 
  addMerchant, 
  getMerchantById, 
  getMerchants, 
  editMerchantDetails, 
  changeMerchantStatus, 
  deleteMerchant,
  changePricingTier    
} = require("../contollers/MerchantContoller");

const { verifyDocument, uploadDocument } = require("../contollers/DocumentsContoller");

router.post("/api/merchants", verifyToken, addMerchant);

router.get("/api/merchants", verifyToken, getMerchants);
router.get("/api/merchants/:id", verifyToken, getMerchantById);

router.patch("/api/merchants/:id", verifyToken, editMerchantDetails);

router.delete("/api/merchants/:id", verifyToken, deleteMerchant);

router.patch("/api/merchants/:id/tier", verifyToken, changePricingTier);


router.patch("/api/merchants/:id/documents/upload", verifyToken, uploadDocument);
router.patch("/api/merchants/:id/documents/verify", verifyToken, verifyDocument);
router.patch("/api/merchants/:id/status", verifyToken, changeMerchantStatus);

module.exports = router;