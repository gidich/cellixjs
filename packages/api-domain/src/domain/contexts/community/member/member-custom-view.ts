import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { CommunityVisa } from "../community.visa";
import * as ValueObjects from './member-custom-view.value-objects';

export interface MemberCustomViewProps extends DomainSeedwork.DomainEntityProps {
  name: string;
  type: string;
  filters: string[];
  sortOrder: string;
  columnsToDisplay: string[];
}

export interface MemberCustomViewEntityReference extends Readonly<MemberCustomViewProps> {}

export class MemberCustomView extends DomainSeedwork.DomainEntity<MemberCustomViewProps> implements MemberCustomViewEntityReference {
  constructor(props: MemberCustomViewProps, private readonly context: DomainExecutionContext, private readonly visa: CommunityVisa) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }
  get type(): string {
    return this.props.type;
  }
  get filters(): string[] {
    return this.props.filters;
  }
  get sortOrder(): string {
    return this.props.sortOrder;
  }
  get columnsToDisplay(): string[] {
    return this.props.columnsToDisplay;
  }

  private validateVisa() {
    if (
      !this.visa.determineIf(
        (permissions) => permissions.isSystemAccount || permissions.canManageMembers || (permissions.canEditOwnMemberAccounts && permissions.isEditingOwnMemberAccount)
      )
    ) {
      throw new Error('You do not have permission to update this account');
    }
  }

  // implementing setters  from TS 5.1
  set Name(name: string) {
    this.validateVisa();
    this.props.name = new ValueObjects.CustomViewName(name).valueOf();
  }

  set Type(type: string) {
    this.validateVisa();
    this.props.type = new ValueObjects.CustomViewType(type).valueOf();
  }

  set Order(sortOrder: string) {
    this.validateVisa();
    this.props.sortOrder = new ValueObjects.CustomViewSortOrder(sortOrder).valueOf();
  }

  set Filters(filters: string[]) {
    this.validateVisa();
    this.props.filters = new ValueObjects.CustomViewFilters(filters).valueOf();
  }

  set ColumnsToDisplay(columnsToDisplay: string[]) {
    this.validateVisa();
    this.props.columnsToDisplay = new ValueObjects.CustomViewColumnsToDisplay(columnsToDisplay).valueOf();
  }
}
