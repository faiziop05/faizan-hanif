const { validTiers } = require("../utils/constants");
const { readData, saveData } = require("../utils/database");

const addMerchant = async (req, res) => {
  try {
    const { name, category, city, contactEmail, country } = req.body;

    if (!name || !category || !city || !contactEmail || !country) {
      return res.status(400).json({
        message:
          "Please provide name, category, city, contactEmail and country.",
      });
    }

    const allMerchants = readData("merchants");

    if (allMerchants.some((m) => m.contactEmail === contactEmail)) {
      return res
        .status(400)
        .json({ message: "A merchant with this email already exists." });
    }

    const newMerchant = {
      id: Date.now().toString().concat("mer"),
      name,
      category,
      city,
      country,
      contactEmail,
      status: "Pending KYB",
      pricingTier: "Standard",
      documents: {
        businessRegistration: { uploaded: false, verified: false },
        ownerId: { uploaded: false, verified: false },
        bankProof: { uploaded: false, verified: false },
      },
      createdAt: new Date().toISOString(),
    };

    allMerchants.push(newMerchant);
    saveData("merchants", allMerchants);

    return res.status(201).json({
      message: "Merchant added successfully",
      merchant: newMerchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getMerchantById = async (req, res) => {
  try {
    const { id } = req.params;

    const allMerchants = readData("merchants");
    const merchant = allMerchants.find((m) => m.id === id);

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    return res.status(200).json({
      message: "Merchant retrieved successfully",
      merchant: merchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getMerchants = async (req, res) => {
  try {
    const filters = req.query;
    const allMerchants = readData("merchants");

    const filteredMerchants = allMerchants.filter((merchant) => {
      let isMatch = true;
      if (
        filters.name &&
        merchant.name.toLowerCase() !== filters.name.toLowerCase()
      ) {
        isMatch = false;
      }
      if (filters.category && merchant.category !== filters.category) {
        isMatch = false;
      }
      if (filters.city && merchant.city !== filters.city) {
        isMatch = false;
      }
      if (filters.country && merchant.country !== filters.country) {
        isMatch = false;
      }
      if (
        filters.contactEmail &&
        merchant.contactEmail !== filters.contactEmail
      ) {
        isMatch = false;
      }
      if (filters.status && merchant.status !== filters.status) {
        isMatch = false;
      }
      return isMatch;
    });

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredMerchants.length / limit);

    return res.status(200).json({
      message: "Merchants retrieved successfully",
      count: paginatedMerchants.length,
      totalItems: filteredMerchants.length,
      totalPages: totalPages,
      currentPage: page,
      merchants: paginatedMerchants,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const editMerchantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, city, country, contactEmail } = req.body;

    const allMerchants = readData("merchants");
    const userIndex = allMerchants.findIndex((e) => e.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    let merchant = allMerchants[userIndex];

    if (name) merchant.name = name;
    if (category) merchant.category = category;
    if (city) merchant.city = city;
    if (country) merchant.country = country;
    if (contactEmail) merchant.contactEmail = contactEmail;

    allMerchants[userIndex] = merchant;
    saveData("merchants", allMerchants);

    return res.status(200).json({
      message: "Merchant updated successfully",
      merchant: merchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteMerchant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message:
          "Access denied. Only admin-level operators can delete merchants.",
      });
    }

    const { id } = req.params;
    const allMerchants = readData("merchants");

    const merchantIndex = allMerchants.findIndex((m) => m.id === id);
    if (merchantIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    allMerchants.splice(merchantIndex, 1);
    saveData("merchants", allMerchants);

    return res.status(200).json({ message: "Merchant deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const changeMerchantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const validStatuses = ["Pending KYB", "Active", "Suspended"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be 'Pending KYB', 'Active', or 'Suspended'.",
      });
    }

    const allMerchants = readData("merchants");
    const merchantIndex = allMerchants.findIndex((m) => m.id === id);

    if (merchantIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    let merchant = allMerchants[merchantIndex];
    const currentStatus = merchant.status;

    if (currentStatus === newStatus) {
      return res.status(400).json({
        message: `Merchant is already marked as ${currentStatus}.`,
      });
    }
    if (newStatus === "Active") {
      const docs = merchant.documents;
      if (
        !docs.businessRegistration.verified ||
        !docs.ownerId.verified ||
        !docs.bankProof.verified
      ) {
        return res.status(400).json({
          message:
            "Cannot approve merchant. All three documents (Business Registration, Owner ID, Bank Proof) must be uploaded and verified first.",
        });
      }
    }

    if (currentStatus === "Suspended" && newStatus === "Pending KYB") {
      return res.status(400).json({
        message:
          "Invalid status change. A suspended account cannot be moved back to Pending KYB.",
      });
    }

    if (currentStatus === "Active" && newStatus === "Pending KYB") {
      return res.status(400).json({
        message:
          "Invalid status change. An active account cannot be downgraded to Pending KYB. Suspend the account instead.",
      });
    }

    merchant.status = newStatus;
    allMerchants[merchantIndex] = merchant;
    saveData("merchants", allMerchants);

    const allAuditLogs = readData("auditLogs") || []; 

    const newLog = {
      logId: Date.now().toString().concat("log"),
      merchantId: merchant.id,
      operatorEmail: req.user.email,
      oldStatus: currentStatus,
      newStatus: newStatus,
      timestamp: new Date().toISOString()
    };

    allAuditLogs.push(newLog);
    saveData("auditLogs", allAuditLogs);

    return res.status(200).json({
      message: `Merchant status successfully changed from ${currentStatus} to ${newStatus}.`,
      merchant: merchant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const changePricingTier = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message:
          "Access denied. Only admin-level operators can change pricing tiers.",
      });
    }

    const { id } = req.params;
    const { newTier } = req.body;

    if (!newTier) {
      return res.status(400).json({ message: "Please provide a newTier." });
    }

    if (!validTiers.includes(newTier)) {
      return res.status(400).json({
        message:
          "Invalid pricing tier. Must be 'Starter', 'Pro', or 'Enterprise'.",
      });
    }

    const allMerchants = readData("merchants");
    const merchantIndex = allMerchants.findIndex((m) => m.id === id);

    if (merchantIndex === -1) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    allMerchants[merchantIndex].pricingTier = newTier;
    saveData("merchants", allMerchants);

    return res.status(200).json({
      message: `Pricing tier successfully updated to ${newTier}.`,
      merchant: allMerchants[merchantIndex],
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};


const getMerchantAuditLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const allMerchants = readData("merchants");
    const merchantExists = allMerchants.some((m) => m.id === id);
    if (!merchantExists) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    const allAuditLogs = readData("auditlogs") || [];
    
    const merchantLogs = allAuditLogs.filter((log) => log.merchantId === id);

    merchantLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedLogs = merchantLogs.slice(startIndex, endIndex);

    const totalPages = Math.ceil(merchantLogs.length / limit);

    return res.status(200).json({
      message: "Audit logs retrieved successfully",
      count: paginatedLogs.length,        
      totalItems: merchantLogs.length,    
      totalPages: totalPages,             
      currentPage: page,                  
      logs: paginatedLogs                
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addMerchant,
  getMerchants,
  getMerchantById,
  editMerchantDetails,
  changeMerchantStatus,
  deleteMerchant,
  changePricingTier,
  getMerchantAuditLogs
};
