enum Version {
    V1,
    V2,
    V3,
}

// Nice to have: we would prefer not to have to duplicate unchanged methods.
type LicenseVersions = {
    [Version.V1]: {
        methodA: (param: string) => number;
        methodB: (param: number) => boolean;
        methodC: (param: number) => string;
    };
    [Version.V2]: {
        methodA: (param: { id: string }) => string;
        methodB: (param: { count: number }) => string[];
        methodC: (param: number) => string;
    };
    [Version.V3]: {
        methodA: (param: { name: string }) => { success: boolean };
        methodB: (param: { value: boolean }) => string;
        methodC: (param: number) => string;
    };
};

type LicenseVersionedMethods<V extends Version> =
    V extends keyof LicenseVersions ? LicenseVersions[V] : never;

class Salable<V extends Version> {
    license: LicenseVersionedMethods<V>;
    constructor(version: V) {
        this.license = licensesInit(version);
    }
}

// Note: It may be possible to release without this being a breaking change.
// We will have to create the sub classes for the method groups.

// Note: the methods can be exported from a single file and imported `import licenseV1 from './licenseV1.ts'`
// Then return licenseV1
const v1LicenseMethods = {
    methodA: (param: string) => param.length,
    methodB: (param: number) => param > 0,
    methodC: (param: number) => param.toString(),
};

const v2LicenseMethods = {
    ...v1LicenseMethods,
    methodA: (param: { id: string }) => `ID: ${param.id}`,
    methodB: (param: { count: number }) => Array(param.count).fill("item"),
};

const v3LicenseMethods = {
    ...v2LicenseMethods,
    methodA: (param: { name: string }) => ({ success: true }),
    methodB: (param: { value: boolean }) => (param.value ? "true" : "false"),
};

const licensesInit = <V extends Version>(
    version: V,
): LicenseVersionedMethods<V> => {
    switch (version) {
        case Version.V1:
            return v1LicenseMethods as LicenseVersionedMethods<V>;
        case Version.V2:
            return v2LicenseMethods as LicenseVersionedMethods<V>;
        case Version.V3:
            return v3LicenseMethods as LicenseVersionedMethods<V>;
        default:
            throw new Error("Unsupported version");
    }
};

const v1Instance = new Salable(Version.V1);
const resultA_v1 = v1Instance.license.methodA("hello"); // number
console.log("resultA_v1", resultA_v1);
const resultB_v1 = v1Instance.license.methodB(5); // boolean
console.log("resultB_v1", resultB_v1);
const resultC_v1 = v1Instance.license.methodC(5); // boolean
console.log("resultC_v1", resultC_v1);

const v2Instance = new Salable(Version.V2);
const resultA_v2 = v2Instance.license.methodA({ id: "123" }); // string
console.log("resultA_v2", resultA_v2);
const resultB_v2 = v2Instance.license.methodB({ count: 3 }); // string[]
console.log("resultB_v2", resultB_v2);
const resultC_v2 = v2Instance.license.methodC(5); // boolean
console.log("resultC_v2", resultC_v2);

const v3Instance = new Salable(Version.V3);
const resultA_v3 = v3Instance.license.methodA({ name: "Alice" }); // { success: boolean }
console.log("resultA_v3", resultA_v3);
const resultB_v3 = v3Instance.license.methodB({ value: true }); // string
console.log("resultB_v3", resultB_v3);
const resultC_v3 = v3Instance.license.methodC(5); // boolean
console.log("resultC_v3", resultC_v3);
