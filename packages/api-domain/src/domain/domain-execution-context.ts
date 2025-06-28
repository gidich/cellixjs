import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from './contexts/passport.ts';

export interface DomainExecutionContext
	extends DomainSeedwork.BaseDomainExecutionContext {
	passport: Passport;
}
