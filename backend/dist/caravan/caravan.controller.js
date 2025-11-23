"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCaravans = exports.createCaravan = void 0;
const caravan_service_1 = require("./caravan.service");
const caravanService = new caravan_service_1.CaravanService();
const createCaravan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, location, pricePerDay, capacity, hostId } = req.body;
        if (!name || !description || !location || !pricePerDay || !capacity || !hostId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        const newCaravan = yield caravanService.createCaravan({
            name,
            description,
            location,
            pricePerDay,
            capacity,
        }, hostId);
        res.status(201).json(newCaravan);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createCaravan = createCaravan;
const getAllCaravans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCaravans = yield caravanService.getAllCaravans();
        res.status(200).json(allCaravans);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllCaravans = getAllCaravans;
