import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { CommunityVisa } from "../community.visa";
export interface MemberCustomViewProps extends DomainSeedwork.DomainEntityProps {
    name: string;
    type: string;
    filters: string[];
    sortOrder: string;
    columnsToDisplay: string[];
}
export interface MemberCustomViewEntityReference extends Readonly<MemberCustomViewProps> {
}
export declare class MemberCustomView extends DomainSeedwork.DomainEntity<MemberCustomViewProps> implements MemberCustomViewEntityReference {
    private readonly context;
    private readonly visa;
    constructor(props: MemberCustomViewProps, context: DomainExecutionContext, visa: CommunityVisa);
    get name(): string;
    get type(): string;
    get filters(): string[];
    get sortOrder(): string;
    get columnsToDisplay(): string[];
    private validateVisa;
    set Name(name: string);
    set Type(type: string);
    set Order(sortOrder: string);
    set Filters(filters: string[]);
    set ColumnsToDisplay(columnsToDisplay: string[]);
}
