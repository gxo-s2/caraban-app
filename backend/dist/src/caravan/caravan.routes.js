"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caravan_controller_1 = require("./caravan.controller");
const router = (0, express_1.Router)();
router.post('/', caravan_controller_1.createCaravan);
router.get('/', caravan_controller_1.getAllCaravans);
exports.default = router;
