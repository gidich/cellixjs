import { Domain } from 'api-domain';
import { Models } from 'api-data-sources-mongoose-models';
import { MongooseSeedwork } from '../../../../cellix-data-sources-mongoose/dist/src';
import { EndUserDomainAdapter } from '../../user/end-user/end-user.domain-adapter';


export class CommunityConverter extends MongooseSeedwork.MongoTypeConverter<
  Models.Community.Community, 
  CommunityDomainAdapter, 
  Domain.Contexts.Community.Community.Community<CommunityDomainAdapter>,
  Domain.DomainExecutionContext
  > {
  constructor() {
    super(CommunityDomainAdapter, Domain.Contexts.Community.Community.Community<CommunityDomainAdapter>);
  }
}

export class CommunityDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<Models.Community.Community> implements Domain.Contexts.Community.Community.CommunityProps {
  get name() {
    return this.doc.name;
  }
  set name(name) {
    this.doc.name = name;
  }

  get domain() {
    return this.doc.domain;
  }
  set domain(domain) {
    this.doc.domain = domain;
  }

  get whiteLabelDomain() {
    return this.doc.whiteLabelDomain;
  }
  set whiteLabelDomain(whiteLabelDomain: string) {
    this.doc.whiteLabelDomain = whiteLabelDomain;
  }

  get handle() {
    return this.doc.handle;
  }
  set handle(handle) {
    this.doc.handle = handle;
  }
  
  get createdBy(): Domain.Contexts.User.EndUser.EndUserProps {
    if (!this.doc.createdBy) {
      throw new Error('createdBy is not populated');
    }
    if (this.doc.createdBy instanceof MongooseSeedwork.ObjectId) {
      throw new Error('createdBy is not populated or is not of the correct type');
    }
    return new EndUserDomainAdapter(this.doc.createdBy as Models.User.EndUser);
  }

  setCreatedByRef(user: Domain.Contexts.User.EndUser.EndUserEntityReference) {
    this.doc.set('createdBy', user['props']['doc']);
  }
    
}
