"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomViewColumnsToDisplay = exports.CustomViewFilters = exports.CustomViewSortOrder = exports.CustomViewType = exports.CustomViewName = exports.CustomViewTypes = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
exports.CustomViewTypes = {
    Property: 'PROPERTY',
    ServiceTicket: 'SERVICE_TICKET',
};
class CustomViewName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.CustomViewName = CustomViewName;
class CustomViewType extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.CustomViewType = CustomViewType;
class CustomViewSortOrder extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.CustomViewSortOrder = CustomViewSortOrder;
class CustomViewFilter extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
class CustomViewFilters extends (0, value_objects_1.VOArray)(CustomViewFilter, { maxLength: 100 }) {
}
exports.CustomViewFilters = CustomViewFilters;
class CustomViewColumnsToDisplay extends (0, value_objects_1.VOArray)(CustomViewFilter, { maxLength: 30 }) {
}
exports.CustomViewColumnsToDisplay = CustomViewColumnsToDisplay;
//# sourceMappingURL=member-custom-view.value-objects.js.map