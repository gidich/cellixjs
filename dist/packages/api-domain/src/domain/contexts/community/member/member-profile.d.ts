import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../community.visa";
export interface MemberProfileProps extends DomainSeedwork.ValueObjectProps {
    name: string;
    email: string;
    bio: string;
    avatarDocumentId: string;
    interests: string[];
    showInterests: boolean;
    showEmail: boolean;
    showProfile: boolean;
    showLocation: boolean;
    showProperties: boolean;
}
export interface MemberProfileEntityReference extends Readonly<MemberProfileProps> {
}
export declare class MemberProfile extends DomainSeedwork.ValueObject<MemberProfileProps> implements MemberProfileEntityReference {
    private readonly visa;
    constructor(props: MemberProfileProps, visa: CommunityVisa);
    get name(): any;
    get email(): any;
    get bio(): any;
    get avatarDocumentId(): any;
    get interests(): any;
    get showInterests(): any;
    get showEmail(): any;
    get showProfile(): any;
    get showLocation(): any;
    get showProperties(): any;
    private validateVisa;
    set Name(name: string);
    set Email(email: string);
    set Bio(bio: string);
    set AvatarDocumentId(avatarDocumentId: string);
    set Interests(interests: string[]);
    set ShowInterests(showInterests: boolean);
    set ShowEmail(showEmail: boolean);
    set ShowProfile(showProfile: boolean);
    set ShowLocation(showLocation: boolean);
    set ShowProperties(showProperties: boolean);
}
