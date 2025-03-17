import { VOString, VOArray } from '@lucaspaganini/value-objects';

export const CustomViewTypes = {
  Property: 'PROPERTY',
  ServiceTicket: 'SERVICE_TICKET',
};

export class CustomViewName extends VOString({ trim: true, maxLength: 500 }) {}
export class CustomViewType extends VOString({ trim: true, maxLength: 500 }) {}
export class CustomViewSortOrder extends VOString({ trim: true, maxLength: 500 }) {}
class CustomViewFilter extends VOString({ trim: true, maxLength: 500 }) {}
export class CustomViewFilters extends VOArray(CustomViewFilter, { maxLength: 100 }) {}
export class CustomViewColumnsToDisplay extends VOArray(CustomViewFilter, { maxLength: 30 }) {}
