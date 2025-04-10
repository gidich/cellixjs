import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityProps, CommunityEntityReference } from '../community/community';
import { MemberAccount, MemberAccountEntityReference, MemberAccountProps } from './member-account';
import { EndUserRoleEntityReference, EndUserRoleProps } from '../roles/end-user-role/end-user-role';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { MemberProfile, MemberProfileEntityReference, MemberProfileProps } from './member-profile';
import { MemberCustomView, MemberCustomViewEntityReference, MemberCustomViewProps } from './member-custom-view';
export interface MemberProps extends DomainSeedwork.DomainEntityProps {
    memberName: string;
    cybersourceCustomerId: string;
    readonly community: CommunityProps;
    setCommunityRef: (community: CommunityEntityReference) => void;
    readonly accounts: DomainSeedwork.PropArray<MemberAccountProps>;
    readonly role: EndUserRoleProps;
    setRoleRef: (role: EndUserRoleEntityReference) => void;
    readonly profile: MemberProfileProps;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
    readonly customViews: DomainSeedwork.PropArray<MemberCustomViewProps>;
}
export interface MemberEntityReference extends Readonly<Omit<MemberProps, 'community' | 'setCommunityRef' | 'accounts' | 'role' | 'setRoleRef' | 'profile' | 'customViews'>> {
    readonly community: CommunityEntityReference;
    readonly accounts: ReadonlyArray<MemberAccountEntityReference>;
    readonly role: EndUserRoleEntityReference;
    readonly profile: MemberProfileEntityReference;
    readonly customViews: ReadonlyArray<MemberCustomViewEntityReference>;
}
export declare class Member<props extends MemberProps> extends DomainSeedwork.AggregateRoot<props> implements MemberEntityReference {
    private readonly context;
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    get id(): any;
    get memberName(): any;
    get cybersourceCustomerId(): any;
    get community(): CommunityEntityReference;
    get accounts(): ReadonlyArray<MemberAccount>;
    get role(): EndUserRoleEntityReference;
    get profile(): MemberProfile;
    get createdAt(): any;
    get updatedAt(): any;
    get schemaVersion(): any;
    get customViews(): ReadonlyArray<MemberCustomView>;
    static getNewInstance<props extends MemberProps>(newProps: props, name: string, community: CommunityEntityReference, context: DomainExecutionContext): Member<props>;
    set MemberName(memberName: string);
    set CyberSourceCustomerId(cybersourceCustomerId: string);
    set Community(community: CommunityEntityReference);
    set Role(role: EndUserRoleEntityReference);
    requestNewAccount(): MemberAccount;
    requestRemoveAccount(accountRef: MemberAccountProps): void;
    requestNewCustomView(): MemberCustomView;
    requestRemoveCustomView(customView: MemberCustomView): void;
}
