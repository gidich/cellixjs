import { StaffRoleCommunityPermissionsSpec } from "./staff-role-community-permissions";
import { StaffRoleEntityReference } from './staff-role';
import { CommunityVisa } from "../../community.visa";
import { StaffUserEntityReference } from "../../../user/staff-user/staff-user";
export declare class CommunityVisaImplForStaffRole<root extends StaffRoleEntityReference> implements CommunityVisa {
    private root;
    private user;
    constructor(root: root, user: StaffUserEntityReference);
    determineIf(func: ((permissions: StaffRoleCommunityPermissionsSpec) => boolean)): boolean;
}
