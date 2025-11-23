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
exports.CaravanService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CaravanService {
    /**
     * Create a new caravan
     * @param data Caravan data
     * @param hostId The ID of the host user
     */
    createCaravan(data, hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the user is a host
            const host = yield prisma.user.findUnique({
                where: { id: hostId },
            });
            if (!host || host.role !== 'HOST') {
                throw new Error('User is not a host.');
            }
            const caravanData = Object.assign(Object.assign({}, data), { host: {
                    connect: {
                        id: hostId
                    }
                } });
            return prisma.caravan.create({
                data: caravanData,
            });
        });
    }
    /**
     * Get all caravans
     */
    getAllCaravans() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.caravan.findMany();
        });
    }
}
exports.CaravanService = CaravanService;
