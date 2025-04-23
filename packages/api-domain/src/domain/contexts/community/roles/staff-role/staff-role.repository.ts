import { StaffRole, type StaffRoleProps } from './staff-role.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface StaffRoleRepository<props extends StaffRoleProps> extends DomainSeedwork.Repository<StaffRole<props>> {
  getNewInstance(name: string): Promise<StaffRole<props>>;
  getById(id: string): Promise<StaffRole<props>>;
  getByRoleName(roleName: string): Promise<StaffRole<props>>;
}