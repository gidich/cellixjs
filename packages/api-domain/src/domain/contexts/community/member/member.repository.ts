import { Member, MemberProps } from './member';
import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityEntityReference } from '../community/community';

export interface MemberRepository<props extends MemberProps> extends DomainSeedwork.Repository<Member<props>> {
  getNewInstance(name: string, community: CommunityEntityReference): Promise<Member<props>>;
  getById(id: string): Promise<Member<props>>;
  getAssignedToRole(roleId: string): Promise<Member<props>[]>;
  getAll(): Promise<Member<props>[]>
}