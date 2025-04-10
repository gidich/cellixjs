import { VendorUserRoleCommunityPermissionsSpec } from "./vendor-user-role-community-permissions";
import { MemberEntityReference } from '../../member/member';
import { VendorUserRoleEntityReference } from './vendor-user-role';
import { CommunityVisa } from "../../community.visa";
export declare class CommunityVisaImplForVendorUserRole<root extends VendorUserRoleEntityReference> implements CommunityVisa {
    private root;
    private member;
    constructor(root: root, member: MemberEntityReference);
    determineIf(func: ((permissions: VendorUserRoleCommunityPermissionsSpec) => boolean)): boolean;
}
