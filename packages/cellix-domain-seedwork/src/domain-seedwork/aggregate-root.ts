import { DomainEntity,type DomainEntityProps } from './domain-entity.ts';
import { type CustomDomainEvent } from './domain-event.ts';



export interface RootEventRegistry {
  addDomainEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']): void;
  addIntegrationEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']): void;
}

export class AggregateRoot<PropType extends DomainEntityProps, PassportType> extends DomainEntity<PropType> implements RootEventRegistry {
  protected readonly passport: PassportType;


  constructor(props: PropType, passport: PassportType){
    super(props);
    this.passport = passport;
  }

  private _isDeleted: boolean = false;
  public get isDeleted(): boolean {
    return this._isDeleted;
  }
  protected set isDeleted(value: boolean) {
    this._isDeleted = value;
  }

  
  private domainEvents: CustomDomainEvent<any>[] = [];
  public addDomainEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']) {
    let eventToAdd = new event(this.props.id);
    eventToAdd.payload = props;
    this.domainEvents.push(eventToAdd);
  }
  public clearDomainEvents() {
    this.domainEvents = [];
  }
  public getDomainEvents(): ReadonlyArray<CustomDomainEvent<any>> {
    return this.domainEvents;
  }

  private integrationEvents: CustomDomainEvent<any>[] = [];
  public addIntegrationEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']) {
    let eventToAdd = new event(this.props.id);
    eventToAdd.payload = props;
    this.integrationEvents.push(eventToAdd);
  }
  public clearIntegrationEvents() {
    this.integrationEvents = [];
  }
  public getIntegrationEvents(): ReadonlyArray<CustomDomainEvent<any>> {
    return this.integrationEvents;
  }
  public onSave(_isModified: boolean): void {
    //override this method to do something on save
  }
}
