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
exports.EndUserRepository = void 0;
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const api_domain_1 = require("api-domain");
class EndUserRepository extends api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongoRepositoryBase {
    getByExternalId(externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.model.findOne({ externalId: externalId }).exec();
            return this.typeConverter.toDomain(user, this.context);
        });
    }
    getNewInstance(externalId, lastName, restOfName) {
        return __awaiter(this, void 0, void 0, function* () {
            let adapter = this.typeConverter.toAdapter(new this.model());
            return api_domain_1.Domain.Contexts.User.EndUser.EndUser.getNewUser(adapter, externalId, lastName, restOfName, this.context); //no context needed for new user
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteOne({ _id: id }).exec();
        });
    }
}
exports.EndUserRepository = EndUserRepository;
//# sourceMappingURL=end-user.repository.js.map