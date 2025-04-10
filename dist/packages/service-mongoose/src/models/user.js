"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
exports.UserModel = (0, mongoose_1.model)('User', new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
}, {
    timestamps: true,
    versionKey: 'version',
}));
//# sourceMappingURL=user.js.map