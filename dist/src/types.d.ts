import { Draft } from "./Draft";
import { errors } from "./errors/errors";
import { SchemaNode, isSchemaNode, GetNodeOptions } from "./SchemaNode";
export type JsonBooleanSchema = boolean;
export interface JsonSchema {
    [p: string]: any;
}
export type JsonPointer = string;
export type DefaultErrors = keyof typeof errors;
export type ErrorConfig = Record<DefaultErrors | string, string | ((error: ErrorData) => void)>;
export type OptionalNodeOrError = {
    node?: SchemaNode;
    error: undefined;
} | {
    node: undefined;
    error?: JsonError;
};
export type NodeOrError = {
    node: SchemaNode;
    error: undefined;
} | {
    node: undefined;
    error: JsonError;
};
export type { SchemaNode, GetNodeOptions, Draft };
export { isSchemaNode };
export type ErrorData<T extends Record<string, unknown> = {
    [p: string]: unknown;
}> = T & {
    pointer: string;
    schema: JsonSchema;
    value: unknown;
};
export type JsonError<T extends ErrorData = ErrorData> = {
    type: "error";
    code: ErrorConfig | string;
    message: string;
    data: T;
    [p: string]: unknown;
};
/**
 * ts type guard for json error
 * @returns true if passed type is a JsonError
 */
export declare function isJsonError(error: any): error is JsonError;
