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
exports.CommunityRepository = void 0;
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const api_domain_1 = require("api-domain");
class CommunityRepository extends api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongoRepositoryBase {
    getByIdWithCreatedBy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoCommunity = yield this.model.findById(id).populate('createdBy').exec();
            return this.typeConverter.toDomain(mongoCommunity, this.context);
        });
    }
    getNewInstance(name, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let adapter = this.typeConverter.toAdapter(new this.model());
            return api_domain_1.Domain.Contexts.Community.Community.Community.getNewInstance(adapter, name, user, this.context);
        });
    }
}
exports.CommunityRepository = CommunityRepository;
//# sourceMappingURL=community.repository.js.map