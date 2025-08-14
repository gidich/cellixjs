import { DomainSeedwork } from '@cellix/domain-seedwork';
import { EndUserCreatedEvent } from '../../../events/types/end-user-created.ts';
import * as ValueObjects from './end-user.value-objects.ts';
import {
	EndUserPersonalInformation,
	type EndUserPersonalInformationEntityReference,
	type EndUserPersonalInformationProps,
} from './end-user-personal-information.ts';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';

export interface EndUserProps extends DomainSeedwork.DomainEntityProps {
	readonly personalInformation: EndUserPersonalInformationProps;
	email: string | undefined;
	displayName: string;
	externalId: string;
	accessBlocked: boolean;
	tags: string[] | undefined;
	readonly userType: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}
export interface EndUserEntityReference
	extends Readonly<Omit<EndUserProps, 'personalInformation'>> {
	readonly personalInformation: EndUserPersonalInformationEntityReference;
}

export class EndUser<props extends EndUserProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements EndUserEntityReference
{
	private isNew: boolean = false;
	private readonly visa: UserVisa;
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forEndUser(this);
	}

	public static getNewInstance<props extends EndUserProps>(
		newProps: props,
		passport: Passport,
		externalId: string,
		lastName: string,
		restOfName: string | undefined,
		email: string,
	): EndUser<props> {
		const newInstance = new EndUser(newProps, passport);
		newInstance.markAsNew();
		newInstance.externalId = externalId;
        newInstance.personalInformation.contactInformation.email = email;
		if (restOfName !== undefined && restOfName.trim() !== '') {
            newInstance.personalInformation.identityDetails.lastName = lastName;
            newInstance.personalInformation.identityDetails.legalNameConsistsOfOneName = false;
            newInstance.personalInformation.identityDetails.restOfName = restOfName;
			newInstance.displayName = `${restOfName} ${lastName}`;
		} else {
            newInstance.personalInformation.identityDetails.lastName = lastName;
            newInstance.personalInformation.identityDetails.legalNameConsistsOfOneName = true;
			newInstance.displayName = lastName;
		}
		newInstance.isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this.isNew = true;
		this.addIntegrationEvent(EndUserCreatedEvent, { userId: this.props.id });
	}

	private validateVisa(): void {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(permissions) =>
					permissions.isEditingOwnAccount || permissions.canManageEndUsers,
			)
		) {
			throw new DomainSeedwork.PermissionError('Unauthorized');
		}
	}
	private validateVisaElevated(): void {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canManageEndUsers)
		) {
			throw new DomainSeedwork.PermissionError('Unauthorized');
		}
	}

	get email(): string | undefined {
		return this.props.email;
	}
	set email(email: string | undefined) {
		this.validateVisa();
		this.props.email = new ValueObjects.Email(email).valueOf();
	}
	get displayName(): string {
        this.validateVisa();
		return this.props.displayName;
	}
	set displayName(displayName: string) {
		this.validateVisa();
		this.props.displayName = new ValueObjects.DisplayName(
			displayName,
		).valueOf();
	}
	get externalId(): string {
		return this.props.externalId;
	}
	set externalId(externalId: string) {
		if (!this.isNew) {
			throw new Error('Cannot set personal information');
		}
		this.props.externalId = new ValueObjects.ExternalId(externalId).valueOf();
	}
	get accessBlocked(): boolean {
		return this.props.accessBlocked;
	}
	set accessBlocked(accessBlocked: boolean) {
		this.validateVisaElevated();
		this.props.accessBlocked = accessBlocked;
	}

	get tags(): string[] {
		return this.props.tags ?? [];
	}
	set tags(tags: string[]) {
		this.validateVisaElevated();
		this.props.tags = tags;
	}
	get personalInformation() {
		return new EndUserPersonalInformation(
			this.props.personalInformation,
			this.visa,
		);
	}
	private set personalInformation(personalInformation: EndUserPersonalInformationProps) {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Cannot set personal information',
			);
		}
		EndUserPersonalInformation.getNewInstance(
			this.props.personalInformation,
			this.visa,
			personalInformation.identityDetails,
			personalInformation.contactInformation,
		);
	}

	get userType(): string {
		return this.props.userType;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
}
