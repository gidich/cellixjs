import { MemberEntityReference } from './member';
import { CommunityVisa, CommunityPermissionsSpec } from '../community.visa';
export declare class CommunityVisaImplForMember<root extends MemberEntityReference> implements CommunityVisa {
    private root;
    private member;
    constructor(root: root, member: MemberEntityReference);
    determineIf(func: ((permissions: CommunityPermissionsSpec) => boolean)): boolean;
}
