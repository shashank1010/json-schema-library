import { strict as assert } from "assert";
import { compileSchema } from "../../compileSchema";

describe("docs - remote schema", () => {
    it("should resolve remote schema from given url", () => {
        const node = compileSchema({
            $id: "https://local.com/schemas/root.json",
            type: "object",
            required: ["character"],
            properties: {
                character: {
                    $ref: "https://remote.com/schemas/character"
                }
            }
        }).addRemoteSchema("https://remote.com/schemas/character", {
            title: "character remote schema",
            type: "string",
            default: "A",
            maxLength: 1,
            minLength: 1
        });

        const remoteSchema = node.getNodeRef("https://remote.com/schemas/character")?.schema;
        assert.deepEqual(remoteSchema.title, "character remote schema", "should have resolved remote root schema");

        const data = node.getData({});
        assert.deepEqual(data, { character: "A" }, "should have retrieved default value from remote schema");
    });

    it.skip("should resolve remote schemas from simple ids", () => {
        const node = compileSchema({
            $id: "https://local.com/schemas/root.json",
            type: "object",
            required: ["character"],
            properties: {
                character: {
                    $ref: "character"
                }
            }
        }).addRemoteSchema("character", {
            title: "character remote schema",
            type: "string",
            default: "A",
            maxLength: 1,
            minLength: 1
        });

        const remoteSchema = node.getNodeRef("character")?.schema;
        assert.deepEqual(remoteSchema.title, "character remote schema", "should have resolved remote root schema");

        const data = node.getData({});
        assert.deepEqual(data, { character: "A" }, "should have retrieved default value from remote schema");
    });

    it("should resolve $defs from remote schema", () => {
        const node = compileSchema({
            $id: "https://local.com/schema.json",
            type: "object",
            required: ["character"],
            properties: {
                character: {
                    $ref: "https://remote.com/schema.json#/$defs/character"
                }
            }
        }).addRemoteSchema("https://remote.com/schema.json", {
            title: "$defs remote schema",
            $defs: {
                character: {
                    type: "string",
                    default: "A",
                    maxLength: 1,
                    minLength: 1
                }
            }
        });

        const remoteSchema = node.getNodeRef("https://remote.com/schema.json#/$defs/character")?.schema;
        assert.deepEqual(
            remoteSchema,
            {
                type: "string",
                default: "A",
                maxLength: 1,
                minLength: 1
            },
            "should have resolved remote definition"
        );

        const data = node.getData({});
        assert.deepEqual(data, { character: "A" }, "should have retrieved default value from remote schema");
    });

    it.skip("should resolve $defs from remote schema using simple ids", () => {
        const node = compileSchema({
            $id: "local",
            type: "object",
            required: ["character"],
            properties: {
                character: {
                    $ref: "remote#/$defs/character"
                }
            }
        }).addRemoteSchema("remote", {
            title: "$defs remote schema",
            $defs: {
                character: {
                    type: "string",
                    default: "A",
                    maxLength: 1,
                    minLength: 1
                }
            }
        });

        const remoteSchema = node.getNodeRef("remote#/$defs/character")?.schema;
        assert.deepEqual(
            remoteSchema,
            {
                type: "string",
                default: "A",
                maxLength: 1,
                minLength: 1
            },
            "should have resolved remote definition"
        );

        const data = node.getData({});
        assert.deepEqual(data, { character: "A" }, "should have retrieved default value from remote schema");
    });

    it.skip("should resolve pointer to nested object in remote schema", () => {
        const node = compileSchema({
            $id: "local",
            type: "object",
            required: ["character"],
            properties: {
                character: {
                    $ref: "remote#/properties/character"
                }
            }
        }).addRemoteSchema("remote", {
            type: "object",
            properties: {
                character: {
                    type: "string",
                    default: "A",
                    maxLength: 1,
                    minLength: 1
                }
            }
        });

        const remoteSchema = node.getNodeRef("remote#/properties/character")?.schema;
        assert.deepEqual(
            remoteSchema,
            {
                type: "string",
                default: "A",
                maxLength: 1,
                minLength: 1
            },
            "should have resolved remote definition"
        );

        const data = node.getData({});
        assert.deepEqual(data, { character: "A" }, "should have retrieved default value from remote schema");
    });
});
