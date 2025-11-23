"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Load environment variables first
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user/user.controller")); // Import the user controller
const caravan_routes_1 = __importDefault(require("./caravan/caravan.routes")); // Import caravan routes
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json()); // Enable JSON body parsing
app.get('/', (req, res) => {
    res.send('Hello, CaravanShare backend!');
});
// Mount user routes
app.use('/api/users', user_controller_1.default);
// Mount caravan routes
app.use('/api/caravans', caravan_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
