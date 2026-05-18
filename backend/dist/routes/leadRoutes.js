"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, leadController_1.createLead);
router.get("/", authMiddleware_1.protect, leadController_1.getLeads);
router.get("/:id", authMiddleware_1.protect, leadController_1.getSingleLead);
router.put("/:id", authMiddleware_1.protect, leadController_1.updateLead);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)("admin"), leadController_1.deleteLead);
exports.default = router;
