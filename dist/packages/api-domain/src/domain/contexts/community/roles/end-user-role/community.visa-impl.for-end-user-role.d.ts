import { EndUserRoleCommunityPermissionsSpec } from "./end-user-role-community-permissions";
import { MemberEntityReference } from '../../member/member';
import { EndUserRoleEntityReference } from './end-user-role';
import { CommunityVisa } from "../../community.visa";
export declare class CommunityVisaImplForEndUserRole<root extends EndUserRoleEntityReference> implements CommunityVisa {
    private root;
    private member;
    constructor(root: root, member: MemberEntityReference);
    determineIf(func: ((permissions: EndUserRoleCommunityPermissionsSpec) => boolean)): boolean;
}
