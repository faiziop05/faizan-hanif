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
  changePricingTier,    
  getMerchantAuditLogs
} = require("../contollers/MerchantContoller");

const { verifyDocument, uploadDocument } = require("../contollers/DocumentsContoller");


router.post("/", verifyToken, addMerchant);                
router.get("/", verifyToken, getMerchants);                
router.get("/:id", verifyToken, getMerchantById);         
router.patch("/:id", verifyToken, editMerchantDetails);   
router.delete("/:id", verifyToken, deleteMerchant);       

router.patch("/:id/tier", verifyToken, changePricingTier);
router.get("/:id/auditlogs", verifyToken, getMerchantAuditLogs);
router.patch("/:id/status", verifyToken, changeMerchantStatus);

router.patch("/:id/documents/upload", verifyToken, uploadDocument);
router.patch("/:id/documents/verify", verifyToken, verifyDocument);

module.exports = router;