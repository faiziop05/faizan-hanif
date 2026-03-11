const { readData, saveData } = require("../utils/database");

const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    const validDocuments = ["businessRegistration", "ownerId", "bankProof"];
    if (!validDocuments.includes(documentType)) {
      return res.status(400).json({
        message:
          "Invalid document type. Must be businessRegistration, ownerId, or bankProof.",
      });
    }

    const allMerchants = readData("merchants");
    const merchantIndex = allMerchants.findIndex((m) => m.id === id);

    if (merchantIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    allMerchants[merchantIndex].documents[documentType].uploaded = true;

    saveData("merchants", allMerchants);

    return res.status(200).json({
      message: `Document ${documentType} successfully marked as uploaded.`,
      merchant: allMerchants[merchantIndex],
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    const validDocuments = ["businessRegistration", "ownerId", "bankProof"];
    if (!validDocuments.includes(documentType)) {
      return res.status(400).json({
        message: "Invalid document type.",
      });
    }

    const allMerchants = readData("merchants");
    const merchantIndex = allMerchants.findIndex((m) => m.id === id);

    if (merchantIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    let merchant = allMerchants[merchantIndex];

    if (merchant.documents[documentType].uploaded === false) {
      return res.status(400).json({
        message: `Cannot verify ${documentType} because it has not been uploaded yet.`,
      });
    }

    merchant.documents[documentType].verified = true;

    allMerchants[merchantIndex] = merchant;
    saveData("merchants", allMerchants);

    return res.status(200).json({
      message: `Document ${documentType} successfully verified.`,
      merchant: merchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { uploadDocument, verifyDocument };
