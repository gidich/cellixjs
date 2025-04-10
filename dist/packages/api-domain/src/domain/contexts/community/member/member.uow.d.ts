import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { Member, MemberProps } from './member';
import { MemberRepository } from './member.repository';
export interface MemberUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, MemberProps, Member<MemberProps>, MemberRepository<MemberProps>> {
}
