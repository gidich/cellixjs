import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import { Member, type MemberProps } from './member.ts';
import type { MemberRepository } from './member.repository.ts';

export interface MemberUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, MemberProps,  Member<MemberProps>, MemberRepository<MemberProps>> {}
