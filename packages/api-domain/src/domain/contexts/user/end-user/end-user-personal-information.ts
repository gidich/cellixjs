import { DomainSeedwork } from '@cellix/domain-seedwork';
import {
	EndUserContactInformation,
	type EndUserContactInformationEntityReference,
	type EndUserContactInformationProps,
} from './end-user-contact-information.ts';
import {
	EndUserIdentityDetails,
	type EndUserIdentityDetailsEntityReference,
	type EndUserIdentityDetailsProps,
} from './end-user-identity-details.ts';
import type { UserVisa } from '../user.visa.ts';

export interface EndUserPersonalInformationProps
	extends DomainSeedwork.ValueObjectProps {
	readonly identityDetails: EndUserIdentityDetailsProps;
	readonly contactInformation: EndUserContactInformationProps;
}

export interface EndUserPersonalInformationEntityReference
	extends Readonly<
		Omit<
			EndUserPersonalInformationProps,
			'identityDetails' | 'contactInformation'
		>
	> {
	readonly identityDetails: EndUserIdentityDetailsEntityReference;
	readonly contactInformation: EndUserContactInformationEntityReference;
}

export class EndUserPersonalInformation
	extends DomainSeedwork.ValueObject<EndUserPersonalInformationProps>
	implements EndUserPersonalInformationEntityReference
{
	private isNew: boolean = false;
	private readonly visa: UserVisa;
	constructor(props: EndUserPersonalInformationProps, visa: UserVisa) {
		super(props);
		this.visa = visa;
	}

	private markAsNew(): void {
		this.isNew = true;
	}
	public static getNewInstance(
		props: EndUserPersonalInformationProps,
		visa: UserVisa,
		identityDetails: EndUserIdentityDetailsProps,
		contactInformation: EndUserContactInformationProps,
	): EndUserPersonalInformation {
		const newInstance = new EndUserPersonalInformation(props, visa);
		newInstance.markAsNew();
		newInstance.identityDetails = identityDetails;
		newInstance.contactInformation = contactInformation;
		newInstance.isNew = false;
		return newInstance;
	}

	get identityDetails() {
		return new EndUserIdentityDetails(this.props.identityDetails, this.visa);
	}
	private set identityDetails(identityDetails: EndUserIdentityDetailsProps) {
		if (!this.isNew) {
            /* v8 ignore next 2 -- defensive: only called during creation */
			throw new Error('Cannot set identity details');
		}
		EndUserIdentityDetails.getNewInstance(
			this.props.identityDetails,
			this.visa,
			identityDetails.lastName,
			identityDetails.legalNameConsistsOfOneName,
			identityDetails.restOfName,
		);
	}

	get contactInformation() {
		return new EndUserContactInformation(
			this.props.contactInformation,
			this.visa,
		);
	}
	private set contactInformation(contactInformation: EndUserContactInformationProps) {
		if (!this.isNew) {
            /* v8 ignore next 2 -- defensive: only called during creation */
			throw new Error('Cannot set contact information');
		}
		EndUserContactInformation.getNewInstance(
			this.props.contactInformation,
			this.visa,
			contactInformation.email,
		);
	}
}
