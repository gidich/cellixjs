import { Model, Schema } from 'mongoose';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import { User, UserModelType } from './user.model';
export interface EndUserContactInformation extends MongooseSeedwork.NestedPath {
    email: string;
}
export declare const EndUserContactInformationType: {
    email: {
        type: StringConstructor;
        match: RegExp;
        maxlength: number;
        required: boolean;
    };
};
export interface EndUserIdentityDetails extends MongooseSeedwork.NestedPath {
    lastName: string;
    legalNameConsistsOfOneName: boolean;
    restOfName?: string;
}
export declare const EndUserIdentityDetailsType: {
    lastName: {
        type: StringConstructor;
        required: boolean;
        maxlength: number;
    };
    legalNameConsistsOfOneName: {
        type: BooleanConstructor;
        required: boolean;
        default: boolean;
    };
    restOfName: {
        type: StringConstructor;
        required: boolean;
        maxlength: number;
    };
};
export interface EndUserPersonalInformation extends MongooseSeedwork.NestedPath {
    identityDetails: EndUserIdentityDetails;
    contactInformation: EndUserContactInformation;
}
export declare const EndUserPersonalInformationType: {
    identityDetails: {
        autoIndex?: boolean;
        autoSearchIndex?: boolean;
        autoCreate?: boolean;
        bufferCommands?: boolean;
        bufferTimeoutMS?: number;
        capped?: boolean | number | {
            size?: number;
            max?: number;
            autoIndexId?: boolean;
        };
        collation?: import("mongodb").CollationOptions;
        collectionOptions?: import("mongodb").CreateCollectionOptions;
        timeseries?: import("mongodb").TimeSeriesCollectionOptions;
        expireAfterSeconds?: number;
        expires?: number | string;
        collection?: string;
        discriminatorKey?: string;
        excludeIndexes?: boolean;
        id?: boolean;
        _id?: boolean;
        minimize?: boolean;
        optimisticConcurrency?: boolean;
        pluginTags?: string[];
        read?: string;
        readConcern?: {
            level: "local" | "available" | "majority" | "snapshot" | "linearizable";
        };
        writeConcern?: import("mongoose").WriteConcern;
        safe?: boolean | {
            w?: number | string;
            wtimeout?: number;
            j?: boolean;
        };
        shardKey?: Record<string, unknown>;
        strict?: boolean | "throw";
        strictQuery?: boolean | "throw";
        toJSON?: import("mongoose").ToObjectOptions<import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>;
        toObject?: import("mongoose").ToObjectOptions<import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>;
        typeKey?: string;
        validateBeforeSave?: boolean;
        validateModifiedOnly?: boolean;
        versionKey?: string | boolean;
        selectPopulatedPaths?: boolean;
        skipVersioning?: {
            [key: string]: boolean;
        };
        storeSubdocValidationError?: boolean;
        timestamps?: boolean | import("mongoose").SchemaTimestampsConfig;
        suppressReservedKeysWarning?: boolean;
        statics?: {
            [name: string]: (this: Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }, any>, ...args: any[]) => unknown;
        };
        methods?: Record<any, (this: import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, ...args: any) => unknown>;
        query?: Record<any, <T extends import("mongoose").Query<unknown, import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, {}, unknown, "find", Record<string, never>>>(this: T, ...args: any) => T>;
        castNonArrays?: boolean;
        virtuals?: import("mongoose").SchemaOptionsVirtualsPropertyType<unknown, {}, {}>;
        overwriteModels?: boolean;
        type: {
            lastName: {
                type: StringConstructor;
                required: boolean;
                maxlength: number;
            };
            legalNameConsistsOfOneName: {
                type: BooleanConstructor;
                required: boolean;
                default: boolean;
            };
            restOfName: {
                type: StringConstructor;
                required: boolean;
                maxlength: number;
            };
        };
        required: boolean;
    };
    contactInformation: {
        autoIndex?: boolean;
        autoSearchIndex?: boolean;
        autoCreate?: boolean;
        bufferCommands?: boolean;
        bufferTimeoutMS?: number;
        capped?: boolean | number | {
            size?: number;
            max?: number;
            autoIndexId?: boolean;
        };
        collation?: import("mongodb").CollationOptions;
        collectionOptions?: import("mongodb").CreateCollectionOptions;
        timeseries?: import("mongodb").TimeSeriesCollectionOptions;
        expireAfterSeconds?: number;
        expires?: number | string;
        collection?: string;
        discriminatorKey?: string;
        excludeIndexes?: boolean;
        id?: boolean;
        _id?: boolean;
        minimize?: boolean;
        optimisticConcurrency?: boolean;
        pluginTags?: string[];
        read?: string;
        readConcern?: {
            level: "local" | "available" | "majority" | "snapshot" | "linearizable";
        };
        writeConcern?: import("mongoose").WriteConcern;
        safe?: boolean | {
            w?: number | string;
            wtimeout?: number;
            j?: boolean;
        };
        shardKey?: Record<string, unknown>;
        strict?: boolean | "throw";
        strictQuery?: boolean | "throw";
        toJSON?: import("mongoose").ToObjectOptions<import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>;
        toObject?: import("mongoose").ToObjectOptions<import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>;
        typeKey?: string;
        validateBeforeSave?: boolean;
        validateModifiedOnly?: boolean;
        versionKey?: string | boolean;
        selectPopulatedPaths?: boolean;
        skipVersioning?: {
            [key: string]: boolean;
        };
        storeSubdocValidationError?: boolean;
        timestamps?: boolean | import("mongoose").SchemaTimestampsConfig;
        suppressReservedKeysWarning?: boolean;
        statics?: {
            [name: string]: (this: Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }, any>, ...args: any[]) => unknown;
        };
        methods?: Record<any, (this: import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, ...args: any) => unknown>;
        query?: Record<any, <T extends import("mongoose").Query<unknown, import("mongoose").Document<unknown, {}, unknown> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, {}, unknown, "find", Record<string, never>>>(this: T, ...args: any) => T>;
        castNonArrays?: boolean;
        virtuals?: import("mongoose").SchemaOptionsVirtualsPropertyType<unknown, {}, {}>;
        overwriteModels?: boolean;
        type: {
            email: {
                type: StringConstructor;
                match: RegExp;
                maxlength: number;
                required: boolean;
            };
        };
        required: boolean;
    };
};
export interface EndUser extends User {
    personalInformation: EndUserPersonalInformation;
    email?: string;
    displayName: string;
    externalId: string;
    userType?: string;
    accessBlocked: boolean;
    tags?: string[];
}
export declare const EndUserSchema: Schema<EndUser, Model<EndUser, {}, {}, {}, import("mongoose").Document<unknown, {}, EndUser> & EndUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, EndUser, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EndUser, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<EndUser>> & Omit<import("mongoose").FlatRecord<EndUser> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof EndUser> & EndUser>;
export declare const EndUserModelName: string;
export declare const EndUserModelFactory: (UserModel: UserModelType) => Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export type EndUserModelType = ReturnType<typeof EndUserModelFactory>;
