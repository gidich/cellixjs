
import { type StaffRoleEntityReference } from './contexts/community/roles/staff-role/staff-role.ts';
import { type CommunityEntityReference } from './contexts/community/community/community.ts';
import { CommunityVisaImplForCommunity } from './contexts/iam/user/community.visa-impl.for-community.ts';
import { type CommunityVisa, type CommunityPermissionsSpec } from "./contexts/community/community.visa.ts";

import type { MemberEntityReference } from './contexts/community/member/member.ts';
import type { VendorUserEntityReference } from "./contexts/user/vendor-user/vendor-user.ts";
import type { VendorUserRoleEntityReference } from './contexts/community/roles/vendor-user-role/vendor-user-role.ts';
import type { ServiceEntityReference } from './contexts/community/service/service.ts';
import { type ServicePermissionsSpec, type ServiceVisa, ServiceVisaImpl } from './contexts/community/service/service.visa.ts';
import type { EndUserEntityReference } from './contexts/user/end-user/end-user.ts';
import { type EndUserVisa, EndUserVisaImpl } from './contexts/user/end-user/end-user.visa.ts';
import type { StaffUserEntityReference } from './contexts/user/staff-user/staff-user.ts';
import { type StaffUserPermissionsSpec, type StaffUserVisa, StaffUserVisaImpl } from './contexts/user/staff-user/staff-user.visa.ts';
import { type VendorUserVisa, VendorUserVisaImpl } from './contexts/user/vendor-user/vendor-user.visa.ts';
import { MemberCommunityVisa } from './contexts/iam/member/member.community.visa.ts';
import { CommunityVisaImplForStaffRole } from './contexts/iam/user/community.visa-impl.for-staff-role.ts';
import { CommunityVisaImplForEndUserRole } from './contexts/iam/user/community.visa-impl.for-end-user-role.ts';
import type { EndUserRoleEntityReference } from './contexts/community/roles/end-user-role/end-user-role.ts';
import { CommunityVisaImplForVendorUserRole } from './contexts/community/roles/vendor-user-role/community.visa-impl.for-vendor-user-role.ts';



export const SystemUserId = 'system';

export interface DomainVisa {
  forCommunity(root: CommunityEntityReference):  CommunityVisa;
  forStaffRole(root: StaffRoleEntityReference): CommunityVisa;
  forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa;
  forService(root: ServiceEntityReference): ServiceVisa;
  forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa;
  forEndUser(root: EndUserEntityReference):  EndUserVisa;
  forStaffUser(root: StaffUserEntityReference): StaffUserVisa;
  forVendorUser(root: VendorUserEntityReference):  VendorUserVisa;




}

export class DomainVisaImpl implements DomainVisa {

  constructor(
    private readonly user: EndUserEntityReference|StaffUserEntityReference, 
    private readonly member: MemberEntityReference,
    private readonly community: CommunityEntityReference = null
  ){
    if (!user) {
      throw new Error("User is required");
    }
    if(member !== null && !member.accounts.find(account => account.user.id === user.id)){
      throw new Error(`User ${user.id} is not a member of the community ${member.community.id}`);
    }
  } 
  
  forMember(root: MemberEntityReference): CommunityVisa {
    return new MemberCommunityVisa(root,this.member);
  }
  forCommunity(root: CommunityEntityReference): CommunityVisa {
    return new CommunityVisaImplForCommunity(root,this.member, this.user);
  }
  forCurrentCommunity(): CommunityVisa {
    return this.forCommunity(this.community);
  }
  forStaffRole(root: StaffRoleEntityReference): CommunityVisa {
    return new CommunityVisaImplForStaffRole(root,this.user as StaffUserEntityReference);
  }
  forEndUserRole(root: EndUserRoleEntityReference): CommunityVisa {
    return new CommunityVisaImplForEndUserRole(root,this.member);
  }
  forEndUser(root: EndUserEntityReference):  EndUserVisa {
    return new EndUserVisaImpl(root,this.user as EndUserEntityReference);
  }   
  forStaffUser(root: StaffUserEntityReference): StaffUserVisa {
    return new StaffUserVisaImpl(root, this.user as StaffUserEntityReference);
  }

  forService(root: ServiceEntityReference): ServiceVisa {
    return new ServiceVisaImpl(root,this.member);
  }
  forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa {
    return new CommunityVisaImplForVendorUserRole(root,this.member);
  }
  forVendorUser(root: VendorUserEntityReference):  VendorUserVisa {
    return new VendorUserVisaImpl(root,this.user as VendorUserEntityReference);
  }   
}

export class ReadOnlyDomainVisa implements DomainVisa {
  private constructor(){
    //prevent public construction
  }
  public static GetInstance(): DomainVisa {
    return new ReadOnlyDomainVisa();
  }
  forMember (_root: MemberEntityReference): CommunityVisa {
    return {determineIf:  () => false };
  }
  forCommunity(_root: CommunityEntityReference): CommunityVisa {
    return {determineIf:  () => false }; 
  }
  forCurrentCommunity(): CommunityVisa {
    return {determineIf:  () => false }; 
  }
  forStaffRole(_root: StaffRoleEntityReference): CommunityVisa {
    return {determineIf:  () => false }; 
  }
  forEndUserRole(_root: EndUserRoleEntityReference): CommunityVisa {
    return {determineIf:  () => false }; 
  }
  forEndUser(_root: EndUserEntityReference): EndUserVisa {
    return {determineIf:  () => false }; 
  }
  forStaffUser(_root: StaffUserEntityReference): StaffUserVisa {
    return {determineIf:  () => false };
  }
  forService(_root: ServiceEntityReference): ServiceVisa {
    return {determineIf:  () => false };
  }
  forVendorUserRole(_root: VendorUserRoleEntityReference): CommunityVisa {
    return {determineIf:  () => false }; 
  }
  forVendorUser(_root: VendorUserEntityReference): VendorUserVisa {
    return {determineIf:  () => false }; 
  }
  
}

export class SystemDomainVisa implements DomainVisa {
  private constructor(){
    //prevent public construction
  }
  public static GetInstance(): DomainVisa {
    return new SystemDomainVisa();
  }
  
  f
  private communityPermissionsForSystem: CommunityPermissionsSpec = {
    canManageRolesAndPermissions: false,
    canManageCommunitySettings: false,
    canManageSiteContent: false,
    canManageMembers: false,
    canEditOwnMemberProfile: false,
    canEditOwnMemberAccounts: false,
    isEditingOwnMemberAccount: false,
    isSystemAccount: true,
  }
  private servicePermissionsForSystem: ServicePermissionsSpec = {
    canManageServices: false,
    isSystemAccount: true,
  }

  private staffUserPermissionsForSystem: StaffUserPermissionsSpec = {
    isEditingOwnAccount: false,
    isSystemAccount: true,
  }
  forMember (root: MemberEntityReference): CommunityVisa {
    return {determineIf: (func) => func(this.communityPermissionsForSystem) };
  }
  forCommunity(root: CommunityEntityReference): CommunityVisa {
    return {determineIf: (func) => func(this.communityPermissionsForSystem) };
  }
  forCurrentCommunity(): CommunityVisa {
    return {determineIf:  (func) => func(this.communityPermissionsForSystem) };
  }
  forStaffRole(root: StaffRoleEntityReference): CommunityVisa {
    return {determineIf: (func) => func(this.communityPermissionsForSystem) };
  }
  forEndUserRole(root: EndUserRoleEntityReference): CommunityVisa {
    return {determineIf:  (func) => func(this.communityPermissionsForSystem) };
  }
  forEndUser(root: EndUserEntityReference): EndUserVisa {
    return {determineIf:  () => false }; 
  }
  forStaffUser(root: StaffUserEntityReference): StaffUserVisa {
    return {determineIf:  (func) => func(this.staffUserPermissionsForSystem) };
  }
  forService(root: ServiceEntityReference): ServiceVisa {
    return {determineIf:  (func) => func(this.servicePermissionsForSystem) };
  }
  forVendorUserRole(root: VendorUserRoleEntityReference): CommunityVisa {
    return {determineIf:  (func) => func(this.communityPermissionsForSystem) };
  }
  forVendorUser(root: VendorUserEntityReference): VendorUserVisa {
    return {determineIf:  () => false }; 
  }
  
}
