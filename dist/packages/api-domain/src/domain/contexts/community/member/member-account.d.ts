import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { CommunityVisa } from "../community.visa";
import { EndUserEntityReference, EndUserProps } from '../../user/end-user/end-user';
export interface MemberAccountProps extends DomainSeedwork.DomainEntityProps {
    firstName: string;
    lastName: string;
    user: EndUserProps;
    setUserRef: (user: EndUserProps) => void;
    statusCode: string;
    createdBy: EndUserProps;
    setCreatedByRef: (createdBy: EndUserProps) => void;
}
export interface MemberAccountEntityReference extends Readonly<Omit<MemberAccountProps, 'user' | 'setUserRef' | 'createdBy' | 'setCreatedByRef'>> {
    readonly user: EndUserEntityReference;
    readonly createdBy: EndUserEntityReference;
}
export declare class MemberAccount extends DomainSeedwork.DomainEntity<MemberAccountProps> implements MemberAccountEntityReference {
    private readonly context;
    private readonly visa;
    constructor(props: MemberAccountProps, context: DomainExecutionContext, visa: CommunityVisa);
    get firstName(): string;
    get lastName(): string;
    get user(): EndUserEntityReference;
    get statusCode(): string;
    get createdBy(): EndUserEntityReference;
    private validateVisa;
    set FirstName(firstName: string);
    set LastName(lastName: string);
    set User(user: EndUserProps);
    set StatusCode(statusCode: string);
    set CreatedBy(createdBy: EndUserProps);
}
