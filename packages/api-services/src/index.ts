import { StartupObject } from 'api-services-spec';


export class startupObject implements StartupObject  {
    private readonly _startupDate: Date;
    private _shutdownDate: Date;
    private _startupInvoked: boolean = false;
    private _startupInvokedDate: Date;

    constructor(){
        this._startupDate = new Date();
    }
    public get startupDate(): Date {
        return this._startupDate;
    }
    public ShutDown(): void {
        this._shutdownDate = new Date();
    }
    public StartUp(): void {
        this._startupInvoked = true;
        this._startupInvokedDate = new Date();
    }

    public get shutdownDate(): Date {
        return this._shutdownDate;
    }
    public get name(): string {
        return "startupObject startup invoked: " + this._startupInvoked + " startup date: " + this._startupInvokedDate;
    }

};