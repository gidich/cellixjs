import { CommunityEntityReference } from './community';
import { MemberEntityReference } from '../member/member';
import { CommunityVisa, CommunityPermissionsSpec } from "../community.visa";
import { StaffUserEntityReference } from '../../user/staff-user/staff-user';
import { EndUserEntityReference } from '../../user/end-user/end-user';
export declare class CommunityVisaImplForCommunity<root extends CommunityEntityReference> implements CommunityVisa {
    private root;
    private member;
    private user;
    constructor(root: root, member: MemberEntityReference, user: StaffUserEntityReference | EndUserEntityReference);
    determineIf(func: ((permissions: CommunityPermissionsSpec) => boolean)): boolean;
}
