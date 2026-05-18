"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.getSingleLead = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const createLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.create(req.body);
        res.status(201).json({
            message: "Lead created successfully",
            lead,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const { status, source, search, sort = "latest", page = "1", } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (source) {
            query.source = source;
        }
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        const limit = 10;
        const skip = (Number(page) - 1) * limit;
        let sortOption = {};
        if (sort === "latest") {
            sortOption = { createdAt: -1 };
        }
        else {
            sortOption = { createdAt: 1 };
        }
        const leads = await Lead_1.default.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
        const total = await Lead_1.default.countDocuments(query);
        res.status(200).json({
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            leads,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.getLeads = getLeads;
const getSingleLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }
        res.status(200).json(lead);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.getSingleLead = getSingleLead;
const updateLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }
        res.status(200).json({
            message: "Lead updated successfully",
            lead,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }
        res.status(200).json({
            message: "Lead deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.deleteLead = deleteLead;
