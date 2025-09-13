let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
 * @param {string} s
 * @returns {string}
 */
export function slugify(s) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.slugify(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * Signs a message with the given private key
 * @category Message Signing
 * @param {ISignMessage} value
 * @returns {HexString}
 */
export function signMessage(value) {
    const ret = wasm.signMessage(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Verifies with a public key the signature of the given message
 * @category Message Signing
 */
export function verifyMessage(value) {
    const ret = wasm.verifyMessage(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @category Wallet SDK
 * @param {PublicKey | string} key
 * @param {NetworkType | NetworkId | string} network
 * @param {boolean | null} [ecdsa]
 * @param {AccountKind | null} [account_kind]
 * @returns {Address}
 */
export function createAddress(key, network, ecdsa, account_kind) {
    let ptr0 = 0;
    if (!isLikeNone(account_kind)) {
        _assertClass(account_kind, AccountKind);
        ptr0 = account_kind.__destroy_into_raw();
    }
    const ret = wasm.createAddress(key, network, isLikeNone(ecdsa) ? 0xFFFFFF : ecdsa ? 1 : 0, ptr0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Address.__wrap(ret[0]);
}

/**
 * @category Wallet SDK
 * @param {number} minimum_signatures
 * @param {(PublicKey | string)[]} keys
 * @param {NetworkType} network_type
 * @param {boolean | null} [ecdsa]
 * @param {AccountKind | null} [account_kind]
 * @returns {Address}
 */
export function createMultisigAddress(minimum_signatures, keys, network_type, ecdsa, account_kind) {
    let ptr0 = 0;
    if (!isLikeNone(account_kind)) {
        _assertClass(account_kind, AccountKind);
        ptr0 = account_kind.__destroy_into_raw();
    }
    const ret = wasm.createMultisigAddress(minimum_signatures, keys, network_type, isLikeNone(ecdsa) ? 0xFFFFFF : ecdsa ? 1 : 0, ptr0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Address.__wrap(ret[0]);
}

/**
 * Create a basic transaction without any mass limit checks.
 * @category Wallet SDK
 * @param {IUtxoEntry[]} utxo_entry_source
 * @param {IPaymentOutput[]} outputs
 * @param {bigint} priority_fee
 * @param {HexString | Uint8Array | null} [payload]
 * @param {number | null} [sig_op_count]
 * @returns {Transaction}
 */
export function createTransaction(utxo_entry_source, outputs, priority_fee, payload, sig_op_count) {
    const ret = wasm.createTransaction(utxo_entry_source, outputs, priority_fee, isLikeNone(payload) ? 0 : addToExternrefTable0(payload), isLikeNone(sig_op_count) ? 0xFFFFFF : sig_op_count);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Transaction.__wrap(ret[0]);
}

/**
 * Helper function that creates a set of transactions using the transaction {@link Generator}.
 * @see {@link IGeneratorSettingsObject}, {@link Generator}, {@link estimateTransactions}
 * @category Wallet SDK
 * @param {IGeneratorSettingsObject} settings
 * @returns {Promise<ICreateTransactions>}
 */
export function createTransactions(settings) {
    const ret = wasm.createTransactions(settings);
    return ret;
}

/**
 * Helper function that creates an estimate using the transaction {@link Generator}
 * by producing only the {@link GeneratorSummary} containing the estimate.
 * @see {@link IGeneratorSettingsObject}, {@link Generator}, {@link createTransactions}
 * @category Wallet SDK
 * @param {IGeneratorSettingsObject} settings
 * @returns {Promise<GeneratorSummary>}
 */
export function estimateTransactions(settings) {
    const ret = wasm.estimateTransactions(settings);
    return ret;
}

/**
 * `calculateTransactionFee()` returns minimum fees needed for the transaction to be
 * accepted by the network. If the transaction is invalid or the mass can not be calculated,
 * the function throws an error. If the mass exceeds the maximum standard transaction mass,
 * the function returns `undefined`.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @see {@link calculateTransactionMass}
 * @see {@link updateTransactionMass}
 * @param {NetworkId | string} network_id
 * @param {ITransaction | Transaction} tx
 * @param {number | null} [minimum_signatures]
 * @returns {bigint | undefined}
 */
export function calculateTransactionFee(network_id, tx, minimum_signatures) {
    const ret = wasm.calculateTransactionFee(network_id, tx, isLikeNone(minimum_signatures) ? 0xFFFFFF : minimum_signatures);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
}

/**
 * `updateTransactionMass()` updates the mass property of the passed transaction.
 * If the transaction is invalid, the function throws an error.
 *
 * The function returns `true` if the mass is within the maximum standard transaction mass and
 * the transaction mass is updated. Otherwise, the function returns `false`.
 *
 * This is similar to `calculateTransactionMass()` but modifies the supplied
 * `Transaction` object.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @see {@link calculateTransactionMass}
 * @see {@link calculateTransactionFee}
 * @param {NetworkId | string} network_id
 * @param {Transaction} tx
 * @param {number | null} [minimum_signatures]
 * @returns {boolean}
 */
export function updateTransactionMass(network_id, tx, minimum_signatures) {
    _assertClass(tx, Transaction);
    const ret = wasm.updateTransactionMass(network_id, tx.__wbg_ptr, isLikeNone(minimum_signatures) ? 0xFFFFFF : minimum_signatures);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * `calculateTransactionMass()` returns the mass of the passed transaction.
 * If the transaction is invalid, or the mass can not be calculated
 * the function throws an error.
 *
 * The mass value must not exceed the maximum standard transaction mass
 * that can be obtained using `maximumStandardTransactionMass()`.
 *
 * @category Wallet SDK
 * @see {@link maximumStandardTransactionMass}
 * @param {NetworkId | string} network_id
 * @param {ITransaction | Transaction} tx
 * @param {number | null} [minimum_signatures]
 * @returns {bigint}
 */
export function calculateTransactionMass(network_id, tx, minimum_signatures) {
    const ret = wasm.calculateTransactionMass(network_id, tx, isLikeNone(minimum_signatures) ? 0xFFFFFF : minimum_signatures);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
}

/**
 * `maximumStandardTransactionMass()` returns the maximum transaction
 * size allowed by the network.
 *
 * @category Wallet SDK
 * @see {@link calculateTransactionMass}
 * @see {@link updateTransactionMass}
 * @see {@link calculateTransactionFee}
 * @returns {bigint}
 */
export function maximumStandardTransactionMass() {
    const ret = wasm.maximumStandardTransactionMass();
    return BigInt.asUintN(64, ret);
}

/**
 *
 * Convert Sau to a string representation of the amount in Tondi.
 *
 * @category Wallet SDK
 * @param {bigint | number | HexString} sau
 * @returns {string}
 */
export function sauToTondiString(sau) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sauToTondiString(sau);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Convert a Tondi string to Sau represented by bigint.
 * This function provides correct precision handling and
 * can be used to parse user input.
 * @category Wallet SDK
 * @param {string} tondi
 * @returns {bigint | undefined}
 */
export function tondiToSau(tondi) {
    const ptr0 = passStringToWasm0(tondi, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.tondiToSau(ptr0, len0);
    return ret;
}

/**
 *
 * Format a Sau amount to a string representation of the amount in Tondi with a suffix
 * based on the network type (e.g. `TND` for mainnet, `TTONDI` for testnet,
 * `STONDI` for simnet, `DTONDI` for devnet).
 *
 * @category Wallet SDK
 * @param {bigint | number | HexString} sau
 * @param {NetworkType | NetworkId | string} network
 * @returns {string}
 */
export function sauToTondiStringWithSuffix(sau, network) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sauToTondiStringWithSuffix(sau, network);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * WASM32 binding for `encryptXChaCha20Poly1305` function.
 * @returns The encrypted text as a base64 string.
 * @category Encryption
 * @param {string} plainText
 * @param {string} password
 * @returns {string}
 */
export function encryptXChaCha20Poly1305(plainText, password) {
    let deferred4_0;
    let deferred4_1;
    try {
        const ptr0 = passStringToWasm0(plainText, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.encryptXChaCha20Poly1305(ptr0, len0, ptr1, len1);
        var ptr3 = ret[0];
        var len3 = ret[1];
        if (ret[3]) {
            ptr3 = 0; len3 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
 * WASM32 binding for `BLAKE3d` hash function.
 * @param {string} text - The text string to hash.
 * @category Encryption
 * @param {string} text
 * @returns {HexString}
 */
export function blake3dFromText(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.blake3dFromText(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * WASM32 binding for `decryptXChaCha20Poly1305` function.
 * @category Encryption
 * @param {string} base64string
 * @param {string} password
 * @returns {string}
 */
export function decryptXChaCha20Poly1305(base64string, password) {
    let deferred4_0;
    let deferred4_1;
    try {
        const ptr0 = passStringToWasm0(base64string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.decryptXChaCha20Poly1305(ptr0, len0, ptr1, len1);
        var ptr3 = ret[0];
        var len3 = ret[1];
        if (ret[3]) {
            ptr3 = 0; len3 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
 * WASM32 binding for `BLAKE3d` hash function.
 * @param data - The data to hash ({@link HexString} or Uint8Array).
 * @category Encryption
 * @param {HexString | Uint8Array} data
 * @returns {HexString}
 */
export function blake3dFromBinary(data) {
    const ret = wasm.blake3dFromBinary(data);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * WASM32 binding for `BLAKE3` hash function.
 * @param data - The data to hash ({@link HexString} or Uint8Array).
 * @category Encryption
 * @param {HexString | Uint8Array} data
 * @returns {HexString}
 */
export function blake3FromBinary(data) {
    const ret = wasm.blake3FromBinary(data);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * WASM32 binding for `BLAKE3` hash function.
 * @param {string} text - The text string to hash.
 * @category Encryption
 * @param {string} text
 * @returns {HexString}
 */
export function blake3FromText(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.blake3FromText(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * WASM32 binding for `argon2blake3iv` hash function.
 * @param text - The text string to hash.
 * @category Encryption
 * @param {string} text
 * @param {number} byteLength
 * @returns {HexString}
 */
export function argon2blake3ivFromText(text, byteLength) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.argon2blake3ivFromText(ptr0, len0, byteLength);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * WASM32 binding for `argon2blake3iv` hash function.
 * @param data - The data to hash ({@link HexString} or Uint8Array).
 * @category Encryption
 * @param {HexString | Uint8Array} data
 * @param {number} hashLength
 * @returns {HexString}
 */
export function argon2blake3ivFromBinary(data, hashLength) {
    const ret = wasm.argon2blake3ivFromBinary(data, hashLength);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * `signTransaction()` is a helper function to sign a transaction using a private key array or a signer array.
 * @category Wallet SDK
 * @param {Transaction} tx
 * @param {(PrivateKey | HexString | Uint8Array)[]} signer
 * @param {boolean} verify_sig
 * @returns {Transaction}
 */
export function signTransaction(tx, signer, verify_sig) {
    _assertClass(tx, Transaction);
    const ret = wasm.signTransaction(tx.__wbg_ptr, signer, verify_sig);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Transaction.__wrap(ret[0]);
}

/**
 * `createInputSignature()` is a helper function to sign a transaction input with a specific SigHash type using a private key.
 * @category Wallet SDK
 * @param {Transaction} tx
 * @param {number} input_index
 * @param {PrivateKey} private_key
 * @param {SighashType | null} [sighash_type]
 * @returns {HexString}
 */
export function createInputSignature(tx, input_index, private_key, sighash_type) {
    _assertClass(tx, Transaction);
    _assertClass(private_key, PrivateKey);
    const ret = wasm.createInputSignature(tx.__wbg_ptr, input_index, private_key.__wbg_ptr, isLikeNone(sighash_type) ? 6 : sighash_type);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @category Wallet SDK
 * @param {any} script_hash
 * @param {PrivateKey} privkey
 * @returns {string}
 */
export function signScriptHash(script_hash, privkey) {
    let deferred2_0;
    let deferred2_1;
    try {
        _assertClass(privkey, PrivateKey);
        const ret = wasm.signScriptHash(script_hash, privkey.__wbg_ptr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Set a custom storage folder for the wallet SDK
 * subsystem.  Encrypted wallet files and transaction
 * data will be stored in this folder. If not set
 * the storage folder will default to `~/.tondi`
 * (note that the folder is hidden).
 *
 * This must be called before using any other wallet
 * SDK functions.
 *
 * NOTE: This function will create a folder if it
 * doesn't exist. This function will have no effect
 * if invoked in the browser environment.
 *
 * @param {String} folder - the path to the storage folder
 *
 * @category Wallet API
 */
export function setDefaultStorageFolder(folder) {
    const ptr0 = passStringToWasm0(folder, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.setDefaultStorageFolder(ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Set the name of the default wallet file name
 * or the `localStorage` key.  If `Wallet::open`
 * is called without a wallet file name, this name
 * will be used.  Please note that this name
 * will be suffixed with `.wallet` suffix.
 *
 * This function should be called before using any
 * other wallet SDK functions.
 *
 * @param {String} folder - the name to the wallet file or key.
 *
 * @category Wallet API
 * @param {string} folder
 */
export function setDefaultWalletFile(folder) {
    const ptr0 = passStringToWasm0(folder, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.setDefaultWalletFile(ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * Returns true if the script passed is a pay-to-pubkey.
 * @param script - The script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} script
 * @returns {boolean}
 */
export function isScriptPayToPubkey(script) {
    const ret = wasm.isScriptPayToPubkey(script);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * Returns the address encoded in a script public key.
 * @param script_public_key - The script public key ({@link ScriptPublicKey}).
 * @param network - The network type.
 * @category Wallet SDK
 * @param {ScriptPublicKey | HexString} script_public_key
 * @param {NetworkType | NetworkId | string} network
 * @returns {Address | undefined}
 */
export function addressFromScriptPublicKey(script_public_key, network) {
    const ret = wasm.addressFromScriptPublicKey(script_public_key, network);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Returns returns true if the script passed is an ECDSA pay-to-pubkey.
 * @param script - The script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} script
 * @returns {boolean}
 */
export function isScriptPayToPubkeyECDSA(script) {
    const ret = wasm.isScriptPayToPubkeyECDSA(script);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * Takes a script and returns an equivalent pay-to-script-hash script.
 * @param redeem_script - The redeem script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} redeem_script
 * @returns {ScriptPublicKey}
 */
export function payToScriptHashScript(redeem_script) {
    const ret = wasm.payToScriptHashScript(redeem_script);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ScriptPublicKey.__wrap(ret[0]);
}

/**
 * Creates a new script to pay a transaction output to the specified address.
 * @category Wallet SDK
 * @param {Address | string} address
 * @returns {ScriptPublicKey}
 */
export function payToAddressScript(address) {
    const ret = wasm.payToAddressScript(address);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ScriptPublicKey.__wrap(ret[0]);
}

/**
 * Returns true if the script passed is a pay-to-script-hash (P2SH) format, false otherwise.
 * @param script - The script ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} script
 * @returns {boolean}
 */
export function isScriptPayToScriptHash(script) {
    const ret = wasm.isScriptPayToScriptHash(script);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * Generates a signature script that fits a pay-to-script-hash script.
 * @param redeem_script - The redeem script ({@link HexString} or Uint8Array).
 * @param signature - The signature ({@link HexString} or Uint8Array).
 * @category Wallet SDK
 * @param {HexString | Uint8Array} redeem_script
 * @param {HexString | Uint8Array} signature
 * @returns {HexString}
 */
export function payToScriptHashSignatureScript(redeem_script, signature) {
    const ret = wasm.payToScriptHashSignatureScript(redeem_script, signature);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Configuration for the WASM32 bindings runtime interface.
 * @see {@link IWASM32BindingsConfig}
 * @category General
 * @param {IWASM32BindingsConfig} config
 */
export function initWASM32Bindings(config) {
    const ret = wasm.initWASM32Bindings(config);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Initialize Rust panic handler in console mode.
 *
 * This will output additional debug information during a panic to the console.
 * This function should be called right after loading WASM libraries.
 * @category General
 */
export function initConsolePanicHook() {
    wasm.initConsolePanicHook();
}

/**
 * Initialize Rust panic handler in browser mode.
 *
 * This will output additional debug information during a panic in the browser
 * by creating a full-screen `DIV`. This is useful on mobile devices or where
 * the user otherwise has no access to console/developer tools. Use
 * {@link presentPanicHookLogs} to activate the panic logs in the
 * browser environment.
 * @see {@link presentPanicHookLogs}
 * @category General
 */
export function initBrowserPanicHook() {
    wasm.initBrowserPanicHook();
}

/**
 * Present panic logs to the user in the browser.
 *
 * This function should be called after a panic has occurred and the
 * browser-based panic hook has been activated. It will present the
 * collected panic logs in a full-screen `DIV` in the browser.
 * @see {@link initBrowserPanicHook}
 * @category General
 */
export function presentPanicHookLogs() {
    wasm.presentPanicHookLogs();
}

/**
 * r" Deferred promise - an object that has `resolve()` and `reject()`
 * r" functions that can be called outside of the promise body.
 * r" WARNING: This function uses `eval` and can not be used in environments
 * r" where dynamically-created code can not be executed such as web browser
 * r" extensions.
 * r" @category General
 * @returns {Promise<any>}
 */
export function defer() {
    const ret = wasm.defer();
    return ret;
}

/**
 * Set the logger log level using a string representation.
 * Available variants are: 'off', 'error', 'warn', 'info', 'debug', 'trace'
 * @category General
 * @param {"off" | "error" | "warn" | "info" | "debug" | "trace"} level
 */
export function setLogLevel(level) {
    wasm.setLogLevel(level);
}

function __wbg_adapter_60(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__hd4355f60e06b65cb(arg0, arg1);
}

function __wbg_adapter_63(arg0, arg1, arg2) {
    wasm.closure2393_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_66(arg0, arg1) {
    const ret = wasm.wasm_bindgen__convert__closures_____invoke__h2eda5d7fd90dbd15_multivalue_shim(arg0, arg1);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function __wbg_adapter_69(arg0, arg1, arg2) {
    wasm.closure2392_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_72(arg0, arg1, arg2) {
    const ret = wasm.closure4086_externref_shim_multivalue_shim(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function __wbg_adapter_75(arg0, arg1, arg2) {
    wasm.closure5095_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_78(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__hb094ebce96709378(arg0, arg1);
}

function __wbg_adapter_81(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h6f6fb24602176a4d(arg0, arg1);
}

function __wbg_adapter_84(arg0, arg1, arg2) {
    wasm.closure6307_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_87(arg0, arg1, arg2) {
    wasm.closure6306_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_90(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__hc81dce32e6631683(arg0, arg1, arg2);
}

function __wbg_adapter_93(arg0, arg1, arg2) {
    wasm.closure11061_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_96(arg0, arg1, arg2, arg3) {
    const ret = wasm.closure11063_externref_shim(arg0, arg1, arg2, arg3);
    return ret;
}

function __wbg_adapter_99(arg0, arg1, arg2) {
    wasm.closure11157_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_102(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__hbb7d840bf2200fb7(arg0, arg1);
}

function __wbg_adapter_1650(arg0, arg1, arg2, arg3) {
    wasm.closure11198_externref_shim(arg0, arg1, arg2, arg3);
}

/**
 * @category Wallet API
 * @enum {0}
 */
export const AccountsDiscoveryKind = Object.freeze({
    Bip44: 0, "0": "Bip44",
});
/**
 *
 *  Tondi `Address` version (`PubKey`, `PubKey ECDSA`, `ScriptHash`, `Taproot`)
 *
 * @category Address
 * @enum {0 | 1 | 8 | 88}
 */
export const AddressVersion = Object.freeze({
    /**
     * PubKey addresses always have the version byte set to 0(0b00000_000)
     */
    PubKey: 0, "0": "PubKey",
    /**
     * PubKey ECDSA addresses always have the version byte set to 1(0b00000_001)
     */
    PubKeyECDSA: 1, "1": "PubKeyECDSA",
    /**
     * ScriptHash addresses always have the version byte set to 8(0b00001_000)
     */
    ScriptHash: 8, "8": "ScriptHash",
    /**
     * Taproot addresses always have the version byte set to 88(0b01011_000)
     * Bech32 codec encode initial 5 bit `0b01011` to char 't'
     */
    Taproot: 88, "88": "Taproot",
});
/**
 * `ConnectionStrategy` specifies how the WebSocket `async fn connect()`
 * function should behave during the first-time connectivity phase.
 * @category WebSocket
 * @enum {0 | 1}
 */
export const ConnectStrategy = Object.freeze({
    /**
     * Continuously attempt to connect to the server. This behavior will
     * block `connect()` function until the connection is established.
     */
    Retry: 0, "0": "Retry",
    /**
     * Causes `connect()` to return immediately if the first-time connection
     * has failed.
     */
    Fallback: 1, "1": "Fallback",
});
/**
 * wRPC protocol encoding: `Borsh` or `JSON`
 * @category Transport
 * @enum {0 | 1}
 */
export const Encoding = Object.freeze({
    Borsh: 0, "0": "Borsh",
    SerdeJson: 1, "1": "SerdeJson",
});
/**
 *
 * @see {@link IFees}, {@link IGeneratorSettingsObject}, {@link Generator}, {@link estimateTransactions}, {@link createTransactions}
 * @category Wallet SDK
 * @enum {0 | 1}
 */
export const FeeSource = Object.freeze({
    SenderPays: 0, "0": "SenderPays",
    ReceiverPays: 1, "1": "ReceiverPays",
});
/**
 *
 * Languages supported by BIP39.
 *
 * Presently only English is specified by the BIP39 standard.
 *
 * @see {@link Mnemonic}
 *
 * @category Wallet SDK
 * @enum {0}
 */
export const Language = Object.freeze({
    /**
     * English is presently the only supported language
     */
    English: 0, "0": "English",
});
/**
 * @category Consensus
 * @enum {0 | 1 | 2 | 3}
 */
export const NetworkType = Object.freeze({
    Mainnet: 0, "0": "Mainnet",
    Testnet: 1, "1": "Testnet",
    Devnet: 2, "2": "Devnet",
    Simnet: 3, "3": "Simnet",
});
/**
 * Specifies the type of an account address to create.
 * The address can bea receive address or a change address.
 *
 * @category Wallet API
 * @enum {0 | 1}
 */
export const NewAddressKind = Object.freeze({
    Receive: 0, "0": "Receive",
    Change: 1, "1": "Change",
});
/**
 * Tondi Sighash types allowed by consensus
 * @category Consensus
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const SighashType = Object.freeze({
    All: 0, "0": "All",
    None: 1, "1": "None",
    Single: 2, "2": "Single",
    AllAnyOneCanPay: 3, "3": "AllAnyOneCanPay",
    NoneAnyOneCanPay: 4, "4": "NoneAnyOneCanPay",
    SingleAnyOneCanPay: 5, "5": "SingleAnyOneCanPay",
});

const __wbindgen_enum_BinaryType = ["blob", "arraybuffer"];

const __wbindgen_enum_IdbCursorDirection = ["next", "nextunique", "prev", "prevunique"];

const __wbindgen_enum_IdbRequestReadyState = ["pending", "done"];

const __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];

const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

const __wbindgen_enum_VisibilityState = ["hidden", "visible"];

const AbortableFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_abortable_free(ptr >>> 0, 1));
/**
 *
 * Abortable trigger wraps an `Arc<AtomicBool>`, which can be cloned
 * to signal task terminating using an atomic bool.
 *
 * ```text
 * let abortable = Abortable::default();
 * let result = my_task(abortable).await?;
 * // ... elsewhere
 * abortable.abort();
 * ```
 *
 * @category General
 */
export class Abortable {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AbortableFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_abortable_free(ptr, 0);
    }
    check() {
        const ret = wasm.abortable_check(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {boolean}
     */
    isAborted() {
        const ret = wasm.abortable_isAborted(this.__wbg_ptr);
        return ret !== 0;
    }
    abort() {
        wasm.abortable_abort(this.__wbg_ptr);
    }
    reset() {
        wasm.abortable_reset(this.__wbg_ptr);
    }
    constructor() {
        const ret = wasm.abortable_new();
        this.__wbg_ptr = ret >>> 0;
        AbortableFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const AbortedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_aborted_free(ptr >>> 0, 1));
/**
 * Error emitted by [`Abortable`].
 * @category General
 */
export class Aborted {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Aborted.prototype);
        obj.__wbg_ptr = ptr;
        AbortedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AbortedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_aborted_free(ptr, 0);
    }
}

const AccountKindFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_accountkind_free(ptr >>> 0, 1));
/**
 *
 * Account kind is a string signature that represents an account type.
 * Account kind is used to identify the account type during
 * serialization, deserialization and various API calls.
 *
 * @category Wallet SDK
 */
export class AccountKind {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AccountKind.prototype);
        obj.__wbg_ptr = ptr;
        AccountKindFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AccountKindFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_accountkind_free(ptr, 0);
    }
    /**
     * @param {string} kind
     */
    constructor(kind) {
        const ptr0 = passStringToWasm0(kind, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.accountkind_ctor(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AccountKindFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.accountkind_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const AddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_address_free(ptr >>> 0, 1));
/**
 * Tondi [`Address`] struct that serializes to and from an address format string: `tondi:qz0s...t8cv`.
 *
 * @category Address
 */
export class Address {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Address.prototype);
        obj.__wbg_ptr = ptr;
        AddressFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            payload: this.payload,
            version: this.version,
            prefix: this.prefix,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get payload() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.address_payload(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.address_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} n
     * @returns {string}
     */
    short(n) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.address_short(this.__wbg_ptr, n);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Convert an address to a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.address_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} address
     */
    constructor(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.address_constructor(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        AddressFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} address
     * @returns {boolean}
     */
    static validate(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.address_validate(ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} prefix
     */
    set setPrefix(prefix) {
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.address_set_setPrefix(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get prefix() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.address_prefix(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const AgentConstructorOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_agentconstructoroptions_free(ptr >>> 0, 1));

export class AgentConstructorOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AgentConstructorOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_agentconstructoroptions_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get keep_alive_msecs() {
        const ret = wasm.agentconstructoroptions_keep_alive_msecs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get timeout() {
        const ret = wasm.agentconstructoroptions_timeout(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set keep_alive_msecs(value) {
        wasm.agentconstructoroptions_set_keep_alive_msecs(this.__wbg_ptr, value);
    }
    /**
     * @param {boolean} value
     */
    set keep_alive(value) {
        wasm.agentconstructoroptions_set_keep_alive(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set max_free_sockets(value) {
        wasm.agentconstructoroptions_set_max_free_sockets(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set timeout(value) {
        wasm.agentconstructoroptions_set_timeout(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set max_sockets(value) {
        wasm.agentconstructoroptions_set_max_sockets(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get keep_alive() {
        const ret = wasm.agentconstructoroptions_keep_alive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get max_free_sockets() {
        const ret = wasm.agentconstructoroptions_max_free_sockets(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get max_sockets() {
        const ret = wasm.agentconstructoroptions_max_sockets(this.__wbg_ptr);
        return ret;
    }
}

const AppendFileOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_appendfileoptions_free(ptr >>> 0, 1));

export class AppendFileOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AppendFileOptions.prototype);
        obj.__wbg_ptr = ptr;
        AppendFileOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AppendFileOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_appendfileoptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.appendfileoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.appendfileoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.appendfileoptions_encoding(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [encoding]
     * @param {number | null} [mode]
     * @param {string | null} [flag]
     */
    constructor(encoding, mode, flag) {
        const ret = wasm.appendfileoptions_new_with_values(isLikeNone(encoding) ? 0 : addToExternrefTable0(encoding), isLikeNone(mode) ? 0x100000001 : (mode) >>> 0, isLikeNone(flag) ? 0 : addToExternrefTable0(flag));
        this.__wbg_ptr = ret >>> 0;
        AppendFileOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {AppendFileOptions}
     */
    static new() {
        const ret = wasm.appendfileoptions_new();
        return AppendFileOptions.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get flag() {
        const ret = wasm.appendfileoptions_flag(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [value]
     */
    set flag(value) {
        wasm.appendfileoptions_set_flag(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.appendfileoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
}

const AssertionErrorOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assertionerroroptions_free(ptr >>> 0, 1));

export class AssertionErrorOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssertionErrorOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assertionerroroptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [value]
     */
    set message(value) {
        wasm.assertionerroroptions_set_message(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * The expected property on the error instance.
     * @returns {any}
     */
    get expected() {
        const ret = wasm.assertionerroroptions_expected(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} value
     */
    set operator(value) {
        wasm.assertionerroroptions_set_operator(this.__wbg_ptr, value);
    }
    /**
     * The actual property on the error instance.
     * @returns {any}
     */
    get actual() {
        const ret = wasm.assertionerroroptions_actual(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null | undefined} message
     * @param {any} actual
     * @param {any} expected
     * @param {string} operator
     */
    constructor(message, actual, expected, operator) {
        const ret = wasm.assertionerroroptions_new(isLikeNone(message) ? 0 : addToExternrefTable0(message), actual, expected, operator);
        this.__wbg_ptr = ret >>> 0;
        AssertionErrorOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * If provided, the error message is set to this value.
     * @returns {string | undefined}
     */
    get message() {
        const ret = wasm.assertionerroroptions_message(this.__wbg_ptr);
        return ret;
    }
    /**
     * The operator property on the error instance.
     * @returns {string}
     */
    get operator() {
        const ret = wasm.assertionerroroptions_operator(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} value
     */
    set expected(value) {
        wasm.assertionerroroptions_set_expected(this.__wbg_ptr, value);
    }
    /**
     * @param {any} value
     */
    set actual(value) {
        wasm.assertionerroroptions_set_actual(this.__wbg_ptr, value);
    }
}

const BalanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balance_free(ptr >>> 0, 1));
/**
 *
 * Represents a {@link UtxoContext} (account) balance.
 *
 * @see {@link IBalance}, {@link UtxoContext}
 *
 * @category Wallet SDK
 */
export class Balance {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Balance.prototype);
        obj.__wbg_ptr = ptr;
        BalanceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balance_free(ptr, 0);
    }
    /**
     * Confirmed amount of funds available for spending.
     * @returns {bigint}
     */
    get mature() {
        const ret = wasm.balance_mature(this.__wbg_ptr);
        return ret;
    }
    /**
     * Amount of funds that are being send and are not yet accepted by the network.
     * @returns {bigint}
     */
    get outgoing() {
        const ret = wasm.balance_outgoing(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {NetworkType | NetworkId | string} network_type
     * @returns {BalanceStrings}
     */
    toBalanceStrings(network_type) {
        const ret = wasm.balance_toBalanceStrings(this.__wbg_ptr, network_type);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BalanceStrings.__wrap(ret[0]);
    }
    /**
     * Amount of funds that are being received and are not yet confirmed.
     * @returns {bigint}
     */
    get pending() {
        const ret = wasm.balance_pending(this.__wbg_ptr);
        return ret;
    }
}

const BalanceStringsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balancestrings_free(ptr >>> 0, 1));
/**
 *
 * Formatted string representation of the {@link Balance}.
 *
 * The value is formatted as `123,456.789`.
 *
 * @category Wallet SDK
 */
export class BalanceStrings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BalanceStrings.prototype);
        obj.__wbg_ptr = ptr;
        BalanceStringsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceStringsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balancestrings_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get mature() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.balancestrings_mature(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get pending() {
        const ret = wasm.balancestrings_pending(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}

const ConsoleConstructorOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_consoleconstructoroptions_free(ptr >>> 0, 1));

export class ConsoleConstructorOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ConsoleConstructorOptions.prototype);
        obj.__wbg_ptr = ptr;
        ConsoleConstructorOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConsoleConstructorOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_consoleconstructoroptions_free(ptr, 0);
    }
    /**
     * @param {any} value
     */
    set stdout(value) {
        wasm.consoleconstructoroptions_set_stdout(this.__wbg_ptr, value);
    }
    /**
     * @param {any} value
     */
    set color_mod(value) {
        wasm.consoleconstructoroptions_set_color_mod(this.__wbg_ptr, value);
    }
    /**
     * @param {any} value
     */
    set stderr(value) {
        wasm.consoleconstructoroptions_set_stderr(this.__wbg_ptr, value);
    }
    /**
     * @returns {any}
     */
    get stdout() {
        const ret = wasm.consoleconstructoroptions_stdout(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} stdout
     * @param {any} stderr
     * @param {boolean | null | undefined} ignore_errors
     * @param {any} color_mod
     * @param {object | null} [inspect_options]
     */
    constructor(stdout, stderr, ignore_errors, color_mod, inspect_options) {
        const ret = wasm.consoleconstructoroptions_new_with_values(stdout, stderr, isLikeNone(ignore_errors) ? 0xFFFFFF : ignore_errors ? 1 : 0, color_mod, isLikeNone(inspect_options) ? 0 : addToExternrefTable0(inspect_options));
        this.__wbg_ptr = ret >>> 0;
        ConsoleConstructorOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get color_mod() {
        const ret = wasm.consoleconstructoroptions_color_mod(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean | undefined}
     */
    get ignore_errors() {
        const ret = wasm.consoleconstructoroptions_ignore_errors(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {any}
     */
    get stderr() {
        const ret = wasm.consoleconstructoroptions_stderr(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {object | undefined}
     */
    get inspect_options() {
        const ret = wasm.consoleconstructoroptions_inspect_options(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} stdout
     * @param {any} stderr
     * @returns {ConsoleConstructorOptions}
     */
    static new(stdout, stderr) {
        const ret = wasm.consoleconstructoroptions_new(stdout, stderr);
        return ConsoleConstructorOptions.__wrap(ret);
    }
    /**
     * @param {object | null} [value]
     */
    set inspect_options(value) {
        wasm.consoleconstructoroptions_set_inspect_options(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {boolean | null} [value]
     */
    set ignore_errors(value) {
        wasm.consoleconstructoroptions_set_ignore_errors(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
}

const CreateHookCallbacksFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_createhookcallbacks_free(ptr >>> 0, 1));

export class CreateHookCallbacks {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreateHookCallbacksFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_createhookcallbacks_free(ptr, 0);
    }
    /**
     * @returns {Function}
     */
    get destroy() {
        const ret = wasm.createhookcallbacks_destroy(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Function}
     */
    get promise_resolve() {
        const ret = wasm.createhookcallbacks_promise_resolve(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} value
     */
    set init(value) {
        wasm.createhookcallbacks_set_init(this.__wbg_ptr, value);
    }
    /**
     * @param {Function} value
     */
    set destroy(value) {
        wasm.createhookcallbacks_set_destroy(this.__wbg_ptr, value);
    }
    /**
     * @param {Function} value
     */
    set after(value) {
        wasm.createhookcallbacks_set_after(this.__wbg_ptr, value);
    }
    /**
     * @param {Function} value
     */
    set before(value) {
        wasm.createhookcallbacks_set_before(this.__wbg_ptr, value);
    }
    /**
     * @returns {Function}
     */
    get before() {
        const ret = wasm.createhookcallbacks_before(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Function}
     */
    get after() {
        const ret = wasm.createhookcallbacks_after(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Function}
     */
    get init() {
        const ret = wasm.createhookcallbacks_init(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} init
     * @param {Function} before
     * @param {Function} after
     * @param {Function} destroy
     * @param {Function} promise_resolve
     */
    constructor(init, before, after, destroy, promise_resolve) {
        const ret = wasm.createhookcallbacks_new(init, before, after, destroy, promise_resolve);
        this.__wbg_ptr = ret >>> 0;
        CreateHookCallbacksFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Function} value
     */
    set promise_resolve(value) {
        wasm.createhookcallbacks_set_promise_resolve(this.__wbg_ptr, value);
    }
}

const CreateReadStreamOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_createreadstreamoptions_free(ptr >>> 0, 1));

export class CreateReadStreamOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreateReadStreamOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_createreadstreamoptions_free(ptr, 0);
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.createreadstreamoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {number | undefined}
     */
    get end() {
        const ret = wasm.createreadstreamoptions_end(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {boolean | null} [value]
     */
    set emit_close(value) {
        wasm.createreadstreamoptions_set_emit_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.createreadstreamoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {string | undefined}
     */
    get flags() {
        const ret = wasm.createreadstreamoptions_flags(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number | null} [value]
     */
    set fd(value) {
        wasm.createreadstreamoptions_set_fd(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {number | undefined}
     */
    get fd() {
        const ret = wasm.createreadstreamoptions_fd(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean | undefined}
     */
    get emit_close() {
        const ret = wasm.createreadstreamoptions_emit_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {number | null} [value]
     */
    set start(value) {
        wasm.createreadstreamoptions_set_start(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
    /**
     * @param {number | null} [value]
     */
    set end(value) {
        wasm.createreadstreamoptions_set_end(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
    /**
     * @returns {number | undefined}
     */
    get start() {
        const ret = wasm.createreadstreamoptions_start(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {boolean | null} [auto_close]
     * @param {boolean | null} [emit_close]
     * @param {string | null} [encoding]
     * @param {number | null} [end]
     * @param {number | null} [fd]
     * @param {string | null} [flags]
     * @param {number | null} [high_water_mark]
     * @param {number | null} [mode]
     * @param {number | null} [start]
     */
    constructor(auto_close, emit_close, encoding, end, fd, flags, high_water_mark, mode, start) {
        const ret = wasm.createreadstreamoptions_new_with_values(isLikeNone(auto_close) ? 0xFFFFFF : auto_close ? 1 : 0, isLikeNone(emit_close) ? 0xFFFFFF : emit_close ? 1 : 0, isLikeNone(encoding) ? 0 : addToExternrefTable0(encoding), !isLikeNone(end), isLikeNone(end) ? 0 : end, isLikeNone(fd) ? 0x100000001 : (fd) >>> 0, isLikeNone(flags) ? 0 : addToExternrefTable0(flags), !isLikeNone(high_water_mark), isLikeNone(high_water_mark) ? 0 : high_water_mark, isLikeNone(mode) ? 0x100000001 : (mode) >>> 0, !isLikeNone(start), isLikeNone(start) ? 0 : start);
        this.__wbg_ptr = ret >>> 0;
        CreateReadStreamOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string | null} [value]
     */
    set flags(value) {
        wasm.createreadstreamoptions_set_flags(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {number | null} [value]
     */
    set high_water_mark(value) {
        wasm.createreadstreamoptions_set_high_water_mark(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
    /**
     * @returns {number | undefined}
     */
    get high_water_mark() {
        const ret = wasm.createreadstreamoptions_high_water_mark(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {boolean | null} [value]
     */
    set auto_close(value) {
        wasm.createreadstreamoptions_set_auto_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get auto_close() {
        const ret = wasm.createreadstreamoptions_auto_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.createreadstreamoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.createreadstreamoptions_encoding(this.__wbg_ptr);
        return ret;
    }
}

const CreateWriteStreamOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_createwritestreamoptions_free(ptr >>> 0, 1));

export class CreateWriteStreamOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CreateWriteStreamOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_createwritestreamoptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [auto_close]
     * @param {boolean | null} [emit_close]
     * @param {string | null} [encoding]
     * @param {number | null} [fd]
     * @param {string | null} [flags]
     * @param {number | null} [mode]
     * @param {number | null} [start]
     */
    constructor(auto_close, emit_close, encoding, fd, flags, mode, start) {
        const ret = wasm.createwritestreamoptions_new_with_values(isLikeNone(auto_close) ? 0xFFFFFF : auto_close ? 1 : 0, isLikeNone(emit_close) ? 0xFFFFFF : emit_close ? 1 : 0, isLikeNone(encoding) ? 0 : addToExternrefTable0(encoding), isLikeNone(fd) ? 0x100000001 : (fd) >>> 0, isLikeNone(flags) ? 0 : addToExternrefTable0(flags), isLikeNone(mode) ? 0x100000001 : (mode) >>> 0, !isLikeNone(start), isLikeNone(start) ? 0 : start);
        this.__wbg_ptr = ret >>> 0;
        CreateWriteStreamOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [value]
     */
    set emit_close(value) {
        wasm.createwritestreamoptions_set_emit_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {number | undefined}
     */
    get start() {
        const ret = wasm.createwritestreamoptions_start(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {boolean | null} [value]
     */
    set auto_close(value) {
        wasm.createwritestreamoptions_set_auto_close(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @param {string | null} [value]
     */
    set flags(value) {
        wasm.createwritestreamoptions_set_flags(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {string | undefined}
     */
    get flags() {
        const ret = wasm.createwritestreamoptions_flags(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.createwritestreamoptions_encoding(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.createwritestreamoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {number | undefined}
     */
    get fd() {
        const ret = wasm.createwritestreamoptions_fd(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.createwritestreamoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean | undefined}
     */
    get auto_close() {
        const ret = wasm.createwritestreamoptions_auto_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {boolean | undefined}
     */
    get emit_close() {
        const ret = wasm.createwritestreamoptions_emit_close(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {number | null} [value]
     */
    set start(value) {
        wasm.createwritestreamoptions_set_start(this.__wbg_ptr, !isLikeNone(value), isLikeNone(value) ? 0 : value);
    }
    /**
     * @param {number | null} [value]
     */
    set fd(value) {
        wasm.createwritestreamoptions_set_fd(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.createwritestreamoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
}

const CryptoBoxFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptobox_free(ptr >>> 0, 1));
/**
 *
 * CryptoBox allows for encrypting and decrypting messages using the `crypto_box` crate.
 *
 * <https://docs.rs/crypto_box/0.9.1/crypto_box/>
 *
 *  @category Wallet SDK
 */
export class CryptoBox {

    toJSON() {
        return {
            publicKey: this.publicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptobox_free(ptr, 0);
    }
    /**
     * @param {string} base64string
     * @returns {string}
     */
    decrypt(base64string) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(base64string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.cryptobox_decrypt(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @param {CryptoBoxPrivateKey | HexString | Uint8Array} secretKey
     * @param {CryptoBoxPublicKey | HexString | Uint8Array} peerPublicKey
     */
    constructor(secretKey, peerPublicKey) {
        const ret = wasm.cryptobox_ctor(secretKey, peerPublicKey);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CryptoBoxFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} plaintext
     * @returns {string}
     */
    encrypt(plaintext) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(plaintext, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.cryptobox_encrypt(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get publicKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.cryptobox_publicKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const CryptoBoxPrivateKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptoboxprivatekey_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class CryptoBoxPrivateKey {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxPrivateKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptoboxprivatekey_free(ptr, 0);
    }
    /**
     * @returns {CryptoBoxPublicKey}
     */
    to_public_key() {
        const ret = wasm.cryptoboxprivatekey_to_public_key(this.__wbg_ptr);
        return CryptoBoxPublicKey.__wrap(ret);
    }
    /**
     * @param {HexString | Uint8Array} secretKey
     */
    constructor(secretKey) {
        const ret = wasm.cryptoboxprivatekey_ctor(secretKey);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CryptoBoxPrivateKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const CryptoBoxPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptoboxpublickey_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class CryptoBoxPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CryptoBoxPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        CryptoBoxPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptoboxpublickey_free(ptr, 0);
    }
    /**
     * @param {HexString | Uint8Array} publicKey
     */
    constructor(publicKey) {
        const ret = wasm.cryptoboxpublickey_ctor(publicKey);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CryptoBoxPublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.cryptoboxpublickey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const DerivationPathFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_derivationpath_free(ptr >>> 0, 1));
/**
 *
 * Key derivation path
 *
 * @category Wallet SDK
 */
export class DerivationPath {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DerivationPath.prototype);
        obj.__wbg_ptr = ptr;
        DerivationPathFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DerivationPathFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_derivationpath_free(ptr, 0);
    }
    /**
     * Is this derivation path empty? (i.e. the root)
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.derivationpath_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.derivationpath_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} path
     */
    constructor(path) {
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.derivationpath_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DerivationPathFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Push a [`ChildNumber`] onto an existing derivation path.
     * @param {number} child_number
     * @param {boolean | null} [hardened]
     */
    push(child_number, hardened) {
        const ret = wasm.derivationpath_push(this.__wbg_ptr, child_number, isLikeNone(hardened) ? 0xFFFFFF : hardened ? 1 : 0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Get the parent [`DerivationPath`] for the current one.
     *
     * Returns `Undefined` if this is already the root path.
     * @returns {DerivationPath | undefined}
     */
    parent() {
        const ret = wasm.derivationpath_parent(this.__wbg_ptr);
        return ret === 0 ? undefined : DerivationPath.__wrap(ret);
    }
    /**
     * Get the count of [`ChildNumber`] values in this derivation path.
     * @returns {number}
     */
    length() {
        const ret = wasm.derivationpath_length(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const FormatInputPathObjectFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_formatinputpathobject_free(ptr >>> 0, 1));

export class FormatInputPathObject {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FormatInputPathObject.prototype);
        obj.__wbg_ptr = ptr;
        FormatInputPathObjectFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FormatInputPathObjectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_formatinputpathobject_free(ptr, 0);
    }
    /**
     * @param {string | null} [value]
     */
    set name(value) {
        wasm.formatinputpathobject_set_name(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {string | null} [value]
     */
    set dir(value) {
        wasm.formatinputpathobject_set_dir(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {string | undefined}
     */
    get dir() {
        const ret = wasm.formatinputpathobject_dir(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [base]
     * @param {string | null} [dir]
     * @param {string | null} [ext]
     * @param {string | null} [name]
     * @param {string | null} [root]
     */
    constructor(base, dir, ext, name, root) {
        const ret = wasm.formatinputpathobject_new_with_values(isLikeNone(base) ? 0 : addToExternrefTable0(base), isLikeNone(dir) ? 0 : addToExternrefTable0(dir), isLikeNone(ext) ? 0 : addToExternrefTable0(ext), isLikeNone(name) ? 0 : addToExternrefTable0(name), isLikeNone(root) ? 0 : addToExternrefTable0(root));
        this.__wbg_ptr = ret >>> 0;
        FormatInputPathObjectFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string | undefined}
     */
    get root() {
        const ret = wasm.formatinputpathobject_root(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get ext() {
        const ret = wasm.formatinputpathobject_ext(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [value]
     */
    set base(value) {
        wasm.formatinputpathobject_set_base(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {string | null} [value]
     */
    set root(value) {
        wasm.formatinputpathobject_set_root(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {string | null} [value]
     */
    set ext(value) {
        wasm.formatinputpathobject_set_ext(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {FormatInputPathObject}
     */
    static new() {
        const ret = wasm.formatinputpathobject_new();
        return FormatInputPathObject.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get base() {
        const ret = wasm.formatinputpathobject_base(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get name() {
        const ret = wasm.formatinputpathobject_name(this.__wbg_ptr);
        return ret;
    }
}

const GeneratorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_generator_free(ptr >>> 0, 1));
/**
 * Generator is a type capable of generating transactions based on a supplied
 * set of UTXO entries or a UTXO entry producer (such as {@link UtxoContext}). The Generator
 * accumulates UTXO entries until it can generate a transaction that meets the
 * requested amount or until the total mass of created inputs exceeds the allowed
 * transaction mass, at which point it will produce a compound transaction by forwarding
 * all selected UTXO entries to the supplied change address and prepare to start generating
 * a new transaction.  Such sequence of daisy-chained transactions is known as a "batch".
 * Each compound transaction results in a new UTXO, which is immediately reused in the
 * subsequent transaction.
 *
 * The Generator constructor accepts a single {@link IGeneratorSettingsObject} object.
 *
 * ```javascript
 *
 * let generator = new Generator({
 *     utxoEntries : [...],
 *     changeAddress : "tondi:...",
 *     outputs : [
 *         { amount : tondiToSau(10.0), address: "tondi:..."},
 *         { amount : tondiToSau(20.0), address: "tondi:..."},
 *         ...
 *     ],
 *     priorityFee : 1000n,
 * });
 *
 * let pendingTransaction;
 * while(pendingTransaction = await generator.next()) {
 *     await pendingTransaction.sign(privateKeys);
 *     await pendingTransaction.submit(rpc);
 * }
 *
 * let summary = generator.summary();
 * console.log(summary);
 *
 * ```
 * @see
 *     {@link IGeneratorSettingsObject},
 *     {@link PendingTransaction},
 *     {@link UtxoContext},
 *     {@link createTransactions},
 *     {@link estimateTransactions},
 * @category Wallet SDK
 */
export class Generator {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GeneratorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_generator_free(ptr, 0);
    }
    /**
     * @returns {Promise<GeneratorSummary>}
     */
    estimate() {
        const ret = wasm.generator_estimate(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {IGeneratorSettingsObject} args
     */
    constructor(args) {
        const ret = wasm.generator_ctor(args);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        GeneratorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {GeneratorSummary}
     */
    summary() {
        const ret = wasm.generator_summary(this.__wbg_ptr);
        return GeneratorSummary.__wrap(ret);
    }
    /**
     * Generate next transaction
     * @returns {Promise<any>}
     */
    next() {
        const ret = wasm.generator_next(this.__wbg_ptr);
        return ret;
    }
}

const GeneratorSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_generatorsummary_free(ptr >>> 0, 1));
/**
 *
 * A class containing a summary produced by transaction {@link Generator}.
 * This class contains the number of transactions, the aggregated fees,
 * the aggregated UTXOs and the final transaction amount that includes
 * both network and QoS (priority) fees.
 *
 * @see {@link createTransactions}, {@link IGeneratorSettingsObject}, {@link Generator}
 * @category Wallet SDK
 */
export class GeneratorSummary {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GeneratorSummary.prototype);
        obj.__wbg_ptr = ptr;
        GeneratorSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            finalAmount: this.finalAmount,
            networkType: this.networkType,
            utxos: this.utxos,
            fees: this.fees,
            finalTransactionId: this.finalTransactionId,
            transactions: this.transactions,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GeneratorSummaryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_generatorsummary_free(ptr, 0);
    }
    /**
     * @returns {bigint | undefined}
     */
    get finalAmount() {
        const ret = wasm.generatorsummary_finalAmount(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {NetworkType}
     */
    get networkType() {
        const ret = wasm.generatorsummary_networkType(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get utxos() {
        const ret = wasm.generatorsummary_utxos(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {bigint}
     */
    get fees() {
        const ret = wasm.generatorsummary_fees(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get finalTransactionId() {
        const ret = wasm.generatorsummary_finalTransactionId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {number}
     */
    get transactions() {
        const ret = wasm.generatorsummary_transactions(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const GetNameOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_getnameoptions_free(ptr >>> 0, 1));

export class GetNameOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GetNameOptions.prototype);
        obj.__wbg_ptr = ptr;
        GetNameOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GetNameOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_getnameoptions_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get local_address() {
        const ret = wasm.getnameoptions_local_address(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} value
     */
    set local_address(value) {
        wasm.getnameoptions_set_local_address(this.__wbg_ptr, value);
    }
    /**
     * @param {string} value
     */
    set host(value) {
        wasm.getnameoptions_set_host(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get port() {
        const ret = wasm.getnameoptions_port(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} value
     */
    set port(value) {
        wasm.getnameoptions_set_port(this.__wbg_ptr, value);
    }
    /**
     * @param {number | null} [value]
     */
    set family(value) {
        wasm.getnameoptions_set_family(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value);
    }
    /**
     * @returns {string}
     */
    get host() {
        const ret = wasm.getnameoptions_host(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number | null | undefined} family
     * @param {string} host
     * @param {string} local_address
     * @param {number} port
     * @returns {GetNameOptions}
     */
    static new(family, host, local_address, port) {
        const ret = wasm.getnameoptions_new(isLikeNone(family) ? 0xFFFFFF : family, host, local_address, port);
        return GetNameOptions.__wrap(ret);
    }
    /**
     * @returns {number | undefined}
     */
    get family() {
        const ret = wasm.getnameoptions_family(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret;
    }
}

const HashFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hash_free(ptr >>> 0, 1));
/**
 * @category General
 */
export class Hash {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Hash.prototype);
        obj.__wbg_ptr = ptr;
        HashFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hash_free(ptr, 0);
    }
    /**
     * @param {string} hex_str
     */
    constructor(hex_str) {
        const ptr0 = passStringToWasm0(hex_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hash_constructor(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        HashFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.hash_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const HeaderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_header_free(ptr >>> 0, 1));
/**
 * Tondi Block Header
 *
 * @category Consensus
 */
export class Header {

    toJSON() {
        return {
            daaScore: this.daaScore,
            parentsByLevel: this.parentsByLevel,
            bits: this.bits,
            blueWork: this.blueWork,
            nonce: this.nonce,
            version: this.version,
            timestamp: this.timestamp,
            pruningPoint: this.pruningPoint,
            hash: this.hash,
            hashMerkleRoot: this.hashMerkleRoot,
            blueScore: this.blueScore,
            utxoCommitment: this.utxoCommitment,
            acceptedIdMerkleRoot: this.acceptedIdMerkleRoot,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HeaderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_header_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get daaScore() {
        const ret = wasm.header_daa_score(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} nonce
     */
    set nonce(nonce) {
        wasm.header_set_nonce(this.__wbg_ptr, nonce);
    }
    /**
     * Finalizes the header and recomputes (updates) the header hash
     * @return { String } header hash
     * @returns {string}
     */
    finalize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_finalize(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Header | IHeader | IRawHeader} js_value
     */
    constructor(js_value) {
        const ret = wasm.header_constructor(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        HeaderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get parentsByLevel() {
        const ret = wasm.header_get_parents_by_level_as_js_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} bits
     */
    set bits(bits) {
        wasm.header_set_bits(this.__wbg_ptr, bits);
    }
    /**
     * @returns {number}
     */
    get bits() {
        const ret = wasm.header_bits(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {any} js_value
     */
    set parentsByLevel(js_value) {
        wasm.header_set_parents_by_level_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @returns {bigint}
     */
    get blueWork() {
        const ret = wasm.header_blue_work(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} js_value
     */
    set blueWork(js_value) {
        wasm.header_set_blue_work_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @param {bigint} daa_score
     */
    set daaScore(daa_score) {
        wasm.header_set_daa_score(this.__wbg_ptr, daa_score);
    }
    /**
     * @param {any} js_value
     */
    set hashMerkleRoot(js_value) {
        wasm.header_set_hash_merkle_root_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @returns {bigint}
     */
    get nonce() {
        const ret = wasm.header_nonce(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {number} version
     */
    set version(version) {
        wasm.header_set_version(this.__wbg_ptr, version);
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.header_get_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    get timestamp() {
        const ret = wasm.header_get_timestamp(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} blue_score
     */
    set blueScore(blue_score) {
        wasm.header_set_blue_score(this.__wbg_ptr, blue_score);
    }
    /**
     * @param {any} js_value
     */
    set pruningPoint(js_value) {
        wasm.header_set_pruning_point_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @returns {string}
     */
    get pruningPoint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_get_pruning_point_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set acceptedIdMerkleRoot(js_value) {
        wasm.header_set_accepted_id_merkle_root_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @returns {string}
     */
    get hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_get_hash_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get hashMerkleRoot() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_get_hash_merkle_root_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} js_value
     */
    set utxoCommitment(js_value) {
        wasm.header_set_utxo_commitment_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @returns {string}
     */
    getBlueWorkAsHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_getBlueWorkAsHex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get blueScore() {
        const ret = wasm.header_blue_score(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {string}
     */
    get utxoCommitment() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_get_utxo_commitment_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get acceptedIdMerkleRoot() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_get_accepted_id_merkle_root_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {bigint} timestamp
     */
    set timestamp(timestamp) {
        wasm.header_set_timestamp(this.__wbg_ptr, timestamp);
    }
    /**
     * Obtain `JSON` representation of the header. JSON representation
     * should be obtained using WASM, to ensure proper serialization of
     * big integers.
     * @returns {string}
     */
    asJSON() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.header_asJSON(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const KeypairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keypair_free(ptr >>> 0, 1));
/**
 * Data structure that contains a secret and public keys.
 * @category Wallet SDK
 */
export class Keypair {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Keypair.prototype);
        obj.__wbg_ptr = ptr;
        KeypairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            xOnlyPublicKey: this.xOnlyPublicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeypairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keypair_free(ptr, 0);
    }
    /**
     * Get the [`PrivateKey`] of this [`Keypair`].
     * @returns {string}
     */
    get privateKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.keypair_get_private_key(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Create a new random [`Keypair`].
     * JavaScript: `let keypair = Keypair::random();`.
     * @returns {Keypair}
     */
    static random() {
        const ret = wasm.keypair_random();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Keypair.__wrap(ret[0]);
    }
    /**
     * Get the [`PublicKey`] of this [`Keypair`].
     * @returns {string}
     */
    get publicKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.keypair_get_public_key(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the [`Address`] of this Keypair's [`PublicKey`].
     * Receives a [`NetworkType`](tondi_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = keypair.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        const ret = wasm.keypair_toAddress(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Get the `XOnlyPublicKey` of this [`Keypair`].
     * @returns {any}
     */
    get xOnlyPublicKey() {
        const ret = wasm.keypair_get_xonly_public_key(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new [`Keypair`] from a [`PrivateKey`].
     * JavaScript: `let privkey = new PrivateKey(hexString); let keypair = privkey.toKeypair();`.
     * @param {PrivateKey} secret_key
     * @returns {Keypair}
     */
    static fromPrivateKey(secret_key) {
        _assertClass(secret_key, PrivateKey);
        const ret = wasm.keypair_fromPrivateKey(secret_key.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Keypair.__wrap(ret[0]);
    }
    /**
     * Get `ECDSA` [`Address`] of this Keypair's [`PublicKey`].
     * Receives a [`NetworkType`](tondi_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = keypair.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        const ret = wasm.keypair_toAddressECDSA(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
}

const MkdtempSyncOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mkdtempsyncoptions_free(ptr >>> 0, 1));

export class MkdtempSyncOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MkdtempSyncOptions.prototype);
        obj.__wbg_ptr = ptr;
        MkdtempSyncOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MkdtempSyncOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mkdtempsyncoptions_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.mkdtempsyncoptions_encoding(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.mkdtempsyncoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {string | null} [encoding]
     */
    constructor(encoding) {
        const ret = wasm.mkdtempsyncoptions_new_with_values(isLikeNone(encoding) ? 0 : addToExternrefTable0(encoding));
        this.__wbg_ptr = ret >>> 0;
        MkdtempSyncOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {MkdtempSyncOptions}
     */
    static new() {
        const ret = wasm.mkdtempsyncoptions_new();
        return MkdtempSyncOptions.__wrap(ret);
    }
}

const MnemonicFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mnemonic_free(ptr >>> 0, 1));
/**
 * BIP39 mnemonic phrases: sequences of words representing cryptographic keys.
 * @category Wallet SDK
 */
export class Mnemonic {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Mnemonic.prototype);
        obj.__wbg_ptr = ptr;
        MnemonicFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            phrase: this.phrase,
            entropy: this.entropy,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MnemonicFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mnemonic_free(ptr, 0);
    }
    /**
     * @param {string} phrase
     * @param {Language | null} [language]
     */
    constructor(phrase, language) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mnemonic_constructor(ptr0, len0, isLikeNone(language) ? 1 : language);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        MnemonicFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} phrase
     */
    set phrase(phrase) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mnemonic_set_phrase(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get phrase() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.mnemonic_phrase(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Validate mnemonic phrase. Returns `true` if the phrase is valid, `false` otherwise.
     * @param {string} phrase
     * @param {Language | null} [language]
     * @returns {boolean}
     */
    static validate(phrase, language) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mnemonic_validate(ptr0, len0, isLikeNone(language) ? 1 : language);
        return ret !== 0;
    }
    /**
     * @param {number | null} [word_count]
     * @returns {Mnemonic}
     */
    static random(word_count) {
        const ret = wasm.mnemonic_random(isLikeNone(word_count) ? 0x100000001 : (word_count) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Mnemonic.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get entropy() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.mnemonic_entropy(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string | null} [password]
     * @returns {string}
     */
    toSeed(password) {
        let deferred2_0;
        let deferred2_1;
        try {
            var ptr0 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            const ret = wasm.mnemonic_toSeed(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {string} entropy
     */
    set entropy(entropy) {
        const ptr0 = passStringToWasm0(entropy, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mnemonic_set_entropy(this.__wbg_ptr, ptr0, len0);
    }
}

const NetServerOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_netserveroptions_free(ptr >>> 0, 1));

export class NetServerOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NetServerOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_netserveroptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [value]
     */
    set allow_half_open(value) {
        const ptr = this.__destroy_into_raw();
        wasm.netserveroptions_set_allow_half_open(ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get allow_half_open() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.netserveroptions_allow_half_open(ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {boolean | undefined}
     */
    get pause_on_connect() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.netserveroptions_pause_on_connect(ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [value]
     */
    set pause_on_connect(value) {
        const ptr = this.__destroy_into_raw();
        wasm.netserveroptions_set_pause_on_connect(ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
}

const NetworkIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_networkid_free(ptr >>> 0, 1));
/**
 *
 * NetworkId is a unique identifier for a tondi network instance.
 * It is composed of a network type and an optional suffix.
 *
 * @category Consensus
 */
export class NetworkId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NetworkId.prototype);
        obj.__wbg_ptr = ptr;
        NetworkIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            suffix: this.suffix,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NetworkIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_networkid_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    addressPrefix() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.networkid_addressPrefix(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} value
     */
    constructor(value) {
        const ret = wasm.networkid_ctor(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        NetworkIdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.networkid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.networkid_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {NetworkType}
     */
    get type() {
        const ret = wasm.__wbg_get_networkid_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {NetworkType} arg0
     */
    set type(arg0) {
        wasm.__wbg_set_networkid_type(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get suffix() {
        const ret = wasm.__wbg_get_networkid_suffix(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [arg0]
     */
    set suffix(arg0) {
        wasm.__wbg_set_networkid_suffix(this.__wbg_ptr, isLikeNone(arg0) ? 0x100000001 : (arg0) >>> 0);
    }
}

const NodeDescriptorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nodedescriptor_free(ptr >>> 0, 1));
/**
 *
 * Data structure representing a Node connection endpoint
 * as provided by the {@link Resolver}.
 *
 * @category Node RPC
 */
export class NodeDescriptor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NodeDescriptor.prototype);
        obj.__wbg_ptr = ptr;
        NodeDescriptorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            uid: this.uid,
            url: this.url,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NodeDescriptorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nodedescriptor_free(ptr, 0);
    }
    /**
     * The unique identifier of the node.
     * @returns {string}
     */
    get uid() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_nodedescriptor_uid(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The unique identifier of the node.
     * @param {string} arg0
     */
    set uid(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_nodedescriptor_uid(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The URL of the node WebSocket (wRPC URL).
     * @returns {string}
     */
    get url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_nodedescriptor_url(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The URL of the node WebSocket (wRPC URL).
     * @param {string} arg0
     */
    set url(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_nodedescriptor_url(this.__wbg_ptr, ptr0, len0);
    }
}

const PSTTFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pstt_free(ptr >>> 0, 1));

export class PSTT {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PSTT.prototype);
        obj.__wbg_ptr = ptr;
        PSTTFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            role: this.role,
            payload: this.payload,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PSTTFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pstt_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get role() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.pstt_role(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {PSTT}
     */
    noMoreInputs() {
        const ret = wasm.pstt_noMoreInputs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @param {ITransactionOutput | TransactionOutput} output
     * @returns {PSTT}
     */
    output(output) {
        const ret = wasm.pstt_output(this.__wbg_ptr, output);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @returns {PSTT}
     */
    noMoreOutputs() {
        const ret = wasm.pstt_noMoreOutputs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @param {ITransactionInput | TransactionInput} input
     * @returns {PSTT}
     */
    input(input) {
        const ret = wasm.pstt_input(this.__wbg_ptr, input);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @returns {PSTT}
     */
    inputsModifiable() {
        const ret = wasm.pstt_inputsModifiable(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @param {bigint} n
     * @param {number} input_index
     * @returns {PSTT}
     */
    setSequence(n, input_index) {
        const ret = wasm.pstt_setSequence(this.__wbg_ptr, n, input_index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @param {bigint} lock_time
     * @returns {PSTT}
     */
    fallbackLockTime(lock_time) {
        const ret = wasm.pstt_fallbackLockTime(this.__wbg_ptr, lock_time);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @param {PSTT | Transaction | string | undefined} payload
     */
    constructor(payload) {
        const ret = wasm.pstt_new(payload);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PSTTFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Change role to `FINALIZER`
     * @returns {PSTT}
     */
    toFinalizer() {
        const ret = wasm.pstt_toFinalizer(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @returns {PSTT}
     */
    outputsModifiable() {
        const ret = wasm.pstt_outputsModifiable(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * Change role to `EXTRACTOR`
     * @returns {PSTT}
     */
    toExtractor() {
        const ret = wasm.pstt_toExtractor(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * Change role to `CREATOR`
     * #[wasm_bindgen(js_name = toCreator)]
     * @returns {PSTT}
     */
    creator() {
        const ret = wasm.pstt_creator(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * Change role to `CONSTRUCTOR`
     * @returns {PSTT}
     */
    toConstructor() {
        const ret = wasm.pstt_toConstructor(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * Change role to `UPDATER`
     * @returns {PSTT}
     */
    toUpdater() {
        const ret = wasm.pstt_toUpdater(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @returns {Hash}
     */
    calculateId() {
        const ret = wasm.pstt_calculateId(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Hash.__wrap(ret[0]);
    }
    /**
     * Change role to `SIGNER`
     * @returns {PSTT}
     */
    toSigner() {
        const ret = wasm.pstt_toSigner(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get payload() {
        const ret = wasm.pstt_payload(this.__wbg_ptr);
        return ret;
    }
    /**
     * Change role to `COMBINER`
     * @returns {PSTT}
     */
    toCombiner() {
        const ret = wasm.pstt_toCombiner(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PSTT.__wrap(ret[0]);
    }
}

const PaymentOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paymentoutput_free(ptr >>> 0, 1));
/**
 * A Rust data structure representing a single payment
 * output containing a destination address and amount.
 *
 * @category Wallet SDK
 */
export class PaymentOutput {

    toJSON() {
        return {
            address: this.address,
            amount: this.amount,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PaymentOutputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paymentoutput_free(ptr, 0);
    }
    /**
     * @returns {Address}
     */
    get address() {
        const ret = wasm.__wbg_get_paymentoutput_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @param {Address} arg0
     */
    set address(arg0) {
        _assertClass(arg0, Address);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_paymentoutput_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_paymentoutput_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_paymentoutput_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Address} address
     * @param {bigint} amount
     */
    constructor(address, amount) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.paymentoutput_new(ptr0, amount);
        this.__wbg_ptr = ret >>> 0;
        PaymentOutputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const PaymentOutputsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paymentoutputs_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class PaymentOutputs {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PaymentOutputsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paymentoutputs_free(ptr, 0);
    }
    /**
     * @param {IPaymentOutput[]} output_array
     */
    constructor(output_array) {
        const ret = wasm.paymentoutputs_constructor(output_array);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PaymentOutputsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const PendingTransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pendingtransaction_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class PendingTransaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PendingTransaction.prototype);
        obj.__wbg_ptr = ptr;
        PendingTransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            aggregateInputAmount: this.aggregateInputAmount,
            feeAmount: this.feeAmount,
            minimumSignatures: this.minimumSignatures,
            aggregateOutputAmount: this.aggregateOutputAmount,
            transaction: this.transaction,
            changeAmount: this.changeAmount,
            id: this.id,
            type: this.type,
            mass: this.mass,
            paymentAmount: this.paymentAmount,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PendingTransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pendingtransaction_free(ptr, 0);
    }
    /**
     * Total aggregate input amount.
     * @returns {bigint}
     */
    get aggregateInputAmount() {
        const ret = wasm.pendingtransaction_aggregateInputAmount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Total transaction fees (network fees + priority fees).
     * @returns {bigint}
     */
    get feeAmount() {
        const ret = wasm.pendingtransaction_feeAmount(this.__wbg_ptr);
        return ret;
    }
    /**
     * List of unique addresses used by transaction inputs.
     * This method can be used to determine addresses used by transaction inputs
     * in order to select private keys needed for transaction signing.
     * @returns {Array<any>}
     */
    addresses() {
        const ret = wasm.pendingtransaction_addresses(this.__wbg_ptr);
        return ret;
    }
    /**
     * Minimum number of signatures required by the transaction.
     * (as specified during the transaction creation).
     * @returns {number}
     */
    get minimumSignatures() {
        const ret = wasm.pendingtransaction_minimumSignatures(this.__wbg_ptr);
        return ret;
    }
    /**
     * Signs the input at the specified index with the supplied private key
     * and an optional SighashType.
     * @param {number} input_index
     * @param {PrivateKey} private_key
     * @param {SighashType | null} [sighash_type]
     */
    signInput(input_index, private_key, sighash_type) {
        _assertClass(private_key, PrivateKey);
        const ret = wasm.pendingtransaction_signInput(this.__wbg_ptr, input_index, private_key.__wbg_ptr, isLikeNone(sighash_type) ? 6 : sighash_type);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Total aggregate output amount.
     * @returns {bigint}
     */
    get aggregateOutputAmount() {
        const ret = wasm.pendingtransaction_aggregateOutputAmount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Serializes the transaction to a pure JavaScript Object.
     * The schema of the JavaScript object is defined by {@link ISerializableTransaction}.
     * @see {@link ISerializableTransaction}
     * @see {@link Transaction}, {@link ISerializableTransaction}
     * @returns {ITransaction | Transaction}
     */
    serializeToObject() {
        const ret = wasm.pendingtransaction_serializeToObject(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Provides a list of UTXO entries used by the transaction.
     * @returns {Array<any>}
     */
    getUtxoEntries() {
        const ret = wasm.pendingtransaction_getUtxoEntries(this.__wbg_ptr);
        return ret;
    }
    /**
     * Serializes the transaction to a JSON string.
     * The schema of the JSON is defined by {@link ISerializableTransaction}.
     * Once serialized, the transaction can be deserialized using {@link Transaction.deserializeFromJSON}.
     * @see {@link Transaction}, {@link ISerializableTransaction}
     * @returns {string}
     */
    serializeToJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.pendingtransaction_serializeToJSON(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Signs transaction with supplied [`Array`] or [`PrivateKey`] or an array of
     * raw private key bytes (encoded as `Uint8Array` or as hex strings)
     * @param {(PrivateKey | HexString | Uint8Array)[]} js_value
     * @param {boolean | null} [check_fully_signed]
     */
    sign(js_value, check_fully_signed) {
        const ret = wasm.pendingtransaction_sign(this.__wbg_ptr, js_value, isLikeNone(check_fully_signed) ? 0xFFFFFF : check_fully_signed ? 1 : 0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Submit transaction to the supplied [`RpcClient`]
     * **IMPORTANT:** This method will remove UTXOs from the associated
     * {@link UtxoContext} if one was used to create the transaction
     * and will return UTXOs back to {@link UtxoContext} in case of
     * a failed submission.
     *
     * # Important
     *
     * Make sure to consume the returned `txid` value. Always invoke this method
     * as follows `let txid = await pendingTransaction.submit(rpc);`. If you do not
     * consume the returned value and the rpc object is temporary, the GC will
     * collect the `rpc` object passed to submit() potentially causing a panic.
     *
     * @see {@link RpcClient.submitTransaction}
     * @param {RpcClient} wasm_rpc_client
     * @returns {Promise<string>}
     */
    submit(wasm_rpc_client) {
        _assertClass(wasm_rpc_client, RpcClient);
        const ret = wasm.pendingtransaction_submit(this.__wbg_ptr, wasm_rpc_client.__wbg_ptr);
        return ret;
    }
    /**
     * Returns encapsulated network [`Transaction`]
     * @returns {Transaction}
     */
    get transaction() {
        const ret = wasm.pendingtransaction_transaction(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * Serializes the transaction to a "Safe" JSON schema where it converts all `bigint` values to `string` to avoid potential client-side precision loss.
     * Once serialized, the transaction can be deserialized using {@link Transaction.deserializeFromSafeJSON}.
     * @see {@link Transaction}, {@link ISerializableTransaction}
     * @returns {string}
     */
    serializeToSafeJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.pendingtransaction_serializeToSafeJSON(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Sets a signature to the input at the specified index.
     * @param {number} input_index
     * @param {HexString | Uint8Array} signature_script
     */
    fillInput(input_index, signature_script) {
        const ret = wasm.pendingtransaction_fillInput(this.__wbg_ptr, input_index, signature_script);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Change amount (if any).
     * @returns {bigint}
     */
    get changeAmount() {
        const ret = wasm.pendingtransaction_changeAmount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Transaction Id
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.pendingtransaction_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Transaction type ("batch" or "final").
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.pendingtransaction_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Calculated transaction mass.
     * @returns {bigint}
     */
    get mass() {
        const ret = wasm.pendingtransaction_mass(this.__wbg_ptr);
        return ret;
    }
    /**
     * Creates and returns a signature for the input at the specified index.
     * @param {number} input_index
     * @param {PrivateKey} private_key
     * @param {SighashType | null} [sighash_type]
     * @returns {HexString}
     */
    createInputSignature(input_index, private_key, sighash_type) {
        _assertClass(private_key, PrivateKey);
        const ret = wasm.pendingtransaction_createInputSignature(this.__wbg_ptr, input_index, private_key.__wbg_ptr, isLikeNone(sighash_type) ? 6 : sighash_type);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Total amount transferred to the destination (aggregate output - change).
     * @returns {any}
     */
    get paymentAmount() {
        const ret = wasm.pendingtransaction_paymentAmount(this.__wbg_ptr);
        return ret;
    }
}

const PipeOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pipeoptions_free(ptr >>> 0, 1));

export class PipeOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PipeOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pipeoptions_free(ptr, 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get end() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.pipeoptions_end(ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [end]
     */
    constructor(end) {
        const ret = wasm.pipeoptions_new(isLikeNone(end) ? 0xFFFFFF : end ? 1 : 0);
        this.__wbg_ptr = ret >>> 0;
        PipeOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [value]
     */
    set end(value) {
        const ptr = this.__destroy_into_raw();
        wasm.pipeoptions_set_end(ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
}

const PrivateKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_privatekey_free(ptr >>> 0, 1));
/**
 * Data structure that envelops a Private Key.
 * @category Wallet SDK
 */
export class PrivateKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PrivateKey.prototype);
        obj.__wbg_ptr = ptr;
        PrivateKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrivateKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_privatekey_free(ptr, 0);
    }
    /**
     * Generate a [`Keypair`] from this [`PrivateKey`].
     * @returns {Keypair}
     */
    toKeypair() {
        const ret = wasm.privatekey_toKeypair(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Keypair.__wrap(ret[0]);
    }
    /**
     * @returns {PublicKey}
     */
    toPublicKey() {
        const ret = wasm.privatekey_toPublicKey(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PublicKey.__wrap(ret[0]);
    }
    /**
     * Get `ECDSA` [`Address`] of the PublicKey generated from this PrivateKey.
     * Receives a [`NetworkType`](tondi_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = privateKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        const ret = wasm.privatekey_toAddressECDSA(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Get the [`Address`] of the PublicKey generated from this PrivateKey.
     * Receives a [`NetworkType`](tondi_consensus_core::network::NetworkType)
     * to determine the prefix of the address.
     * JavaScript: `let address = privateKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        const ret = wasm.privatekey_toAddress(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Returns the [`PrivateKey`] key encoded as a hex string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.privatekey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Create a new [`PrivateKey`] from a hex-encoded string.
     * @param {string} key
     */
    constructor(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.privatekey_try_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PrivateKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const PrivateKeyGeneratorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_privatekeygenerator_free(ptr >>> 0, 1));
/**
 *
 * Helper class to generate private keys from an extended private key (XPrv).
 * This class accepts the master Tondi XPrv string (e.g. `xprv1...`) and generates
 * private keys for the receive and change paths given the pre-set parameters
 * such as account index, multisig purpose and cosigner index.
 *
 * Please note that in Tondi master private keys use `kprv` prefix.
 *
 * @see {@link PublicKeyGenerator}, {@link XPub}, {@link XPrv}, {@link Mnemonic}
 * @category Wallet SDK
 */
export class PrivateKeyGenerator {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrivateKeyGeneratorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_privatekeygenerator_free(ptr, 0);
    }
    /**
     * @param {number} index
     * @returns {PrivateKey}
     */
    changeKey(index) {
        const ret = wasm.privatekeygenerator_changeKey(this.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PrivateKey.__wrap(ret[0]);
    }
    /**
     * @param {number} index
     * @returns {PrivateKey}
     */
    receiveKey(index) {
        const ret = wasm.privatekeygenerator_receiveKey(this.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PrivateKey.__wrap(ret[0]);
    }
    /**
     * @param {XPrv | string} xprv
     * @param {boolean} is_multisig
     * @param {bigint} account_index
     * @param {number | null} [cosigner_index]
     */
    constructor(xprv, is_multisig, account_index, cosigner_index) {
        const ret = wasm.privatekeygenerator_new(xprv, is_multisig, account_index, isLikeNone(cosigner_index) ? 0x100000001 : (cosigner_index) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PrivateKeyGeneratorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const ProcessSendOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_processsendoptions_free(ptr >>> 0, 1));

export class ProcessSendOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProcessSendOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_processsendoptions_free(ptr, 0);
    }
    /**
     * @param {boolean | null} [swallow_errors]
     */
    constructor(swallow_errors) {
        const ret = wasm.processsendoptions_new(isLikeNone(swallow_errors) ? 0xFFFFFF : swallow_errors ? 1 : 0);
        this.__wbg_ptr = ret >>> 0;
        ProcessSendOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [value]
     */
    set swallow_errors(value) {
        wasm.processsendoptions_set_swallow_errors(this.__wbg_ptr, isLikeNone(value) ? 0xFFFFFF : value ? 1 : 0);
    }
    /**
     * @returns {boolean | undefined}
     */
    get swallow_errors() {
        const ret = wasm.processsendoptions_swallow_errors(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
}

const PrvKeyDataInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_prvkeydatainfo_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class PrvKeyDataInfo {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrvKeyDataInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_prvkeydatainfo_free(ptr, 0);
    }
    /**
     * @param {string} _name
     */
    setName(_name) {
        const ptr0 = passStringToWasm0(_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.prvkeydatainfo_setName(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {any}
     */
    get isEncrypted() {
        const ret = wasm.prvkeydatainfo_isEncrypted(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    get name() {
        const ret = wasm.prvkeydatainfo_name(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.prvkeydatainfo_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const PublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publickey_free(ptr >>> 0, 1));
/**
 * Data structure that envelopes a PublicKey.
 * Only supports Schnorr-based addresses.
 * @category Wallet SDK
 */
export class PublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicKey.prototype);
        obj.__wbg_ptr = ptr;
        PublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickey_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.publickey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Compute a 4-byte key fingerprint for this public key as a hex string.
     * Default implementation uses `RIPEMD160(SHA256(public_key))`.
     * @returns {HexString | undefined}
     */
    fingerprint() {
        const ret = wasm.publickey_fingerprint(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get `ECDSA` [`Address`] of this PublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = publicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        const ret = wasm.publickey_toAddressECDSA(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Get the [`Address`] of this PublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = publicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        const ret = wasm.publickey_toAddress(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Create a new [`PublicKey`] from a hex-encoded string.
     * @param {string} key
     */
    constructor(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.publickey_try_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {XOnlyPublicKey}
     */
    toXOnlyPublicKey() {
        const ret = wasm.publickey_toXOnlyPublicKey(this.__wbg_ptr);
        return XOnlyPublicKey.__wrap(ret);
    }
}

const PublicKeyGeneratorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publickeygenerator_free(ptr >>> 0, 1));
/**
 *
 * Helper class to generate public keys from an extended public key (XPub)
 * that has been derived up to the co-signer index.
 *
 * Please note that in Tondi master public keys use `kpub` prefix.
 *
 * @see {@link PrivateKeyGenerator}, {@link XPub}, {@link XPrv}, {@link Mnemonic}
 * @category Wallet SDK
 */
export class PublicKeyGenerator {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicKeyGenerator.prototype);
        obj.__wbg_ptr = ptr;
        PublicKeyGeneratorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicKeyGeneratorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickeygenerator_free(ptr, 0);
    }
    /**
     * @param {XPub | string} kpub
     * @param {number | null} [cosigner_index]
     * @returns {PublicKeyGenerator}
     */
    static fromXPub(kpub, cosigner_index) {
        const ret = wasm.publickeygenerator_fromXPub(kpub, isLikeNone(cosigner_index) ? 0x100000001 : (cosigner_index) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PublicKeyGenerator.__wrap(ret[0]);
    }
    /**
     * Generate a single Change Address derivation at a given index.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {Address}
     */
    changeAddress(networkType, index) {
        const ret = wasm.publickeygenerator_changeAddress(this.__wbg_ptr, networkType, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * @param {XPrv | string} xprv
     * @param {boolean} is_multisig
     * @param {bigint} account_index
     * @param {number | null} [cosigner_index]
     * @returns {PublicKeyGenerator}
     */
    static fromMasterXPrv(xprv, is_multisig, account_index, cosigner_index) {
        const ret = wasm.publickeygenerator_fromMasterXPrv(xprv, is_multisig, account_index, isLikeNone(cosigner_index) ? 0x100000001 : (cosigner_index) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PublicKeyGenerator.__wrap(ret[0]);
    }
    /**
     * Generate Change Address derivations for a given range.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Address[]}
     */
    changeAddresses(networkType, start, end) {
        const ret = wasm.publickeygenerator_changeAddresses(this.__wbg_ptr, networkType, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Generate Change Public Key derivations for a given range.
     * @param {number} start
     * @param {number} end
     * @returns {(PublicKey | string)[]}
     */
    changePubkeys(start, end) {
        const ret = wasm.publickeygenerator_changePubkeys(this.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Generate Receive Address derivations for a given range.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Address[]}
     */
    receiveAddresses(networkType, start, end) {
        const ret = wasm.publickeygenerator_receiveAddresses(this.__wbg_ptr, networkType, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.publickeygenerator_toString(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate a single Change Public Key derivation at a given index and return it as a string.
     * @param {number} index
     * @returns {string}
     */
    changePubkeyAsString(index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.publickeygenerator_changePubkeyAsString(this.__wbg_ptr, index);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate a range of Change Address derivations and return them as strings.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    changeAddressAsStrings(networkType, start, end) {
        const ret = wasm.publickeygenerator_changeAddressAsStrings(this.__wbg_ptr, networkType, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Generate a single Receive Address derivation at a given index.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {Address}
     */
    receiveAddress(networkType, index) {
        const ret = wasm.publickeygenerator_receiveAddress(this.__wbg_ptr, networkType, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Generate a single Receive Address derivation at a given index and return it as a string.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {string}
     */
    receiveAddressAsString(networkType, index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.publickeygenerator_receiveAddressAsString(this.__wbg_ptr, networkType, index);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate a single Receive Public Key derivation at a given index and return it as a string.
     * @param {number} index
     * @returns {string}
     */
    receivePubkeyAsString(index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.publickeygenerator_receivePubkeyAsString(this.__wbg_ptr, index);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate a range of Change Public Key derivations and return them as strings.
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    changePubkeysAsStrings(start, end) {
        const ret = wasm.publickeygenerator_changePubkeysAsStrings(this.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Generate a single Receive Public Key derivation at a given index.
     * @param {number} index
     * @returns {PublicKey}
     */
    receivePubkey(index) {
        const ret = wasm.publickeygenerator_receivePubkey(this.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PublicKey.__wrap(ret[0]);
    }
    /**
     * Generate a range of Receive Public Key derivations and return them as strings.
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    receivePubkeysAsStrings(start, end) {
        const ret = wasm.publickeygenerator_receivePubkeysAsStrings(this.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Generate a single Change Address derivation at a given index and return it as a string.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} index
     * @returns {string}
     */
    changeAddressAsString(networkType, index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.publickeygenerator_changeAddressAsString(this.__wbg_ptr, networkType, index);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Generate a range of Receive Address derivations and return them as strings.
     * @param {NetworkType | NetworkId | string} networkType
     * @param {number} start
     * @param {number} end
     * @returns {Array<string>}
     */
    receiveAddressAsStrings(networkType, start, end) {
        const ret = wasm.publickeygenerator_receiveAddressAsStrings(this.__wbg_ptr, networkType, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Generate a single Change Public Key derivation at a given index.
     * @param {number} index
     * @returns {PublicKey}
     */
    changePubkey(index) {
        const ret = wasm.publickeygenerator_changePubkey(this.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PublicKey.__wrap(ret[0]);
    }
    /**
     * Generate Receive Public Key derivations for a given range.
     * @param {number} start
     * @param {number} end
     * @returns {(PublicKey | string)[]}
     */
    receivePubkeys(start, end) {
        const ret = wasm.publickeygenerator_receivePubkeys(this.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const ReadStreamFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_readstream_free(ptr >>> 0, 1));

export class ReadStream {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReadStreamFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_readstream_free(ptr, 0);
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_close(listener) {
        const ret = wasm.readstream_on_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_close(listener) {
        const ret = wasm.readstream_once_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_close(listener) {
        const ret = wasm.readstream_prepend_once_listener_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_open(listener) {
        const ret = wasm.readstream_once_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_open(listener) {
        const ret = wasm.readstream_prepend_listener_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_open(listener) {
        const ret = wasm.readstream_prepend_once_listener_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_close(listener) {
        const ret = wasm.readstream_prepend_listener_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_open(listener) {
        const ret = wasm.readstream_add_listener_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_open(listener) {
        const ret = wasm.readstream_on_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_close(listener) {
        const ret = wasm.readstream_add_listener_with_close(this.__wbg_ptr, listener);
        return ret;
    }
}

const ResolverFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_resolver_free(ptr >>> 0, 1));
/**
 *
 * Resolver is a client for obtaining public Tondi wRPC URL.
 *
 * Resolver queries a list of public Tondi Resolver URLs using HTTP to fetch
 * wRPC endpoints for the given encoding, network identifier and other
 * parameters. It then provides this information to the {@link RpcClient}.
 *
 * Each time {@link RpcClient} disconnects, it will query the resolver
 * to fetch a new wRPC URL.
 *
 * ```javascript
 * // using integrated public URLs
 * let rpc = RpcClient({
 *     resolver: new Resolver(),
 *     networkId : "mainnet"
 * });
 *
 * // specifying custom resolver URLs
 * let rpc = RpcClient({
 *     resolver: new Resolver({urls: ["<resolver-url>",...]}),
 *     networkId : "mainnet"
 * });
 * ```
 *
 * @see {@link IResolverConfig}, {@link IResolverConnect}, {@link RpcClient}
 * @category Node RPC
 */
export class Resolver {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Resolver.prototype);
        obj.__wbg_ptr = ptr;
        ResolverFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            urls: this.urls,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ResolverFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_resolver_free(ptr, 0);
    }
    /**
     * Fetches a public Tondi wRPC endpoint for the given encoding and network identifier.
     * @see {@link Encoding}, {@link NetworkId}, {@link Node}
     * @param {Encoding} encoding
     * @param {NetworkId | string} network_id
     * @returns {Promise<NodeDescriptor>}
     */
    getNode(encoding, network_id) {
        const ret = wasm.resolver_getNode(this.__wbg_ptr, encoding, network_id);
        return ret;
    }
    /**
     * Creates a new Resolver client with the given
     * configuration supplied as {@link IResolverConfig}
     * interface. If not supplied, the default configuration
     * containing a list of community-operated resolvers
     * will be used.
     * @param {IResolverConfig | string[] | null} [args]
     */
    constructor(args) {
        const ret = wasm.resolver_ctor(isLikeNone(args) ? 0 : addToExternrefTable0(args));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ResolverFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Connect to a public Tondi wRPC endpoint for the given encoding and network identifier
     * supplied via {@link IResolverConnect} interface.
     * @see {@link IResolverConnect}, {@link RpcClient}
     * @param {IResolverConnect | NetworkId | string} options
     * @returns {Promise<RpcClient>}
     */
    connect(options) {
        const ret = wasm.resolver_connect(this.__wbg_ptr, options);
        return ret;
    }
    /**
     * Fetches a public Tondi wRPC endpoint URL for the given encoding and network identifier.
     * @see {@link Encoding}, {@link NetworkId}
     * @param {Encoding} encoding
     * @param {NetworkId | string} network_id
     * @returns {Promise<string>}
     */
    getUrl(encoding, network_id) {
        const ret = wasm.resolver_getUrl(this.__wbg_ptr, encoding, network_id);
        return ret;
    }
    /**
     * List of public Tondi Resolver URLs.
     * @returns {string[] | undefined}
     */
    get urls() {
        const ret = wasm.resolver_urls(this.__wbg_ptr);
        return ret;
    }
}

const RpcClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rpcclient_free(ptr >>> 0, 1));
/**
 *
 *
 * Tondi RPC client uses ([wRPC](https://github.com/workflow-rs/workflow-rs/tree/master/rpc))
 * interface to connect directly with Tondi Node. wRPC supports
 * two types of encodings: `borsh` (binary, default) and `json`.
 *
 * There are two ways to connect: Directly to any Tondi Node or to a
 * community-maintained public node infrastructure using the {@link Resolver} class.
 *
 * **Connecting to a public node using a resolver**
 *
 * ```javascript
 * let rpc = new RpcClient({
 *    resolver : new Resolver(),
 *    networkId : "mainnet",
 * });
 *
 * await rpc.connect();
 * ```
 *
 * **Connecting to a Tondi Node directly**
 *
 * ```javascript
 * let rpc = new RpcClient({
 *    // if port is not provided it will default
 *    // to the default port for the networkId
 *    url : "127.0.0.1",
 *    networkId : "mainnet",
 * });
 * ```
 *
 * **Example usage**
 *
 * ```javascript
 *
 * // Create a new RPC client with a URL
 * let rpc = new RpcClient({ url : "wss://<node-wrpc-address>" });
 *
 * // Create a new RPC client with a resolver
 * // (networkId is required when using a resolver)
 * let rpc = new RpcClient({
 *     resolver : new Resolver(),
 *     networkId : "mainnet",
 * });
 *
 * rpc.addEventListener("connect", async (event) => {
 *     console.log("Connected to", rpc.url);
 *     await rpc.subscribeDaaScore();
 * });
 *
 * rpc.addEventListener("disconnect", (event) => {
 *     console.log("Disconnected from", rpc.url);
 * });
 *
 * try {
 *     await rpc.connect();
 * } catch(err) {
 *     console.log("Error connecting:", err);
 * }
 *
 * ```
 *
 * You can register event listeners to receive notifications from the RPC client
 * using {@link RpcClient.addEventListener} and {@link RpcClient.removeEventListener} functions.
 *
 * **IMPORTANT:** If RPC is disconnected, upon reconnection you do not need
 * to re-register event listeners, but your have to re-subscribe for Tondi node
 * notifications:
 *
 * ```typescript
 * rpc.addEventListener("connect", async (event) => {
 *     console.log("Connected to", rpc.url);
 *     // re-subscribe each time we connect
 *     await rpc.subscribeDaaScore();
 *     // ... perform wallet address subscriptions
 * });
 *
 * ```
 *
 * If using NodeJS, it is important that {@link RpcClient.disconnect} is called before
 * the process exits to ensure that the WebSocket connection is properly closed.
 * Failure to do this will prevent the process from exiting.
 *
 * @category Node RPC
 */
export class RpcClient {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RpcClient.prototype);
        obj.__wbg_ptr = ptr;
        RpcClientFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            url: this.url,
            resolver: this.resolver,
            nodeId: this.nodeId,
            encoding: this.encoding,
            isConnected: this.isConnected,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RpcClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rpcclient_free(ptr, 0);
    }
    /**
     * Retrieves mempool entries associated with specific addresses.
     * Returned information: List of mempool entries.
     * @see {@link IGetMempoolEntriesByAddressesRequest}, {@link IGetMempoolEntriesByAddressesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetMempoolEntriesByAddressesRequest} request
     * @returns {Promise<IGetMempoolEntriesByAddressesResponse>}
     */
    getMempoolEntriesByAddresses(request) {
        const ret = wasm.rpcclient_getMempoolEntriesByAddresses(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Tests the connection and responsiveness of a Tondi node.
     * Returned information: None.
     * @see {@link IPingRequest}, {@link IPingResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IPingRequest | null} [request]
     * @returns {Promise<IPingResponse>}
     */
    ping(request) {
        const ret = wasm.rpcclient_ping(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Unbans a previously banned peer, allowing it to connect
     * to the Tondi node again.
     * Returned information: None.
     * @see {@link IUnbanRequest}, {@link IUnbanResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IUnbanRequest} request
     * @returns {Promise<IUnbanResponse>}
     */
    unban(request) {
        const ret = wasm.rpcclient_unban(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves the estimated DAA (Difficulty Adjustment Algorithm)
     * score timestamp estimate.
     * Returned information: DAA score timestamp estimate.
     * @see {@link IGetDaaScoreTimestampEstimateRequest}, {@link IGetDaaScoreTimestampEstimateResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetDaaScoreTimestampEstimateRequest} request
     * @returns {Promise<IGetDaaScoreTimestampEstimateResponse>}
     */
    getDaaScoreTimestampEstimate(request) {
        const ret = wasm.rpcclient_getDaaScoreTimestampEstimate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves general information about the Tondi node.
     * Returned information: Version of the Tondi node, protocol
     * version, network identifier.
     * This call is primarily used by gRPC clients.
     * For wRPC clients, use {@link RpcClient.getServerInfo}.
     * @see {@link IGetInfoRequest}, {@link IGetInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetInfoRequest | null} [request]
     * @returns {Promise<IGetInfoResponse>}
     */
    getInfo(request) {
        const ret = wasm.rpcclient_getInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Set the resolver for the RPC client.
     * This setting will take effect on the next connection.
     * @param {Resolver} resolver
     */
    setResolver(resolver) {
        _assertClass(resolver, Resolver);
        var ptr0 = resolver.__destroy_into_raw();
        const ret = wasm.rpcclient_setResolver(this.__wbg_ptr, ptr0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     *
     * Unregister all notification callbacks for all events.
     */
    removeAllEventListeners() {
        const ret = wasm.rpcclient_removeAllEventListeners(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Obtains basic information about the synchronization status of the Tondi node.
     * Returned information: Syncing status.
     * @see {@link IGetSyncStatusRequest}, {@link IGetSyncStatusResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetSyncStatusRequest | null} [request]
     * @returns {Promise<IGetSyncStatusResponse>}
     */
    getSyncStatus(request) {
        const ret = wasm.rpcclient_getSyncStatus(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     *
     * Unregister an event listener.
     * This function will remove the callback for the specified event.
     * If the `callback` is not supplied, all callbacks will be
     * removed for the specified event.
     *
     * @see {@link RpcClient.addEventListener}
     * @param {RpcEventType | string} event
     * @param {RpcEventCallback | null} [callback]
     */
    removeEventListener(event, callback) {
        const ret = wasm.rpcclient_removeEventListener(this.__wbg_ptr, event, isLikeNone(callback) ? 0 : addToExternrefTable0(callback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Manage subscription for a finality conflict notification event.
     * Finality conflict notification event is produced when a finality
     * conflict occurs in the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeFinalityConflict() {
        const ret = wasm.rpcclient_subscribeFinalityConflict(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribePruningPointUtxoSetOverride() {
        const ret = wasm.rpcclient_unsubscribePruningPointUtxoSetOverride(this.__wbg_ptr);
        return ret;
    }
    /**
     * Triggers a disconnection on the underlying WebSocket
     * if the WebSocket is in connected state.
     * This is intended for debug purposes only.
     * Can be used to test application reconnection logic.
     */
    triggerAbort() {
        wasm.rpcclient_triggerAbort(this.__wbg_ptr);
    }
    /**
     * Submits a block to the Tondi network.
     * Returned information: None.
     * @see {@link ISubmitBlockRequest}, {@link ISubmitBlockResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {ISubmitBlockRequest} request
     * @returns {Promise<ISubmitBlockResponse>}
     */
    submitBlock(request) {
        const ret = wasm.rpcclient_submitBlock(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves the current number of blocks in the Tondi BlockDAG.
     * This is not a block count, not a "block height" and can not be
     * used for transaction validation.
     * Returned information: Current block count.
     * @see {@link IGetBlockCountRequest}, {@link IGetBlockCountResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetBlockCountRequest | null} [request]
     * @returns {Promise<IGetBlockCountResponse>}
     */
    getBlockCount(request) {
        const ret = wasm.rpcclient_getBlockCount(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Adds a peer to the Tondi node's list of known peers.
     * Returned information: None.
     * @see {@link IAddPeerRequest}, {@link IAddPeerResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IAddPeerRequest} request
     * @returns {Promise<IAddPeerResponse>}
     */
    addPeer(request) {
        const ret = wasm.rpcclient_addPeer(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Manage subscription for a virtual DAA score changed notification event.
     * Virtual DAA score changed notification event is produced when the virtual
     * Difficulty Adjustment Algorithm (DAA) score changes in the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeVirtualDaaScoreChanged() {
        const ret = wasm.rpcclient_subscribeVirtualDaaScoreChanged(this.__wbg_ptr);
        return ret;
    }
    /**
     *
     * Register an event listener callback.
     *
     * Registers a callback function to be executed when a specific event occurs.
     * The callback function will receive an {@link RpcEvent} object with the event `type` and `data`.
     *
     * **RPC Subscriptions vs Event Listeners**
     *
     * Subscriptions are used to receive notifications from the RPC client.
     * Event listeners are client-side application registrations that are
     * triggered when notifications are received.
     *
     * If node is disconnected, upon reconnection you do not need to re-register event listeners,
     * however, you have to re-subscribe for Tondi node notifications. As such, it is recommended
     * to register event listeners when the RPC `open` event is received.
     *
     * ```javascript
     * rpc.addEventListener("connect", async (event) => {
     *     console.log("Connected to", rpc.url);
     *     await rpc.subscribeDaaScore();
     *     // ... perform wallet address subscriptions
     * });
     * ```
     *
     * **Multiple events and listeners**
     *
     * `addEventListener` can be used to register multiple event listeners for the same event
     * as well as the same event listener for multiple events.
     *
     * ```javascript
     * // Registering a single event listener for multiple events:
     * rpc.addEventListener(["connect", "disconnect"], (event) => {
     *     console.log(event);
     * });
     *
     * // Registering event listener for all events:
     * // (by omitting the event type)
     * rpc.addEventListener((event) => {
     *     console.log(event);
     * });
     *
     * // Registering multiple event listeners for the same event:
     * rpc.addEventListener("connect", (event) => { // first listener
     *     console.log(event);
     * });
     * rpc.addEventListener("connect", (event) => { // second listener
     *     console.log(event);
     * });
     * ```
     *
     * **Use of context objects**
     *
     * You can also register an event with a `context` object. When the event is triggered,
     * the `handleEvent` method of the `context` object will be called while `this` value
     * will be set to the `context` object.
     * ```javascript
     * // Registering events with a context object:
     *
     * const context = {
     *     someProperty: "someValue",
     *     handleEvent: (event) => {
     *         // the following will log "someValue"
     *         console.log(this.someProperty);
     *         console.log(event);
     *     }
     * };
     * rpc.addEventListener(["connect","disconnect"], context);
     *
     * ```
     *
     * **General use examples**
     *
     * In TypeScript you can use {@link RpcEventType} enum (such as `RpcEventType.Connect`)
     * or `string` (such as "connect") to register event listeners.
     * In JavaScript you can only use `string`.
     *
     * ```typescript
     * // Example usage (TypeScript):
     *
     * rpc.addEventListener(RpcEventType.Connect, (event) => {
     *     console.log("Connected to", rpc.url);
     * });
     *
     * rpc.addEventListener(RpcEventType.VirtualDaaScoreChanged, (event) => {
     *     console.log(event.type,event.data);
     * });
     * await rpc.subscribeDaaScore();
     *
     * rpc.addEventListener(RpcEventType.BlockAdded, (event) => {
     *     console.log(event.type,event.data);
     * });
     * await rpc.subscribeBlockAdded();
     *
     * // Example usage (JavaScript):
     *
     * rpc.addEventListener("virtual-daa-score-changed", (event) => {
     *     console.log(event.type,event.data);
     * });
     *
     * await rpc.subscribeDaaScore();
     * rpc.addEventListener("block-added", (event) => {
     *     console.log(event.type,event.data);
     * });
     * await rpc.subscribeBlockAdded();
     * ```
     *
     * @see {@link RpcEventType} for a list of supported events.
     * @see {@link RpcEventData} for the event data interface specification.
     * @see {@link RpcClient.removeEventListener}, {@link RpcClient.removeAllEventListeners}
     * @param {RpcEventType | string | RpcEventCallback} event
     * @param {RpcEventCallback | null} [callback]
     */
    addEventListener(event, callback) {
        const ret = wasm.rpcclient_addEventListener(this.__wbg_ptr, event, isLikeNone(callback) ? 0 : addToExternrefTable0(callback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Retrieves a specific mempool entry by transaction ID.
     * Returned information: Mempool entry information.
     * @see {@link IGetMempoolEntryRequest}, {@link IGetMempoolEntryResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetMempoolEntryRequest} request
     * @returns {Promise<IGetMempoolEntryResponse>}
     */
    getMempoolEntry(request) {
        const ret = wasm.rpcclient_getMempoolEntry(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Submits a transaction to the Tondi network.
     * Returned information: Submitted Transaction Id.
     * @see {@link ISubmitTransactionRequest}, {@link ISubmitTransactionResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {ISubmitTransactionRequest} request
     * @returns {Promise<ISubmitTransactionResponse>}
     */
    submitTransaction(request) {
        const ret = wasm.rpcclient_submitTransaction(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves current number of network connections
     * @see {@link IGetConnectionsRequest}, {@link IGetConnectionsResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetConnectionsRequest | null} [request]
     * @returns {Promise<IGetConnectionsResponse>}
     */
    getConnections(request) {
        const ret = wasm.rpcclient_getConnections(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Set the network id for the RPC client.
     * This setting will take effect on the next connection.
     * @param {NetworkId} network_id
     */
    setNetworkId(network_id) {
        _assertClass(network_id, NetworkId);
        const ret = wasm.rpcclient_setNetworkId(this.__wbg_ptr, network_id.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * The current URL of the RPC client.
     * @returns {string | undefined}
     */
    get url() {
        const ret = wasm.rpcclient_url(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Retrieves the virtual chain corresponding to a specified block hash.
     * Returned information: Virtual chain information.
     * @see {@link IGetVirtualChainFromBlockRequest}, {@link IGetVirtualChainFromBlockResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetVirtualChainFromBlockRequest} request
     * @returns {Promise<IGetVirtualChainFromBlockResponse>}
     */
    getVirtualChainFromBlock(request) {
        const ret = wasm.rpcclient_getVirtualChainFromBlock(this.__wbg_ptr, request);
        return ret;
    }
    /**
     *
     * Create a new RPC client with optional {@link Encoding} and a `url`.
     *
     * @see {@link IRpcConfig} interface for more details.
     * @param {IRpcConfig | null} [config]
     */
    constructor(config) {
        const ret = wasm.rpcclient_ctor(isLikeNone(config) ? 0 : addToExternrefTable0(config));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        RpcClientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Manage subscription for a block added notification event.
     * Block added notification event is produced when a new
     * block is added to the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeBlockAdded() {
        const ret = wasm.rpcclient_subscribeBlockAdded(this.__wbg_ptr);
        return ret;
    }
    /**
     * Retrieves multiple blocks from the Tondi BlockDAG.
     * Returned information: List of block information.
     * @see {@link IGetBlocksRequest}, {@link IGetBlocksResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBlocksRequest} request
     * @returns {Promise<IGetBlocksResponse>}
     */
    getBlocks(request) {
        const ret = wasm.rpcclient_getBlocks(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Disconnect from the Tondi RPC server.
     * @returns {Promise<void>}
     */
    disconnect() {
        const ret = wasm.rpcclient_disconnect(this.__wbg_ptr);
        return ret;
    }
    /**
     * Resolves a finality conflict in the Tondi BlockDAG.
     * Returned information: None.
     * @see {@link IResolveFinalityConflictRequest}, {@link IResolveFinalityConflictResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IResolveFinalityConflictRequest} request
     * @returns {Promise<IResolveFinalityConflictResponse>}
     */
    resolveFinalityConflict(request) {
        const ret = wasm.rpcclient_resolveFinalityConflict(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Provides a list of addresses of known peers in the Tondi
     * network that the node can potentially connect to.
     * Returned information: List of peer addresses.
     * @see {@link IGetPeerAddressesRequest}, {@link IGetPeerAddressesResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetPeerAddressesRequest | null} [request]
     * @returns {Promise<IGetPeerAddressesResponse>}
     */
    getPeerAddresses(request) {
        const ret = wasm.rpcclient_getPeerAddresses(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Manage subscription for a virtual chain changed notification event.
     * Virtual chain changed notification event is produced when the virtual
     * chain changes in the Tondi BlockDAG.
     * @param {boolean} include_accepted_transaction_ids
     * @returns {Promise<void>}
     */
    subscribeVirtualChainChanged(include_accepted_transaction_ids) {
        const ret = wasm.rpcclient_subscribeVirtualChainChanged(this.__wbg_ptr, include_accepted_transaction_ids);
        return ret;
    }
    /**
     * Retrieves the current network configuration.
     * Returned information: Current network configuration.
     * @see {@link IGetCurrentNetworkRequest}, {@link IGetCurrentNetworkResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetCurrentNetworkRequest | null} [request]
     * @returns {Promise<IGetCurrentNetworkResponse>}
     */
    getCurrentNetwork(request) {
        const ret = wasm.rpcclient_getCurrentNetwork(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Current rpc resolver
     * @returns {Resolver | undefined}
     */
    get resolver() {
        const ret = wasm.rpcclient_resolver(this.__wbg_ptr);
        return ret === 0 ? undefined : Resolver.__wrap(ret);
    }
    /**
     * Manage subscription for a virtual DAA score changed notification event.
     * Virtual DAA score changed notification event is produced when the virtual
     * Difficulty Adjustment Algorithm (DAA) score changes in the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    unsubscribeVirtualDaaScoreChanged() {
        const ret = wasm.rpcclient_unsubscribeVirtualDaaScoreChanged(this.__wbg_ptr);
        return ret;
    }
    /**
     * Optional: Resolver node id.
     * @returns {string | undefined}
     */
    get nodeId() {
        const ret = wasm.rpcclient_nodeId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Returns the blue score of the current sink block, indicating
     * the total amount of work that has been done on the main chain
     * leading up to that block.
     * Returned information: Blue score of the sink block.
     * @see {@link IGetSinkBlueScoreRequest}, {@link IGetSinkBlueScoreResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetSinkBlueScoreRequest | null} [request]
     * @returns {Promise<IGetSinkBlueScoreResponse>}
     */
    getSinkBlueScore(request) {
        const ret = wasm.rpcclient_getSinkBlueScore(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     *
     * Unregister a single event listener callback from all events.
     *
     *
     * @param {RpcEventCallback} callback
     */
    clearEventListener(callback) {
        const ret = wasm.rpcclient_clearEventListener(this.__wbg_ptr, callback);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Subscribe for a UTXOs changed notification event.
     * UTXOs changed notification event is produced when the set
     * of unspent transaction outputs (UTXOs) changes in the
     * Tondi BlockDAG. The event notification will be scoped to the
     * provided list of addresses.
     * @param {(Address | string)[]} addresses
     * @returns {Promise<void>}
     */
    subscribeUtxosChanged(addresses) {
        const ret = wasm.rpcclient_subscribeUtxosChanged(this.__wbg_ptr, addresses);
        return ret;
    }
    /**
     * Constructs an WebSocket RPC URL given the partial URL or an IP, RPC encoding
     * and a network type.
     *
     * # Arguments
     *
     * * `url` - Partial URL or an IP address
     * * `encoding` - RPC encoding
     * * `network_type` - Network type
     * @param {string} url
     * @param {Encoding} encoding
     * @param {NetworkId} network
     * @returns {string}
     */
    static parseUrl(url, encoding, network) {
        let deferred4_0;
        let deferred4_1;
        try {
            const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(network, NetworkId);
            var ptr1 = network.__destroy_into_raw();
            const ret = wasm.rpcclient_parseUrl(ptr0, len0, encoding, ptr1);
            var ptr3 = ret[0];
            var len3 = ret[1];
            if (ret[3]) {
                ptr3 = 0; len3 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
     * Manage subscription for a sink blue score changed notification event.
     * Sink blue score changed notification event is produced when the blue
     * score of the sink block changes in the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeSinkBlueScoreChanged() {
        const ret = wasm.rpcclient_subscribeSinkBlueScoreChanged(this.__wbg_ptr);
        return ret;
    }
    /**
     * Bans a peer from connecting to the Tondi node for a specified duration.
     * Returned information: None.
     * @see {@link IBanRequest}, {@link IBanResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IBanRequest} request
     * @returns {Promise<IBanResponse>}
     */
    ban(request) {
        const ret = wasm.rpcclient_ban(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Connect to the Tondi RPC server. This function starts a background
     * task that connects and reconnects to the server if the connection
     * is terminated.  Use [`disconnect()`](Self::disconnect()) to
     * terminate the connection.
     * @see {@link IConnectOptions} interface for more details.
     * @param {IConnectOptions | undefined | null} [args]
     * @returns {Promise<void>}
     */
    connect(args) {
        const ret = wasm.rpcclient_connect(this.__wbg_ptr, isLikeNone(args) ? 0 : addToExternrefTable0(args));
        return ret;
    }
    /**
     * Manage subscription for a new block template notification event.
     * New block template notification event is produced when a new block
     * template is generated for mining in the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    subscribeNewBlockTemplate() {
        const ret = wasm.rpcclient_subscribeNewBlockTemplate(this.__wbg_ptr);
        return ret;
    }
    /**
     * Manage subscription for a pruning point UTXO set override notification event.
     * Pruning point UTXO set override notification event is produced when the
     * UTXO set override for the pruning point changes in the Tondi BlockDAG.
     * @returns {Promise<void>}
     */
    subscribePruningPointUtxoSetOverride() {
        const ret = wasm.rpcclient_subscribePruningPointUtxoSetOverride(this.__wbg_ptr);
        return ret;
    }
    /**
     * Gracefully shuts down the Tondi node.
     * Returned information: None.
     * @see {@link IShutdownRequest}, {@link IShutdownResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IShutdownRequest | null} [request]
     * @returns {Promise<IShutdownResponse>}
     */
    shutdown(request) {
        const ret = wasm.rpcclient_shutdown(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Provides information about the Directed Acyclic Graph (DAG)
     * structure of the Tondi BlockDAG.
     * Returned information: Number of blocks in the DAG,
     * number of tips in the DAG, hash of the selected parent block,
     * difficulty of the selected parent block, selected parent block
     * blue score, selected parent block time.
     * @see {@link IGetBlockDagInfoRequest}, {@link IGetBlockDagInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetBlockDagInfoRequest | null} [request]
     * @returns {Promise<IGetBlockDagInfoResponse>}
     */
    getBlockDagInfo(request) {
        const ret = wasm.rpcclient_getBlockDagInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Submits an RBF transaction to the Tondi network.
     * Returned information: Submitted Transaction Id, Transaction that was replaced.
     * @see {@link ISubmitTransactionReplacementRequest}, {@link ISubmitTransactionReplacementResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {ISubmitTransactionReplacementRequest} request
     * @returns {Promise<ISubmitTransactionReplacementResponse>}
     */
    submitTransactionReplacement(request) {
        const ret = wasm.rpcclient_submitTransactionReplacement(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves block headers from the Tondi BlockDAG.
     * Returned information: List of block headers.
     * @see {@link IGetHeadersRequest}, {@link IGetHeadersResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetHeadersRequest} request
     * @returns {Promise<IGetHeadersResponse>}
     */
    getHeaders(request) {
        const ret = wasm.rpcclient_getHeaders(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Checks if block is blue or not.
     * Returned information: Block blueness.
     * @see {@link IGetCurrentBlockColorRequest}, {@link IGetCurrentBlockColorResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetCurrentBlockColorRequest} request
     * @returns {Promise<IGetCurrentBlockColorResponse>}
     */
    getCurrentBlockColor(request) {
        const ret = wasm.rpcclient_getCurrentBlockColor(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @param {Encoding} encoding
     * @param {NetworkType | NetworkId | string} network
     * @returns {number}
     */
    static defaultPort(encoding, network) {
        const ret = wasm.rpcclient_defaultPort(encoding, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * The current protocol encoding.
     * @returns {string}
     */
    get encoding() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.rpcclient_encoding(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Retrieves unspent transaction outputs (UTXOs) associated with
     * specific addresses.
     * Returned information: List of UTXOs.
     * @see {@link IGetUtxosByAddressesRequest}, {@link IGetUtxosByAddressesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetUtxosByAddressesRequest | Address[] | string[]} request
     * @returns {Promise<IGetUtxosByAddressesResponse>}
     */
    getUtxosByAddresses(request) {
        const ret = wasm.rpcclient_getUtxosByAddresses(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves information about a subnetwork in the Tondi BlockDAG.
     * Returned information: Subnetwork information.
     * @see {@link IGetSubnetworkRequest}, {@link IGetSubnetworkResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetSubnetworkRequest} request
     * @returns {Promise<IGetSubnetworkResponse>}
     */
    getSubnetwork(request) {
        const ret = wasm.rpcclient_getSubnetwork(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves various metrics and statistics related to the
     * performance and status of the Tondi node.
     * Returned information: Memory usage, CPU usage, network activity.
     * @see {@link IGetMetricsRequest}, {@link IGetMetricsResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetMetricsRequest | null} [request]
     * @returns {Promise<IGetMetricsResponse>}
     */
    getMetrics(request) {
        const ret = wasm.rpcclient_getMetrics(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Generates a new block template for mining.
     * Returned information: Block template information.
     * @see {@link IGetBlockTemplateRequest}, {@link IGetBlockTemplateResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBlockTemplateRequest} request
     * @returns {Promise<IGetBlockTemplateResponse>}
     */
    getBlockTemplate(request) {
        const ret = wasm.rpcclient_getBlockTemplate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Unsubscribe from UTXOs changed notification event
     * for a specific set of addresses.
     * @param {(Address | string)[]} addresses
     * @returns {Promise<void>}
     */
    unsubscribeUtxosChanged(addresses) {
        const ret = wasm.rpcclient_unsubscribeUtxosChanged(this.__wbg_ptr, addresses);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeNewBlockTemplate() {
        const ret = wasm.rpcclient_unsubscribeNewBlockTemplate(this.__wbg_ptr);
        return ret;
    }
    /**
     * Estimates the network's current hash rate in hashes per second.
     * Returned information: Estimated network hashes per second.
     * @see {@link IEstimateNetworkHashesPerSecondRequest}, {@link IEstimateNetworkHashesPerSecondResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IEstimateNetworkHashesPerSecondRequest} request
     * @returns {Promise<IEstimateNetworkHashesPerSecondResponse>}
     */
    estimateNetworkHashesPerSecond(request) {
        const ret = wasm.rpcclient_estimateNetworkHashesPerSecond(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves the balance of a specific address in the Tondi BlockDAG.
     * Returned information: Balance of the address.
     * @see {@link IGetBalanceByAddressRequest}, {@link IGetBalanceByAddressResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBalanceByAddressRequest} request
     * @returns {Promise<IGetBalanceByAddressResponse>}
     */
    getBalanceByAddress(request) {
        const ret = wasm.rpcclient_getBalanceByAddress(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeBlockAdded() {
        const ret = wasm.rpcclient_unsubscribeBlockAdded(this.__wbg_ptr);
        return ret;
    }
    /**
     * Manage subscription for a virtual chain changed notification event.
     * Virtual chain changed notification event is produced when the virtual
     * chain changes in the Tondi BlockDAG.
     * @param {boolean} include_accepted_transaction_ids
     * @returns {Promise<void>}
     */
    unsubscribeVirtualChainChanged(include_accepted_transaction_ids) {
        const ret = wasm.rpcclient_unsubscribeVirtualChainChanged(this.__wbg_ptr, include_accepted_transaction_ids);
        return ret;
    }
    /**
     * Stop background RPC services (automatically stopped when invoking {@link RpcClient.disconnect}).
     * @returns {Promise<void>}
     */
    stop() {
        const ret = wasm.rpcclient_stop(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeFinalityConflictResolved() {
        const ret = wasm.rpcclient_unsubscribeFinalityConflictResolved(this.__wbg_ptr);
        return ret;
    }
    /**
     * Retrieves information about the peers connected to the Tondi node.
     * Returned information: Peer ID, IP address and port, connection
     * status, protocol version.
     * @see {@link IGetConnectedPeerInfoRequest}, {@link IGetConnectedPeerInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetConnectedPeerInfoRequest | null} [request]
     * @returns {Promise<IGetConnectedPeerInfoResponse>}
     */
    getConnectedPeerInfo(request) {
        const ret = wasm.rpcclient_getConnectedPeerInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Feerate estimates (experimental)
     * @see {@link IGetFeeEstimateExperimentalRequest}, {@link IGetFeeEstimateExperimentalResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetFeeEstimateExperimentalRequest} request
     * @returns {Promise<IGetFeeEstimateExperimentalResponse>}
     */
    getFeeEstimateExperimental(request) {
        const ret = wasm.rpcclient_getFeeEstimateExperimental(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves balances for multiple addresses in the Tondi BlockDAG.
     * Returned information: Balances of the addresses.
     * @see {@link IGetBalancesByAddressesRequest}, {@link IGetBalancesByAddressesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBalancesByAddressesRequest | Address[] | string[]} request
     * @returns {Promise<IGetBalancesByAddressesResponse>}
     */
    getBalancesByAddresses(request) {
        const ret = wasm.rpcclient_getBalancesByAddresses(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves a specific block from the Tondi BlockDAG.
     * Returned information: Block information.
     * @see {@link IGetBlockRequest}, {@link IGetBlockResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetBlockRequest} request
     * @returns {Promise<IGetBlockResponse>}
     */
    getBlock(request) {
        const ret = wasm.rpcclient_getBlock(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Retrieves the current sink block, which is the block with
     * the highest cumulative difficulty in the Tondi BlockDAG.
     * Returned information: Sink block hash, sink block height.
     * @see {@link IGetSinkRequest}, {@link IGetSinkResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetSinkRequest | null} [request]
     * @returns {Promise<IGetSinkResponse>}
     */
    getSink(request) {
        const ret = wasm.rpcclient_getSink(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Returns the total current coin supply of Tondi network.
     * Returned information: Total coin supply.
     * @see {@link IGetCoinSupplyRequest}, {@link IGetCoinSupplyResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetCoinSupplyRequest | null} [request]
     * @returns {Promise<IGetCoinSupplyResponse>}
     */
    getCoinSupply(request) {
        const ret = wasm.rpcclient_getCoinSupply(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeFinalityConflict() {
        const ret = wasm.rpcclient_unsubscribeFinalityConflict(this.__wbg_ptr);
        return ret;
    }
    /**
     * Manage subscription for a finality conflict resolved notification event.
     * Finality conflict resolved notification event is produced when a finality
     * conflict in the Tondi BlockDAG is resolved.
     * @returns {Promise<void>}
     */
    subscribeFinalityConflictResolved() {
        const ret = wasm.rpcclient_subscribeFinalityConflictResolved(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    unsubscribeSinkBlueScoreChanged() {
        const ret = wasm.rpcclient_unsubscribeSinkBlueScoreChanged(this.__wbg_ptr);
        return ret;
    }
    /**
     * The current connection status of the RPC client.
     * @returns {boolean}
     */
    get isConnected() {
        const ret = wasm.rpcclient_isConnected(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Start background RPC services (automatically started when invoking {@link RpcClient.connect}).
     * @returns {Promise<void>}
     */
    start() {
        const ret = wasm.rpcclient_start(this.__wbg_ptr);
        return ret;
    }
    /**
     * Retrieves information about the Tondi server.
     * Returned information: Version of the Tondi server, protocol
     * version, network identifier.
     * @see {@link IGetServerInfoRequest}, {@link IGetServerInfoResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetServerInfoRequest | null} [request]
     * @returns {Promise<IGetServerInfoResponse>}
     */
    getServerInfo(request) {
        const ret = wasm.rpcclient_getServerInfo(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Feerate estimates
     * @see {@link IGetFeeEstimateRequest}, {@link IGetFeeEstimateResponse}
     * @throws `string` on an RPC error or a server-side error.
     * @param {IGetFeeEstimateRequest | null} [request]
     * @returns {Promise<IGetFeeEstimateResponse>}
     */
    getFeeEstimate(request) {
        const ret = wasm.rpcclient_getFeeEstimate(this.__wbg_ptr, isLikeNone(request) ? 0 : addToExternrefTable0(request));
        return ret;
    }
    /**
     * Retrieves mempool entries from the Tondi node's mempool.
     * Returned information: List of mempool entries.
     * @see {@link IGetMempoolEntriesRequest}, {@link IGetMempoolEntriesResponse}
     * @throws `string` on an RPC error, a server-side error or when supplying incorrect arguments.
     * @param {IGetMempoolEntriesRequest} request
     * @returns {Promise<IGetMempoolEntriesResponse>}
     */
    getMempoolEntries(request) {
        const ret = wasm.rpcclient_getMempoolEntries(this.__wbg_ptr, request);
        return ret;
    }
}

const ScriptPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scriptpublickey_free(ptr >>> 0, 1));
/**
 * Represents a tondid ScriptPublicKey
 * @category Consensus
 */
export class ScriptPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScriptPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        ScriptPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            version: this.version,
            script: this.script,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScriptPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scriptpublickey_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.__wbg_get_scriptpublickey_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set version(arg0) {
        wasm.__wbg_set_scriptpublickey_version(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} version
     * @param {any} script
     */
    constructor(version, script) {
        const ret = wasm.scriptpublickey_constructor(version, script);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ScriptPublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get script() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.scriptpublickey_script_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const SetAadOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_setaadoptions_free(ptr >>> 0, 1));

export class SetAadOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SetAadOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_setaadoptions_free(ptr, 0);
    }
    /**
     * @param {Function} value
     */
    set transform(value) {
        wasm.setaadoptions_set_transform(this.__wbg_ptr, value);
    }
    /**
     * @param {Function} value
     */
    set flush(value) {
        wasm.setaadoptions_set_flush(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set plaintext_length(value) {
        wasm.setaadoptions_set_plaintext_length(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get plaintextLength() {
        const ret = wasm.setaadoptions_plaintextLength(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Function}
     */
    get transform() {
        const ret = wasm.setaadoptions_transform(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} flush
     * @param {number} plaintext_length
     * @param {Function} transform
     */
    constructor(flush, plaintext_length, transform) {
        const ret = wasm.setaadoptions_new(flush, plaintext_length, transform);
        this.__wbg_ptr = ret >>> 0;
        SetAadOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Function}
     */
    get flush() {
        const ret = wasm.setaadoptions_flush(this.__wbg_ptr);
        return ret;
    }
}

const SigHashTypeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sighashtype_free(ptr >>> 0, 1));

export class SigHashType {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SigHashTypeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sighashtype_free(ptr, 0);
    }
}

const StorageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_storage_free(ptr >>> 0, 1));
/**
 * Wallet file storage interface
 * @category Wallet SDK
 */
export class Storage {

    toJSON() {
        return {
            filename: this.filename,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StorageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_storage_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get filename() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.storage_filename(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const StreamTransformOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_streamtransformoptions_free(ptr >>> 0, 1));

export class StreamTransformOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StreamTransformOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streamtransformoptions_free(ptr, 0);
    }
    /**
     * @param {Function} value
     */
    set flush(value) {
        wasm.streamtransformoptions_set_flush(this.__wbg_ptr, value);
    }
    /**
     * @returns {Function}
     */
    get transform() {
        const ret = wasm.streamtransformoptions_transform(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Function}
     */
    get flush() {
        const ret = wasm.streamtransformoptions_flush(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Function} value
     */
    set transform(value) {
        wasm.streamtransformoptions_set_transform(this.__wbg_ptr, value);
    }
    /**
     * @param {Function} flush
     * @param {Function} transform
     */
    constructor(flush, transform) {
        const ret = wasm.streamtransformoptions_new(flush, transform);
        this.__wbg_ptr = ret >>> 0;
        StreamTransformOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const TransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transaction_free(ptr >>> 0, 1));
/**
 * Represents a Tondi transaction.
 * This is an artificial construct that includes additional
 * transaction-related data such as additional data from UTXOs
 * used by transaction inputs.
 * @category Consensus
 */
export class Transaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Transaction.prototype);
        obj.__wbg_ptr = ptr;
        TransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            gas: this.gas,
            inputs: this.inputs,
            id: this.id,
            mass: this.mass,
            subnetworkId: this.subnetworkId,
            version: this.version,
            payload: this.payload,
            outputs: this.outputs,
            lockTime: this.lockTime,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr, 0);
    }
    /**
     * Recompute and finalize the tx id based on updated tx fields
     * @returns {Hash}
     */
    finalize() {
        const ret = wasm.transaction_finalize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Hash.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get gas() {
        const ret = wasm.transaction_gas(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {any} js_value
     */
    set subnetworkId(js_value) {
        wasm.transaction_set_subnetwork_id_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * Deserialize the {@link Transaction} Object from a pure JavaScript Object.
     * @param {any} js_value
     * @returns {Transaction}
     */
    static deserializeFromObject(js_value) {
        const ret = wasm.transaction_deserializeFromObject(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * Serializes the transaction to a "Safe" JSON schema where it converts all `bigint` values to `string` to avoid potential client-side precision loss.
     * @returns {string}
     */
    serializeToSafeJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.transaction_serializeToSafeJSON(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {TransactionInput[]}
     */
    get inputs() {
        const ret = wasm.transaction_get_inputs_as_js_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} v
     */
    set gas(v) {
        wasm.transaction_set_gas(this.__wbg_ptr, v);
    }
    /**
     * Deserialize the {@link Transaction} Object from a JSON string.
     * @param {string} json
     * @returns {Transaction}
     */
    static deserializeFromJSON(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.transaction_deserializeFromJSON(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * Returns the transaction ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transaction_id(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {bigint} v
     */
    set lockTime(v) {
        wasm.transaction_set_lockTime(this.__wbg_ptr, v);
    }
    /**
     * @returns {bigint}
     */
    get mass() {
        const ret = wasm.transaction_get_mass(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} v
     */
    set mass(v) {
        wasm.transaction_set_mass(this.__wbg_ptr, v);
    }
    /**
     * Determines whether or not a transaction is a coinbase transaction. A coinbase
     * transaction is a special transaction created by miners that distributes fees and block subsidy
     * to the previous blocks' miners, and specifies the script_pub_key that will be used to pay the current
     * miner in future blocks.
     * @returns {boolean}
     */
    is_coinbase() {
        const ret = wasm.transaction_is_coinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    get subnetworkId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transaction_get_subnetwork_id_as_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Serializes the transaction to a JSON string.
     * The schema of the JSON is defined by {@link ISerializableTransaction}.
     * @returns {string}
     */
    serializeToJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.transaction_serializeToJSON(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {ITransaction | Transaction} js_value
     */
    constructor(js_value) {
        const ret = wasm.transaction_constructor(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TransactionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.transaction_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {(ITransactionInput | TransactionInput)[]} js_value
     */
    set inputs(js_value) {
        wasm.transaction_set_inputs_from_js_array(this.__wbg_ptr, js_value);
    }
    /**
     * @param {any} js_value
     */
    set payload(js_value) {
        wasm.transaction_set_payload_from_js_value(this.__wbg_ptr, js_value);
    }
    /**
     * @returns {string}
     */
    get payload() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transaction_get_payload_as_hex_string(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {TransactionOutput[]}
     */
    get outputs() {
        const ret = wasm.transaction_get_outputs_as_js_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    get lockTime() {
        const ret = wasm.transaction_lockTime(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Deserialize the {@link Transaction} Object from a "Safe" JSON schema where all `bigint` values are represented as `string`.
     * @param {string} json
     * @returns {Transaction}
     */
    static deserializeFromSafeJSON(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.transaction_deserializeFromSafeJSON(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * Serializes the transaction to a pure JavaScript Object.
     * The schema of the JavaScript object is defined by {@link ISerializableTransaction}.
     * @see {@link ISerializableTransaction}
     * @returns {ISerializableTransaction}
     */
    serializeToObject() {
        const ret = wasm.transaction_serializeToObject(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {(ITransactionOutput | TransactionOutput)[]} js_value
     */
    set outputs(js_value) {
        wasm.transaction_set_outputs_from_js_array(this.__wbg_ptr, js_value);
    }
    /**
     * @param {number} v
     */
    set version(v) {
        wasm.transaction_set_version(this.__wbg_ptr, v);
    }
    /**
     * Returns a list of unique addresses used by transaction inputs.
     * This method can be used to determine addresses used by transaction inputs
     * in order to select private keys needed for transaction signing.
     * @param {NetworkType | NetworkId | string} network_type
     * @returns {Address[]}
     */
    addresses(network_type) {
        const ret = wasm.transaction_addresses(this.__wbg_ptr, network_type);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const TransactionInputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactioninput_free(ptr >>> 0, 1));
/**
 * Represents a Tondi transaction input
 * @category Consensus
 */
export class TransactionInput {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionInput.prototype);
        obj.__wbg_ptr = ptr;
        TransactionInputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            sequence: this.sequence,
            previousOutpoint: this.previousOutpoint,
            signatureScript: this.signatureScript,
            sigOpCount: this.sigOpCount,
            utxo: this.utxo,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionInputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactioninput_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get sequence() {
        const ret = wasm.transactioninput_get_sequence(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {TransactionOutpoint}
     */
    get previousOutpoint() {
        const ret = wasm.transactioninput_get_previous_outpoint(this.__wbg_ptr);
        return TransactionOutpoint.__wrap(ret);
    }
    /**
     * @returns {string | undefined}
     */
    get signatureScript() {
        const ret = wasm.transactioninput_get_signature_script_as_hex(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {any} js_value
     */
    set previousOutpoint(js_value) {
        const ret = wasm.transactioninput_set_previous_outpoint(this.__wbg_ptr, js_value);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {bigint} sequence
     */
    set sequence(sequence) {
        wasm.transactioninput_set_sequence(this.__wbg_ptr, sequence);
    }
    /**
     * @param {number} sig_op_count
     */
    set sigOpCount(sig_op_count) {
        wasm.transactioninput_set_sig_op_count(this.__wbg_ptr, sig_op_count);
    }
    /**
     * @returns {number}
     */
    get sigOpCount() {
        const ret = wasm.transactioninput_get_sig_op_count(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ITransactionInput | TransactionInput} value
     */
    constructor(value) {
        const ret = wasm.transactioninput_constructor(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TransactionInputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} js_value
     */
    set signatureScript(js_value) {
        const ret = wasm.transactioninput_set_signature_script_from_js_value(this.__wbg_ptr, js_value);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {UtxoEntryReference | undefined}
     */
    get utxo() {
        const ret = wasm.transactioninput_get_utxo(this.__wbg_ptr);
        return ret === 0 ? undefined : UtxoEntryReference.__wrap(ret);
    }
}

const TransactionOutpointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionoutpoint_free(ptr >>> 0, 1));
/**
 * Represents a Tondi transaction outpoint.
 * NOTE: This struct is immutable - to create a custom outpoint
 * use the `TransactionOutpoint::new` constructor. (in JavaScript
 * use `new TransactionOutpoint(transactionId, index)`).
 * @category Consensus
 */
export class TransactionOutpoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionOutpoint.prototype);
        obj.__wbg_ptr = ptr;
        TransactionOutpointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            index: this.index,
            transactionId: this.transactionId,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionOutpointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionoutpoint_free(ptr, 0);
    }
    /**
     * @param {Hash} transaction_id
     * @param {number} index
     */
    constructor(transaction_id, index) {
        _assertClass(transaction_id, Hash);
        var ptr0 = transaction_id.__destroy_into_raw();
        const ret = wasm.transactionoutpoint_ctor(ptr0, index);
        this.__wbg_ptr = ret >>> 0;
        TransactionOutpointFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get index() {
        const ret = wasm.transactionoutpoint_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    getId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionoutpoint_getId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get transactionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionoutpoint_transactionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const TransactionOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionoutput_free(ptr >>> 0, 1));
/**
 * Represents a Tondid transaction output
 * @category Consensus
 */
export class TransactionOutput {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionOutput.prototype);
        obj.__wbg_ptr = ptr;
        TransactionOutputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            value: this.value,
            scriptPublicKey: this.scriptPublicKey,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionOutputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionoutput_free(ptr, 0);
    }
    /**
     * TransactionOutput constructor
     * @param {bigint} value
     * @param {ScriptPublicKey} script_public_key
     */
    constructor(value, script_public_key) {
        _assertClass(script_public_key, ScriptPublicKey);
        const ret = wasm.transactionoutput_ctor(value, script_public_key.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        TransactionOutputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {bigint} v
     */
    set value(v) {
        wasm.transactionoutput_set_value(this.__wbg_ptr, v);
    }
    /**
     * @param {ScriptPublicKey} v
     */
    set scriptPublicKey(v) {
        _assertClass(v, ScriptPublicKey);
        wasm.transactionoutput_set_scriptPublicKey(this.__wbg_ptr, v.__wbg_ptr);
    }
    /**
     * @returns {bigint}
     */
    get value() {
        const ret = wasm.transactionoutput_value(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.transactionoutput_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
}

const TransactionRecordFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionrecord_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class TransactionRecord {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionRecord.prototype);
        obj.__wbg_ptr = ptr;
        TransactionRecordFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            binding: this.binding,
            type: this.type,
            blockDaaScore: this.blockDaaScore,
            data: this.data,
            id: this.id,
            unixtimeMsec: this.unixtimeMsec,
            network: this.network,
            note: this.note,
            metadata: this.metadata,
            value: this.value,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionRecordFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionrecord_free(ptr, 0);
    }
    /**
     * Serialize the transaction record to a JavaScript object.
     * @returns {any}
     */
    serialize() {
        const ret = wasm.transactionrecord_serialize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if the transaction record has the given address within the associated UTXO set.
     * @param {Address} address
     * @returns {boolean}
     */
    hasAddress(address) {
        _assertClass(address, Address);
        const ret = wasm.transactionrecord_hasAddress(this.__wbg_ptr, address.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {IBinding}
     */
    get binding() {
        const ret = wasm.transactionrecord_binding(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionrecord_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.transactionrecord_blockDaaScore(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ITransactionData}
     */
    get data() {
        const ret = wasm.transactionrecord_data(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Hash}
     */
    get id() {
        const ret = wasm.__wbg_get_transactionrecord_id(this.__wbg_ptr);
        return Hash.__wrap(ret);
    }
    /**
     * @param {Hash} arg0
     */
    set id(arg0) {
        _assertClass(arg0, Hash);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionrecord_id(this.__wbg_ptr, ptr0);
    }
    /**
     * Unix time in milliseconds
     * @returns {bigint | undefined}
     */
    get unixtimeMsec() {
        const ret = wasm.__wbg_get_transactionrecord_unixtimeMsec(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : BigInt.asUintN(64, ret[1]);
    }
    /**
     * Unix time in milliseconds
     * @param {bigint | null} [arg0]
     */
    set unixtimeMsec(arg0) {
        wasm.__wbg_set_transactionrecord_unixtimeMsec(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? BigInt(0) : arg0);
    }
    /**
     * @returns {NetworkId}
     */
    get network() {
        const ret = wasm.__wbg_get_transactionrecord_network(this.__wbg_ptr);
        return NetworkId.__wrap(ret);
    }
    /**
     * @param {NetworkId} arg0
     */
    set network(arg0) {
        _assertClass(arg0, NetworkId);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionrecord_network(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get note() {
        const ret = wasm.__wbg_get_transactionrecord_note(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set note(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_transactionrecord_note(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get metadata() {
        const ret = wasm.__wbg_get_transactionrecord_metadata(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set metadata(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_transactionrecord_metadata(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {bigint}
     */
    get value() {
        const ret = wasm.transactionrecord_value(this.__wbg_ptr);
        return ret;
    }
}

const TransactionRecordNotificationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionrecordnotification_free(ptr >>> 0, 1));

export class TransactionRecordNotification {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionRecordNotification.prototype);
        obj.__wbg_ptr = ptr;
        TransactionRecordNotificationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            type: this.type,
            data: this.data,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionRecordNotificationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionrecordnotification_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_transactionrecordnotification_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set type(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_transactionrecordnotification_type(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {TransactionRecord}
     */
    get data() {
        const ret = wasm.__wbg_get_transactionrecordnotification_data(this.__wbg_ptr);
        return TransactionRecord.__wrap(ret);
    }
    /**
     * @param {TransactionRecord} arg0
     */
    set data(arg0) {
        _assertClass(arg0, TransactionRecord);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionrecordnotification_data(this.__wbg_ptr, ptr0);
    }
}

const TransactionSigningHashFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionsigninghash_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class TransactionSigningHash {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionSigningHashFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionsigninghash_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    finalize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionsigninghash_finalize(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    constructor() {
        const ret = wasm.transactionsigninghash_new();
        this.__wbg_ptr = ret >>> 0;
        TransactionSigningHashFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {HexString | Uint8Array} data
     */
    update(data) {
        const ret = wasm.transactionsigninghash_update(this.__wbg_ptr, data);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const TransactionSigningHashECDSAFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionsigninghashecdsa_free(ptr >>> 0, 1));
/**
 * @category Wallet SDK
 */
export class TransactionSigningHashECDSA {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionSigningHashECDSAFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionsigninghashecdsa_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    finalize() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionsigninghashecdsa_finalize(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    constructor() {
        const ret = wasm.transactionsigninghashecdsa_new();
        this.__wbg_ptr = ret >>> 0;
        TransactionSigningHashECDSAFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {HexString | Uint8Array} data
     */
    update(data) {
        const ret = wasm.transactionsigninghashecdsa_update(this.__wbg_ptr, data);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const TransactionUtxoEntryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionutxoentry_free(ptr >>> 0, 1));
/**
 * Holds details about an individual transaction output in a utxo
 * set such as whether or not it was contained in a coinbase tx, the daa
 * score of the block that accepts the tx, its public key script, and how
 * much it pays.
 * @category Consensus
 */
export class TransactionUtxoEntry {

    toJSON() {
        return {
            amount: this.amount,
            scriptPublicKey: this.scriptPublicKey,
            blockDaaScore: this.blockDaaScore,
            isCoinbase: this.isCoinbase,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionUtxoEntryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionutxoentry_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_transactionutxoentry_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_transactionutxoentry_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.__wbg_get_transactionutxoentry_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * @param {ScriptPublicKey} arg0
     */
    set scriptPublicKey(arg0) {
        _assertClass(arg0, ScriptPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_transactionutxoentry_scriptPublicKey(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.__wbg_get_transactionutxoentry_blockDaaScore(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set blockDaaScore(arg0) {
        wasm.__wbg_set_transactionutxoentry_blockDaaScore(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get isCoinbase() {
        const ret = wasm.__wbg_get_transactionutxoentry_isCoinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set isCoinbase(arg0) {
        wasm.__wbg_set_transactionutxoentry_isCoinbase(this.__wbg_ptr, arg0);
    }
}

const UserInfoOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_userinfooptions_free(ptr >>> 0, 1));

export class UserInfoOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UserInfoOptions.prototype);
        obj.__wbg_ptr = ptr;
        UserInfoOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UserInfoOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_userinfooptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.userinfooptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.userinfooptions_encoding(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {UserInfoOptions}
     */
    static new() {
        const ret = wasm.userinfooptions_new();
        return UserInfoOptions.__wrap(ret);
    }
    /**
     * @param {string | null} [encoding]
     */
    constructor(encoding) {
        const ret = wasm.userinfooptions_new_with_values(isLikeNone(encoding) ? 0 : addToExternrefTable0(encoding));
        this.__wbg_ptr = ret >>> 0;
        UserInfoOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const UtxoContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxocontext_free(ptr >>> 0, 1));
/**
 *
 * UtxoContext is a class that provides a way to track addresses activity
 * on the Tondi network.  When an address is registered with UtxoContext
 * it aggregates all UTXO entries for that address and emits events when
 * any activity against these addresses occurs.
 *
 * UtxoContext constructor accepts {@link IUtxoContextArgs} interface that
 * can contain an optional id parameter.  If supplied, this `id` parameter
 * will be included in all notifications emitted by the UtxoContext as
 * well as included as a part of {@link ITransactionRecord} emitted when
 * transactions occur. If not provided, a random id will be generated. This id
 * typically represents an account id in the context of a wallet application.
 * The integrated Wallet API uses UtxoContext to represent wallet accounts.
 *
 * **Exchanges:** if you are building an exchange wallet, it is recommended
 * to use UtxoContext for each user account.  This way you can track and isolate
 * each user activity (use address set, balances, transaction records).
 *
 * UtxoContext maintains a real-time cumulative balance of all addresses
 * registered against it and provides balance update notification events
 * when the balance changes.
 *
 * The UtxoContext balance is comprised of 3 values:
 * - `mature`: amount of funds available for spending.
 * - `pending`: amount of funds that are being received.
 * - `outgoing`: amount of funds that are being sent but are not yet accepted by the network.
 *
 * Please see {@link IBalance} interface for more details.
 *
 * UtxoContext can be supplied as a UTXO source to the transaction {@link Generator}
 * allowing the {@link Generator} to create transactions using the
 * UTXO entries it manages.
 *
 * **IMPORTANT:** UtxoContext is meant to represent a single account.  It is not
 * designed to be used as a global UTXO manager for all addresses in a very large
 * wallet (such as an exchange wallet). For such use cases, it is recommended to
 * perform manual UTXO management by subscribing to UTXO notifications using
 * {@link RpcClient.subscribeUtxosChanged} and {@link RpcClient.getUtxosByAddresses}.
 *
 * @see {@link IUtxoContextArgs},
 * {@link UtxoProcessor},
 * {@link Generator},
 * {@link createTransactions},
 * {@link IBalance},
 * {@link IBalanceEvent},
 * {@link IPendingEvent},
 * {@link IReorgEvent},
 * {@link IStasisEvent},
 * {@link IMaturityEvent},
 * {@link IDiscoveryEvent},
 * {@link IBalanceEvent},
 * {@link ITransactionRecord}
 *
 * @category Wallet SDK
 */
export class UtxoContext {

    toJSON() {
        return {
            balanceStrings: this.balanceStrings,
            balance: this.balance,
            isActive: this.isActive,
            matureLength: this.matureLength,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoContextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxocontext_free(ptr, 0);
    }
    /**
     * Current {@link BalanceStrings} of the UtxoContext.
     * @returns {BalanceStrings | undefined}
     */
    get balanceStrings() {
        const ret = wasm.utxocontext_balanceStrings(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : BalanceStrings.__wrap(ret[0]);
    }
    /**
     * Returns pending UTXO entries that are currently managed by the UtxoContext.
     * @returns {UtxoEntryReference[]}
     */
    getPending() {
        const ret = wasm.utxocontext_getPending(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     *
     * Returns a range of mature UTXO entries that are currently
     * managed by the UtxoContext and are available for spending.
     *
     * NOTE: This function is provided for informational purposes only.
     * **You should not manage UTXO entries manually if they are owned by UtxoContext.**
     *
     * The resulting range may be less than requested if UTXO entries
     * have been spent asynchronously by UtxoContext or by other means
     * (i.e. UtxoContext has received notification from the network that
     * UtxoEntries have been spent externally).
     *
     * UtxoEntries are kept in in the ascending sorted order by their amount.
     * @param {number} from
     * @param {number} to
     * @returns {UtxoEntryReference[]}
     */
    getMatureRange(from, to) {
        const ret = wasm.utxocontext_getMatureRange(this.__wbg_ptr, from, to);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {IUtxoContextArgs} js_value
     */
    constructor(js_value) {
        const ret = wasm.utxocontext_ctor(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UtxoContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Current {@link Balance} of the UtxoContext.
     * @returns {Balance | undefined}
     */
    get balance() {
        const ret = wasm.utxocontext_balance(this.__wbg_ptr);
        return ret === 0 ? undefined : Balance.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    get isActive() {
        const ret = wasm.utxocontext_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Performs a scan of the given addresses and registers them in the context for event notifications.
     * @param {(Address | string)[]} addresses
     * @param {bigint | null} [optional_current_daa_score]
     * @returns {Promise<void>}
     */
    trackAddresses(addresses, optional_current_daa_score) {
        const ret = wasm.utxocontext_trackAddresses(this.__wbg_ptr, addresses, isLikeNone(optional_current_daa_score) ? 0 : addToExternrefTable0(optional_current_daa_score));
        return ret;
    }
    /**
     * Clear the UtxoContext.  Unregister all addresses and clear all UTXO entries.
     * IMPORTANT: This function must be manually called when disconnecting or re-connecting to the node
     * (followed by address re-registration).
     * @returns {Promise<void>}
     */
    clear() {
        const ret = wasm.utxocontext_clear(this.__wbg_ptr);
        return ret;
    }
    /**
     * Obtain the length of the mature UTXO entries that are currently
     * managed by the UtxoContext.
     * @returns {number}
     */
    get matureLength() {
        const ret = wasm.utxocontext_matureLength(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Unregister a list of addresses from the context. This will stop tracking of these addresses.
     * @param {(Address | string)[]} addresses
     * @returns {Promise<void>}
     */
    unregisterAddresses(addresses) {
        const ret = wasm.utxocontext_unregisterAddresses(this.__wbg_ptr, addresses);
        return ret;
    }
}

const UtxoEntriesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoentries_free(ptr >>> 0, 1));
/**
 * A simple collection of UTXO entries. This struct is used to
 * retain a set of UTXO entries in the WASM memory for faster
 * processing. This struct keeps a list of entries represented
 * by `UtxoEntryReference` struct. This data structure is used
 * internally by the framework, but is exposed for convenience.
 * Please consider using `UtxoContext` instead.
 * @category Wallet SDK
 */
export class UtxoEntries {

    toJSON() {
        return {
            items: this.items,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoEntriesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoentries_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    amount() {
        const ret = wasm.utxoentries_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Sort the contained entries by amount. Please note that
     * this function is not intended for use with large UTXO sets
     * as it duplicates the whole contained UTXO set while sorting.
     */
    sort() {
        wasm.utxoentries_sort(this.__wbg_ptr);
    }
    /**
     * @param {any} js_value
     */
    set items(js_value) {
        wasm.utxoentries_set_items_from_js_array(this.__wbg_ptr, js_value);
    }
    /**
     * Create a new `UtxoEntries` struct with a set of entries.
     * @param {any} js_value
     */
    constructor(js_value) {
        const ret = wasm.utxoentries_js_ctor(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UtxoEntriesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get items() {
        const ret = wasm.utxoentries_get_items_as_js_array(this.__wbg_ptr);
        return ret;
    }
}

const UtxoEntryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoentry_free(ptr >>> 0, 1));
/**
 * [`UtxoEntry`] struct represents a client-side UTXO entry.
 *
 * @category Wallet SDK
 */
export class UtxoEntry {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UtxoEntry.prototype);
        obj.__wbg_ptr = ptr;
        UtxoEntryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            address: this.address,
            outpoint: this.outpoint,
            amount: this.amount,
            scriptPublicKey: this.scriptPublicKey,
            blockDaaScore: this.blockDaaScore,
            isCoinbase: this.isCoinbase,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoEntryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoentry_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        const ret = wasm.utxoentry_toString(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Address | undefined}
     */
    get address() {
        const ret = wasm.__wbg_get_utxoentry_address(this.__wbg_ptr);
        return ret === 0 ? undefined : Address.__wrap(ret);
    }
    /**
     * @param {Address | null} [arg0]
     */
    set address(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Address);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_utxoentry_address(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {TransactionOutpoint}
     */
    get outpoint() {
        const ret = wasm.__wbg_get_utxoentry_outpoint(this.__wbg_ptr);
        return TransactionOutpoint.__wrap(ret);
    }
    /**
     * @param {TransactionOutpoint} arg0
     */
    set outpoint(arg0) {
        _assertClass(arg0, TransactionOutpoint);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_utxoentry_outpoint(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.__wbg_get_utxoentry_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount(arg0) {
        wasm.__wbg_set_utxoentry_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.__wbg_get_utxoentry_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * @param {ScriptPublicKey} arg0
     */
    set scriptPublicKey(arg0) {
        _assertClass(arg0, ScriptPublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_utxoentry_scriptPublicKey(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.__wbg_get_utxoentry_blockDaaScore(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set blockDaaScore(arg0) {
        wasm.__wbg_set_utxoentry_blockDaaScore(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get isCoinbase() {
        const ret = wasm.__wbg_get_utxoentry_isCoinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set isCoinbase(arg0) {
        wasm.__wbg_set_utxoentry_isCoinbase(this.__wbg_ptr, arg0);
    }
}

const UtxoEntryReferenceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoentryreference_free(ptr >>> 0, 1));
/**
 * [`Arc`] reference to a [`UtxoEntry`] used by the wallet subsystems.
 *
 * @category Wallet SDK
 */
export class UtxoEntryReference {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UtxoEntryReference.prototype);
        obj.__wbg_ptr = ptr;
        UtxoEntryReferenceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            isCoinbase: this.isCoinbase,
            outpoint: this.outpoint,
            blockDaaScore: this.blockDaaScore,
            entry: this.entry,
            address: this.address,
            scriptPublicKey: this.scriptPublicKey,
            amount: this.amount,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoEntryReferenceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoentryreference_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get isCoinbase() {
        const ret = wasm.utxoentryreference_isCoinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {TransactionOutpoint}
     */
    get outpoint() {
        const ret = wasm.utxoentryreference_outpoint(this.__wbg_ptr);
        return TransactionOutpoint.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get blockDaaScore() {
        const ret = wasm.utxoentryreference_blockDaaScore(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        const ret = wasm.utxoentryreference_toString(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {UtxoEntry}
     */
    get entry() {
        const ret = wasm.utxoentryreference_entry(this.__wbg_ptr);
        return UtxoEntry.__wrap(ret);
    }
    /**
     * @returns {Address | undefined}
     */
    get address() {
        const ret = wasm.utxoentryreference_address(this.__wbg_ptr);
        return ret === 0 ? undefined : Address.__wrap(ret);
    }
    /**
     * @returns {ScriptPublicKey}
     */
    get scriptPublicKey() {
        const ret = wasm.utxoentryreference_scriptPublicKey(this.__wbg_ptr);
        return ScriptPublicKey.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.utxoentryreference_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}

const UtxoProcessorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxoprocessor_free(ptr >>> 0, 1));
/**
 *
 * UtxoProcessor class is the main coordinator that manages UTXO processing
 * between multiple UtxoContext instances. It acts as a bridge between the
 * Tondi node RPC connection, address subscriptions and UtxoContext instances.
 *
 * @see {@link IUtxoProcessorArgs},
 * {@link UtxoContext},
 * {@link RpcClient},
 * {@link NetworkId},
 * {@link IConnectEvent}
 * {@link IDisconnectEvent}
 * @category Wallet SDK
 */
export class UtxoProcessor {

    toJSON() {
        return {
            rpc: this.rpc,
            networkId: this.networkId,
            isActive: this.isActive,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoProcessorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxoprocessor_free(ptr, 0);
    }
    /**
     * @param {UtxoProcessorEventType | UtxoProcessorEventType[] | string | string[]} event
     * @param {UtxoProcessorNotificationCallback | null} [callback]
     */
    removeEventListener(event, callback) {
        const ret = wasm.utxoprocessor_removeEventListener(this.__wbg_ptr, event, isLikeNone(callback) ? 0 : addToExternrefTable0(callback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Stops the UtxoProcessor and ends processing UTXO and other notifications.
     * @returns {Promise<void>}
     */
    stop() {
        const ret = wasm.utxoprocessor_stop(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string | UtxoProcessorNotificationCallback} event
     * @param {UtxoProcessorNotificationCallback | null} [callback]
     */
    addEventListener(event, callback) {
        const ret = wasm.utxoprocessor_addEventListener(this.__wbg_ptr, event, isLikeNone(callback) ? 0 : addToExternrefTable0(callback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {RpcClient}
     */
    get rpc() {
        const ret = wasm.utxoprocessor_rpc(this.__wbg_ptr);
        return RpcClient.__wrap(ret);
    }
    /**
     *
     * Set the user transaction maturity period DAA score for a given network.
     * This controls the DAA period after which the user transactions are considered mature
     * and the wallet subsystem emits the transaction maturity event.
     *
     * @see {@link TransactionRecord}
     * @see {@link IUtxoProcessorEvent}
     *
     * @category Wallet SDK
     * @param {NetworkId | string} network_id
     * @param {bigint} value
     */
    static setUserTransactionMaturityDAA(network_id, value) {
        const ret = wasm.utxoprocessor_setUserTransactionMaturityDAA(network_id, value);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     *
     * Set the coinbase transaction maturity period DAA score for a given network.
     * This controls the DAA period after which the user transactions are considered mature
     * and the wallet subsystem emits the transaction maturity event.
     *
     * @see {@link TransactionRecord}
     * @see {@link IUtxoProcessorEvent}
     *
     * @category Wallet SDK
     * @param {NetworkId | string} network_id
     * @param {bigint} value
     */
    static setCoinbaseTransactionMaturityDAA(network_id, value) {
        const ret = wasm.utxoprocessor_setCoinbaseTransactionMaturityDAA(network_id, value);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {NetworkId | string} network_id
     */
    setNetworkId(network_id) {
        const ret = wasm.utxoprocessor_setNetworkId(this.__wbg_ptr, network_id);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * UtxoProcessor constructor.
     *
     *
     *
     * @see {@link IUtxoProcessorArgs}
     * @param {IUtxoProcessorArgs} js_value
     */
    constructor(js_value) {
        const ret = wasm.utxoprocessor_ctor(js_value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UtxoProcessorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string | undefined}
     */
    get networkId() {
        const ret = wasm.utxoprocessor_networkId(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Starts the UtxoProcessor and begins processing UTXO and other notifications.
     * @returns {Promise<void>}
     */
    start() {
        const ret = wasm.utxoprocessor_start(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get isActive() {
        const ret = wasm.utxoprocessor_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
}

const WalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wallet_free(ptr >>> 0, 1));
/**
 *
 * Wallet class is the main coordinator that manages integrated wallet operations.
 *
 * The Wallet class encapsulates {@link UtxoProcessor} and provides internal
 * account management using {@link UtxoContext} instances. It acts as a bridge
 * between the integrated Wallet subsystem providing a high-level interface
 * for wallet key and account management.
 *
 * The Rusty Tondi is developed in Rust, and the Wallet class is a Rust implementation
 * exposed to the JavaScript/TypeScript environment using the WebAssembly (WASM32) interface.
 * As such, the Wallet implementation can be powered up using native Rust or built
 * as a WebAssembly module and used in the browser or Node.js environment.
 *
 * When using Rust native or NodeJS environment, all wallet data is stored on the local
 * filesystem.  When using WASM32 build in the web browser, the wallet data is stored
 * in the browser's `localStorage` and transaction records are stored in the `IndexedDB`.
 *
 * The Wallet API can create multiple wallet instances, however, only one wallet instance
 * can be active at a time.
 *
 * The wallet implementation is designed to be efficient and support a large number
 * of accounts. Accounts reside in storage and can be loaded and activated as needed.
 * A `loaded` account contains all account information loaded from the permanent storage
 * whereas an `active` account monitors the UTXO set and provides notifications for
 * incoming and outgoing transactions as well as balance updates.
 *
 * The Wallet API communicates with the client using resource identifiers. These include
 * account IDs, private key IDs, transaction IDs, etc. It is the responsibility of the
 * client to track these resource identifiers at runtime.
 *
 * @see {@link IWalletConfig},
 *
 * @category Wallet API
 */
export class Wallet {

    toJSON() {
        return {
            descriptor: this.descriptor,
            rpc: this.rpc,
            isSynced: this.isSynced,
            isOpen: this.isOpen,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wallet_free(ptr, 0);
    }
    /**
     * @see {@link IPrvKeyDataCreateRequest} {@link IPrvKeyDataCreateResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataCreateRequest} request
     * @returns {Promise<IPrvKeyDataCreateResponse>}
     */
    prvKeyDataCreate(request) {
        const ret = wasm.wallet_prvKeyDataCreate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsSendRequest} {@link IAccountsSendResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsSendRequest} request
     * @returns {Promise<IAccountsSendResponse>}
     */
    accountsSend(request) {
        const ret = wasm.wallet_accountsSend(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletCloseRequest} {@link IWalletCloseResponse}
     * @throws `string` in case of an error.
     * @param {IWalletCloseRequest} request
     * @returns {Promise<IWalletCloseResponse>}
     */
    walletClose(request) {
        const ret = wasm.wallet_walletClose(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletCreateRequest} {@link IWalletCreateResponse}
     * @throws `string` in case of an error.
     * @param {IWalletCreateRequest} request
     * @returns {Promise<IWalletCreateResponse>}
     */
    walletCreate(request) {
        const ret = wasm.wallet_walletCreate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * Ping backend
     * @see {@link IBatchRequest} {@link IBatchResponse}
     * @throws `string` in case of an error.
     * @param {IBatchRequest} request
     * @returns {Promise<IBatchResponse>}
     */
    batch(request) {
        const ret = wasm.wallet_batch(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IFlushRequest} {@link IFlushResponse}
     * @throws `string` in case of an error.
     * @param {IFlushRequest} request
     * @returns {Promise<IFlushResponse>}
     */
    flush(request) {
        const ret = wasm.wallet_flush(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IPrvKeyDataEnumerateRequest} {@link IPrvKeyDataEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataEnumerateRequest} request
     * @returns {Promise<IPrvKeyDataEnumerateResponse>}
     */
    prvKeyDataEnumerate(request) {
        const ret = wasm.wallet_prvKeyDataEnumerate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsCreateNewAddressRequest} {@link IAccountsCreateNewAddressResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsCreateNewAddressRequest} request
     * @returns {Promise<IAccountsCreateNewAddressResponse>}
     */
    accountsCreateNewAddress(request) {
        const ret = wasm.wallet_accountsCreateNewAddress(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletReloadRequest} {@link IWalletReloadResponse}
     * @throws `string` in case of an error.
     * @param {IWalletReloadRequest} request
     * @returns {Promise<IWalletReloadResponse>}
     */
    walletReload(request) {
        const ret = wasm.wallet_walletReload(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsEnsureDefaultRequest} {@link IAccountsEnsureDefaultResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsEnsureDefaultRequest} request
     * @returns {Promise<IAccountsEnsureDefaultResponse>}
     */
    accountsEnsureDefault(request) {
        const ret = wasm.wallet_accountsEnsureDefault(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsDeactivateRequest} {@link IAccountsDeactivateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsDeactivateRequest} request
     * @returns {Promise<IAccountsDeactivateResponse>}
     */
    accountsDeactivate(request) {
        const ret = wasm.wallet_accountsDeactivate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IGetStatusRequest} {@link IGetStatusResponse}
     * @throws `string` in case of an error.
     * @param {IGetStatusRequest} request
     * @returns {Promise<IGetStatusResponse>}
     */
    getStatus(request) {
        const ret = wasm.wallet_getStatus(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsRenameRequest} {@link IAccountsRenameResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsRenameRequest} request
     * @returns {Promise<IAccountsRenameResponse>}
     */
    accountsRename(request) {
        const ret = wasm.wallet_accountsRename(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsDiscoveryRequest} {@link IAccountsDiscoveryResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsDiscoveryRequest} request
     * @returns {Promise<IAccountsDiscoveryResponse>}
     */
    accountsDiscovery(request) {
        const ret = wasm.wallet_accountsDiscovery(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IPrvKeyDataGetRequest} {@link IPrvKeyDataGetResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataGetRequest} request
     * @returns {Promise<IPrvKeyDataGetResponse>}
     */
    prvKeyDataGet(request) {
        const ret = wasm.wallet_prvKeyDataGet(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletOpenRequest} {@link IWalletOpenResponse}
     * @throws `string` in case of an error.
     * @param {IWalletOpenRequest} request
     * @returns {Promise<IWalletOpenResponse>}
     */
    walletOpen(request) {
        const ret = wasm.wallet_walletOpen(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsGetRequest} {@link IAccountsGetResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsGetRequest} request
     * @returns {Promise<IAccountsGetResponse>}
     */
    accountsGet(request) {
        const ret = wasm.wallet_accountsGet(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IPrvKeyDataRemoveRequest} {@link IPrvKeyDataRemoveResponse}
     * @throws `string` in case of an error.
     * @param {IPrvKeyDataRemoveRequest} request
     * @returns {Promise<IPrvKeyDataRemoveResponse>}
     */
    prvKeyDataRemove(request) {
        const ret = wasm.wallet_prvKeyDataRemove(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsImportRequest} {@link IAccountsImportResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsImportRequest} request
     * @returns {Promise<IAccountsImportResponse>}
     */
    accountsImport(request) {
        const ret = wasm.wallet_accountsImport(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletChangeSecretRequest} {@link IWalletChangeSecretResponse}
     * @throws `string` in case of an error.
     * @param {IWalletChangeSecretRequest} request
     * @returns {Promise<IWalletChangeSecretResponse>}
     */
    walletChangeSecret(request) {
        const ret = wasm.wallet_walletChangeSecret(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IRetainContextRequest} {@link IRetainContextResponse}
     * @throws `string` in case of an error.
     * @param {IRetainContextRequest} request
     * @returns {Promise<IRetainContextResponse>}
     */
    retainContext(request) {
        const ret = wasm.wallet_retainContext(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsEnumerateRequest} {@link IAccountsEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsEnumerateRequest} request
     * @returns {Promise<IAccountsEnumerateResponse>}
     */
    accountsEnumerate(request) {
        const ret = wasm.wallet_accountsEnumerate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsCreateRequest} {@link IAccountsCreateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsCreateRequest} request
     * @returns {Promise<IAccountsCreateResponse>}
     */
    accountsCreate(request) {
        const ret = wasm.wallet_accountsCreate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsTransferRequest} {@link IAccountsTransferResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsTransferRequest} request
     * @returns {Promise<IAccountsTransferResponse>}
     */
    accountsTransfer(request) {
        const ret = wasm.wallet_accountsTransfer(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link ITransactionsDataGetRequest} {@link ITransactionsDataGetResponse}
     * @throws `string` in case of an error.
     * @param {ITransactionsDataGetRequest} request
     * @returns {Promise<ITransactionsDataGetResponse>}
     */
    transactionsDataGet(request) {
        const ret = wasm.wallet_transactionsDataGet(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletExportRequest} {@link IWalletExportResponse}
     * @throws `string` in case of an error.
     * @param {IWalletExportRequest} request
     * @returns {Promise<IWalletExportResponse>}
     */
    walletExport(request) {
        const ret = wasm.wallet_walletExport(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAddressBookEnumerateRequest} {@link IAddressBookEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IAddressBookEnumerateRequest} request
     * @returns {Promise<IAddressBookEnumerateResponse>}
     */
    addressBookEnumerate(request) {
        const ret = wasm.wallet_addressBookEnumerate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletImportRequest} {@link IWalletImportResponse}
     * @throws `string` in case of an error.
     * @param {IWalletImportRequest} request
     * @returns {Promise<IWalletImportResponse>}
     */
    walletImport(request) {
        const ret = wasm.wallet_walletImport(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link ITransactionsReplaceMetadataRequest} {@link ITransactionsReplaceMetadataResponse}
     * @throws `string` in case of an error.
     * @param {ITransactionsReplaceMetadataRequest} request
     * @returns {Promise<ITransactionsReplaceMetadataResponse>}
     */
    transactionsReplaceMetadata(request) {
        const ret = wasm.wallet_transactionsReplaceMetadata(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsActivateRequest} {@link IAccountsActivateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsActivateRequest} request
     * @returns {Promise<IAccountsActivateResponse>}
     */
    accountsActivate(request) {
        const ret = wasm.wallet_accountsActivate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IWalletEnumerateRequest} {@link IWalletEnumerateResponse}
     * @throws `string` in case of an error.
     * @param {IWalletEnumerateRequest} request
     * @returns {Promise<IWalletEnumerateResponse>}
     */
    walletEnumerate(request) {
        const ret = wasm.wallet_walletEnumerate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link IAccountsEstimateRequest} {@link IAccountsEstimateResponse}
     * @throws `string` in case of an error.
     * @param {IAccountsEstimateRequest} request
     * @returns {Promise<IAccountsEstimateResponse>}
     */
    accountsEstimate(request) {
        const ret = wasm.wallet_accountsEstimate(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @see {@link ITransactionsReplaceNoteRequest} {@link ITransactionsReplaceNoteResponse}
     * @throws `string` in case of an error.
     * @param {ITransactionsReplaceNoteRequest} request
     * @returns {Promise<ITransactionsReplaceNoteResponse>}
     */
    transactionsReplaceNote(request) {
        const ret = wasm.wallet_transactionsReplaceNote(this.__wbg_ptr, request);
        return ret;
    }
    /**
     * @returns {WalletDescriptor | undefined}
     */
    get descriptor() {
        const ret = wasm.wallet_descriptor(this.__wbg_ptr);
        return ret === 0 ? undefined : WalletDescriptor.__wrap(ret);
    }
    /**
     * Check if a wallet with a given name exists.
     * @param {string | null} [name]
     * @returns {Promise<boolean>}
     */
    exists(name) {
        var ptr0 = isLikeNone(name) ? 0 : passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wallet_exists(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * @returns {RpcClient}
     */
    get rpc() {
        const ret = wasm.wallet_rpc(this.__wbg_ptr);
        return RpcClient.__wrap(ret);
    }
    /**
     * @param {string | WalletNotificationCallback} event
     * @param {WalletNotificationCallback | null} [callback]
     */
    addEventListener(event, callback) {
        const ret = wasm.wallet_addEventListener(this.__wbg_ptr, event, isLikeNone(callback) ? 0 : addToExternrefTable0(callback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @remarks This is a local property indicating
     * if the node is currently synced.
     * @returns {boolean}
     */
    get isSynced() {
        const ret = wasm.wallet_isSynced(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Promise<void>}
     */
    disconnect() {
        const ret = wasm.wallet_disconnect(this.__wbg_ptr);
        return ret;
    }
    /**
     * @remarks This is a local property indicating
     * if the wallet is currently open.
     * @returns {boolean}
     */
    get isOpen() {
        const ret = wasm.wallet_isOpen(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {IConnectOptions | undefined | null} [args]
     * @returns {Promise<void>}
     */
    connect(args) {
        const ret = wasm.wallet_connect(this.__wbg_ptr, isLikeNone(args) ? 0 : addToExternrefTable0(args));
        return ret;
    }
    /**
     * @param {WalletEventType | WalletEventType[] | string | string[]} event
     * @param {WalletNotificationCallback | null} [callback]
     */
    removeEventListener(event, callback) {
        const ret = wasm.wallet_removeEventListener(this.__wbg_ptr, event, isLikeNone(callback) ? 0 : addToExternrefTable0(callback));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {Promise<void>}
     */
    start() {
        const ret = wasm.wallet_start(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<void>}
     */
    stop() {
        const ret = wasm.wallet_stop(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {IWalletConfig} config
     */
    constructor(config) {
        const ret = wasm.wallet_constructor(config);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WalletFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const WalletDescriptorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_walletdescriptor_free(ptr >>> 0, 1));
/**
 * @category Wallet API
 */
export class WalletDescriptor {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WalletDescriptor.prototype);
        obj.__wbg_ptr = ptr;
        WalletDescriptorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            title: this.title,
            filename: this.filename,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletDescriptorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_walletdescriptor_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get title() {
        const ret = wasm.__wbg_get_walletdescriptor_title(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set title(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_walletdescriptor_title(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get filename() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_walletdescriptor_filename(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set filename(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_walletdescriptor_filename(this.__wbg_ptr, ptr0, len0);
    }
}

const WasiOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasioptions_free(ptr >>> 0, 1));

export class WasiOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasiOptions.prototype);
        obj.__wbg_ptr = ptr;
        WasiOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasiOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasioptions_free(ptr, 0);
    }
    /**
     * @param {object | null} [value]
     */
    set env(value) {
        wasm.wasioptions_set_env(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {object} value
     */
    set preopens(value) {
        wasm.wasioptions_set_preopens(this.__wbg_ptr, value);
    }
    /**
     * @param {any[] | null} [value]
     */
    set args(value) {
        var ptr0 = isLikeNone(value) ? 0 : passArrayJsValueToWasm0(value, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.wasioptions_set_args(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {object | undefined}
     */
    get env() {
        const ret = wasm.wasioptions_env(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any[] | undefined}
     */
    get args() {
        const ret = wasm.wasioptions_args(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @returns {object}
     */
    get preopens() {
        const ret = wasm.wasioptions_preopens(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any[] | null | undefined} args
     * @param {object | null | undefined} env
     * @param {object} preopens
     */
    constructor(args, env, preopens) {
        var ptr0 = isLikeNone(args) ? 0 : passArrayJsValueToWasm0(args, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasioptions_new_with_values(ptr0, len0, isLikeNone(env) ? 0 : addToExternrefTable0(env), preopens);
        this.__wbg_ptr = ret >>> 0;
        WasiOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {object} preopens
     * @returns {WasiOptions}
     */
    static new(preopens) {
        const ret = wasm.wasioptions_new(preopens);
        return WasiOptions.__wrap(ret);
    }
}

const WriteFileSyncOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_writefilesyncoptions_free(ptr >>> 0, 1));

export class WriteFileSyncOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WriteFileSyncOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_writefilesyncoptions_free(ptr, 0);
    }
    /**
     * @param {string | null} [value]
     */
    set flag(value) {
        wasm.writefilesyncoptions_set_flag(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @param {string | null} [value]
     */
    set encoding(value) {
        wasm.writefilesyncoptions_set_encoding(this.__wbg_ptr, isLikeNone(value) ? 0 : addToExternrefTable0(value));
    }
    /**
     * @returns {number | undefined}
     */
    get mode() {
        const ret = wasm.writefilesyncoptions_mode(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {string | null} [encoding]
     * @param {string | null} [flag]
     * @param {number | null} [mode]
     */
    constructor(encoding, flag, mode) {
        const ret = wasm.writefilesyncoptions_new(isLikeNone(encoding) ? 0 : addToExternrefTable0(encoding), isLikeNone(flag) ? 0 : addToExternrefTable0(flag), isLikeNone(mode) ? 0x100000001 : (mode) >>> 0);
        this.__wbg_ptr = ret >>> 0;
        WriteFileSyncOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number | null} [value]
     */
    set mode(value) {
        wasm.writefilesyncoptions_set_mode(this.__wbg_ptr, isLikeNone(value) ? 0x100000001 : (value) >>> 0);
    }
    /**
     * @returns {string | undefined}
     */
    get encoding() {
        const ret = wasm.writefilesyncoptions_encoding(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get flag() {
        const ret = wasm.writefilesyncoptions_flag(this.__wbg_ptr);
        return ret;
    }
}

const WriteStreamFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_writestream_free(ptr >>> 0, 1));

export class WriteStream {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WriteStreamFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_writestream_free(ptr, 0);
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_close(listener) {
        const ret = wasm.writestream_prepend_once_listener_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_open(listener) {
        const ret = wasm.writestream_add_listener_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_open(listener) {
        const ret = wasm.writestream_on_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    add_listener_with_close(listener) {
        const ret = wasm.writestream_add_listener_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_close(listener) {
        const ret = wasm.writestream_prepend_listener_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    on_with_close(listener) {
        const ret = wasm.writestream_on_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_listener_with_open(listener) {
        const ret = wasm.writestream_prepend_listener_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_open(listener) {
        const ret = wasm.writestream_once_with_open(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    once_with_close(listener) {
        const ret = wasm.writestream_once_with_close(this.__wbg_ptr, listener);
        return ret;
    }
    /**
     * @param {Function} listener
     * @returns {any}
     */
    prepend_once_listener_with_open(listener) {
        const ret = wasm.writestream_prepend_once_listener_with_open(this.__wbg_ptr, listener);
        return ret;
    }
}

const XOnlyPublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_xonlypublickey_free(ptr >>> 0, 1));
/**
 *
 * Data structure that envelopes a XOnlyPublicKey.
 *
 * XOnlyPublicKey is used as a payload part of the {@link Address}.
 *
 * @see {@link PublicKey}
 * @category Wallet SDK
 */
export class XOnlyPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(XOnlyPublicKey.prototype);
        obj.__wbg_ptr = ptr;
        XOnlyPublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        XOnlyPublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_xonlypublickey_free(ptr, 0);
    }
    /**
     * @param {string} key
     */
    constructor(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.xonlypublickey_try_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        XOnlyPublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get the [`Address`] of this XOnlyPublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = xOnlyPublicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddress(network) {
        const ret = wasm.xonlypublickey_toAddress(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * Get `ECDSA` [`Address`] of this XOnlyPublicKey.
     * Receives a [`NetworkType`] to determine the prefix of the address.
     * JavaScript: `let address = xOnlyPublicKey.toAddress(NetworkType.MAINNET);`.
     * @param {NetworkType | NetworkId | string} network
     * @returns {Address}
     */
    toAddressECDSA(network) {
        const ret = wasm.xonlypublickey_toAddressECDSA(this.__wbg_ptr, network);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Address.__wrap(ret[0]);
    }
    /**
     * @param {Address} address
     * @returns {XOnlyPublicKey}
     */
    static fromAddress(address) {
        _assertClass(address, Address);
        const ret = wasm.xonlypublickey_fromAddress(address.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XOnlyPublicKey.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.xonlypublickey_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const XPrvFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_xprv_free(ptr >>> 0, 1));
/**
 *
 * Extended private key (XPrv).
 *
 * This class allows accepts a master seed and provides
 * functions for derivation of dependent child private keys.
 *
 * Please note that Tondi extended private keys use `kprv` prefix.
 *
 * @see {@link PrivateKeyGenerator}, {@link PublicKeyGenerator}, {@link XPub}, {@link Mnemonic}
 * @category Wallet SDK
 */
export class XPrv {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(XPrv.prototype);
        obj.__wbg_ptr = ptr;
        XPrvFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            chainCode: this.chainCode,
            parentFingerprint: this.parentFingerprint,
            xprv: this.xprv,
            privateKey: this.privateKey,
            depth: this.depth,
            childNumber: this.childNumber,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        XPrvFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_xprv_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get chainCode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.xprv_chainCode(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {PrivateKey}
     */
    toPrivateKey() {
        const ret = wasm.xprv_toPrivateKey(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PrivateKey.__wrap(ret[0]);
    }
    /**
     * Create {@link XPrv} from `xprvxxxx..` string
     * @param {string} xprv
     * @returns {XPrv}
     */
    static fromXPrv(xprv) {
        const ptr0 = passStringToWasm0(xprv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.xprv_fromXPrv(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XPrv.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get parentFingerprint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.xprv_parentFingerprint(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.xprv_toString(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {HexString} seed
     */
    constructor(seed) {
        const ret = wasm.xprv_try_new(seed);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        XPrvFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} child_number
     * @param {boolean | null} [hardened]
     * @returns {XPrv}
     */
    deriveChild(child_number, hardened) {
        const ret = wasm.xprv_deriveChild(this.__wbg_ptr, child_number, isLikeNone(hardened) ? 0xFFFFFF : hardened ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XPrv.__wrap(ret[0]);
    }
    /**
     * @param {any} path
     * @returns {XPrv}
     */
    derivePath(path) {
        const ret = wasm.xprv_derivePath(this.__wbg_ptr, path);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XPrv.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get xprv() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.xprv_xprv(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get privateKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.xprv_privateKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get depth() {
        const ret = wasm.xprv_depth(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    intoString(prefix) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.xprv_intoString(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get childNumber() {
        const ret = wasm.xprv_childNumber(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {XPub}
     */
    toXPub() {
        const ret = wasm.xprv_toXPub(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XPub.__wrap(ret[0]);
    }
}

const XPubFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_xpub_free(ptr >>> 0, 1));
/**
 *
 * Extended public key (XPub).
 *
 * This class allows accepts another XPub and and provides
 * functions for derivation of dependent child public keys.
 *
 * Please note that Tondi extended public keys use `kpub` prefix.
 *
 * @see {@link PrivateKeyGenerator}, {@link PublicKeyGenerator}, {@link XPrv}, {@link Mnemonic}
 * @category Wallet SDK
 */
export class XPub {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(XPub.prototype);
        obj.__wbg_ptr = ptr;
        XPubFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            chainCode: this.chainCode,
            parentFingerprint: this.parentFingerprint,
            childNumber: this.childNumber,
            depth: this.depth,
            xpub: this.xpub,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        XPubFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_xpub_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get chainCode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.xpub_chainCode(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get parentFingerprint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.xpub_parentFingerprint(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get childNumber() {
        const ret = wasm.xpub_childNumber(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {any} path
     * @returns {XPub}
     */
    derivePath(path) {
        const ret = wasm.xpub_derivePath(this.__wbg_ptr, path);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XPub.__wrap(ret[0]);
    }
    /**
     * @returns {number}
     */
    get depth() {
        const ret = wasm.xpub_depth(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} xpub
     */
    constructor(xpub) {
        const ptr0 = passStringToWasm0(xpub, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.xpub_try_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        XPubFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get xpub() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.xpub_xpub(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {number} child_number
     * @param {boolean | null} [hardened]
     * @returns {XPub}
     */
    deriveChild(child_number, hardened) {
        const ret = wasm.xpub_deriveChild(this.__wbg_ptr, child_number, isLikeNone(hardened) ? 0xFFFFFF : hardened ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return XPub.__wrap(ret[0]);
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    intoString(prefix) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.xpub_intoString(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * @returns {PublicKey}
     */
    toPublicKey() {
        const ret = wasm.xpub_toPublicKey(this.__wbg_ptr);
        return PublicKey.__wrap(ret);
    }
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_BigInt_6e3a01c3311ee796 = function(arg0) {
        const ret = BigInt(arg0);
        return ret;
    };
    imports.wbg.__wbg_BigInt_dda186faea58f4e9 = function() { return handleError(function (arg0) {
        const ret = BigInt(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_Error_0497d5bdba9362e5 = function(arg0, arg1) {
        const ret = Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_Window_b0044ac7db258535 = function(arg0) {
        const ret = arg0.Window;
        return ret;
    };
    imports.wbg.__wbg_WorkerGlobalScope_b74cefefc62a37da = function(arg0) {
        const ret = arg0.WorkerGlobalScope;
        return ret;
    };
    imports.wbg.__wbg_abort_18ba44d46e13d7fe = function(arg0) {
        arg0.abort();
    };
    imports.wbg.__wbg_abort_4198a1129c47f21a = function(arg0, arg1) {
        arg0.abort(arg1);
    };
    imports.wbg.__wbg_aborted_new = function(arg0) {
        const ret = Aborted.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_accountkind_new = function(arg0) {
        const ret = AccountKind.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_activeElement_417ce7a406f87caf = function(arg0) {
        const ret = arg0.activeElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_activeTexture_461aa9172920eaee = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_activeTexture_a2dcce661663a008 = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_addEventListener_0cd67c809e257fbf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_addListener_d78339dd4535b756 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.addListener(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_address_new = function(arg0) {
        const ret = Address.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_advance_d12120c423e27f56 = function() { return handleError(function (arg0, arg1) {
        arg0.advance(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_altKey_8061c4dfb9cbf7b5 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_a8de3b788e0e0cc5 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_appendChild_0455c3748a28445a = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_append_0342728346e47425 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_8927f491dd9b4a0c = function(arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    };
    imports.wbg.__wbg_at_5b2884630cb66ea6 = function(arg0, arg1) {
        const ret = arg0.at(arg1);
        return ret;
    };
    imports.wbg.__wbg_attachShader_309a97c9a904935e = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_attachShader_df14ffb9f1f7d90b = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBuffer_2ef9352da32b94be = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindBuffer_e90992d67074e0b3 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_2d560409a420265f = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_b54f3c852219ca18 = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindVertexArrayOES_668d4a6eaf26de80 = function(arg0, arg1) {
        arg0.bindVertexArrayOES(arg1);
    };
    imports.wbg.__wbg_bindVertexArray_944be32026b9fa2d = function(arg0, arg1) {
        arg0.bindVertexArray(arg1);
    };
    imports.wbg.__wbg_blendEquationSeparate_236b6c93d4c623d8 = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendEquationSeparate_50ae65c2b1845d62 = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_07505d85979c89b8 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_d12fc17b22cda403 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_blockSize_0de30d9eaea17aeb = function(arg0) {
        const ret = arg0.blockSize;
        return ret;
    };
    imports.wbg.__wbg_blur_e87a20c47bdb3cb5 = function() { return handleError(function (arg0) {
        arg0.blur();
    }, arguments) };
    imports.wbg.__wbg_body_9ce0d68f6f8c4231 = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_bottom_193801cb1caad767 = function(arg0) {
        const ret = arg0.bottom;
        return ret;
    };
    imports.wbg.__wbg_bufferData_bfeabb874be030cf = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_bfefe9d46509d5c0 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_buffer_a1a27a0dfa70165d = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_buffer_e495ba54cee589cc = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_button_c4f0997a075dca6d = function(arg0) {
        const ret = arg0.button;
        return ret;
    };
    imports.wbg.__wbg_call_f2db6205e5c51dc8 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_fbe8be8bf6436ce5 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancelAnimationFrame_032049cb190240a7 = function(arg0) {
        cancelAnimationFrame(arg0);
    };
    imports.wbg.__wbg_cancelAnimationFrame_2939f00622bc7c28 = function() { return handleError(function (arg0, arg1) {
        arg0.cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_changedTouches_742673e1be692efa = function(arg0) {
        const ret = arg0.changedTouches;
        return ret;
    };
    imports.wbg.__wbg_clearColor_539539969809b4a6 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearColor_de39c58f09f65a42 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearInterval_811b33a5c9461bbd = function(arg0, arg1) {
        arg0.clearInterval(arg1);
    };
    imports.wbg.__wbg_clearInterval_d472232e2fb5e5e4 = function() { return handleError(function (arg0) {
        clearInterval(arg0);
    }, arguments) };
    imports.wbg.__wbg_clearTimeout_6222fede17abcb1a = function(arg0) {
        const ret = clearTimeout(arg0);
        return ret;
    };
    imports.wbg.__wbg_clearTimeout_c5ac0f4b6a07b59e = function() { return handleError(function (arg0) {
        clearTimeout(arg0);
    }, arguments) };
    imports.wbg.__wbg_clear_38a746eb2a69d0f5 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clear_9ac4131928735438 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_click_4eefe81d921b6036 = function(arg0) {
        arg0.click();
    };
    imports.wbg.__wbg_clientX_5850592b6c242d18 = function(arg0) {
        const ret = arg0.clientX;
        return ret;
    };
    imports.wbg.__wbg_clientX_9d7d9c450d86ad08 = function(arg0) {
        const ret = arg0.clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_30a2ad20bca73acb = function(arg0) {
        const ret = arg0.clientY;
        return ret;
    };
    imports.wbg.__wbg_clientY_f5e6ac4f72a8286f = function(arg0) {
        const ret = arg0.clientY;
        return ret;
    };
    imports.wbg.__wbg_clipboardData_bc7e9c95ce76b9c1 = function(arg0) {
        const ret = arg0.clipboardData;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_clipboard_973d6bb7b380f46e = function(arg0) {
        const ret = arg0.clipboard;
        return ret;
    };
    imports.wbg.__wbg_close_0880036443561527 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_colorMask_7e3d5c0935273a6c = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_colorMask_85158cdc69174618 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_1496d66ee3355be2 = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_compileShader_73215aa69ff9a8d0 = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_contentBoxSize_69e77de0df2ed848 = function(arg0) {
        const ret = arg0.contentBoxSize;
        return ret;
    };
    imports.wbg.__wbg_contentRect_98871a7d339de11d = function(arg0) {
        const ret = arg0.contentRect;
        return ret;
    };
    imports.wbg.__wbg_continue_7d9cdafc888cb902 = function() { return handleError(function (arg0) {
        arg0.continue();
    }, arguments) };
    imports.wbg.__wbg_count_2941fdbb8154c02d = function() { return handleError(function (arg0) {
        const ret = arg0.count();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBuffer_9b09d084a9fe84bb = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createBuffer_b3849c5304cf370e = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createElement_12aa94dc33c0480f = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createIndex_a343510ba567e58c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3, arg4);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createObjectStore_b1f08961900155dd = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createObjectURL_1acd82bf8749f5a9 = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_createProgram_2527a1f4a8d06e45 = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_f82de1a7b51bd64a = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_323ca39bc562e7b6 = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_b111d10916e5e3dd = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_172d18c1a078e4a6 = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_70222f11b38db545 = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArrayOES_d2efe41793abbeed = function(arg0) {
        const ret = arg0.createVertexArrayOES();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArray_b4f1549969670d3f = function(arg0) {
        const ret = arg0.createVertexArray();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_crypto_574e78ad8b13b65f = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_076cf4ddba3e2c92 = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_c3f759e6fb63fb2a = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_dataTransfer_af8ec97659b042e9 = function(arg0) {
        const ret = arg0.dataTransfer;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_data_9be1e95c004bb025 = function(arg0, arg1) {
        const ret = arg1.data;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_data_fffd43bf0ca75fff = function(arg0) {
        const ret = arg0.data;
        return ret;
    };
    imports.wbg.__wbg_debug_54de743626e56edc = function(arg0, arg1) {
        console.debug(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_deleteBuffer_09459b5997d7d673 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteBuffer_bef889e549e75c14 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_899b82e825506c76 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteProgram_f7ef224d75497da5 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteShader_287de0c2aa857cfe = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteShader_d0f3a6b3bb0981c8 = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_96569fd81201b9e5 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_deleteTexture_c32fd7db9cfd40e6 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_delete_71b7921c73aa9378 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.delete(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_delete_aca203d8b0528d61 = function(arg0, arg1) {
        const ret = arg0.delete(arg1);
        return ret;
    };
    imports.wbg.__wbg_deltaMode_f45b0b9e27b90093 = function(arg0) {
        const ret = arg0.deltaMode;
        return ret;
    };
    imports.wbg.__wbg_deltaX_47715e3350e678c7 = function(arg0) {
        const ret = arg0.deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_d604000d1ebb0302 = function(arg0) {
        const ret = arg0.deltaY;
        return ret;
    };
    imports.wbg.__wbg_detachShader_1965d9841a5d3d37 = function(arg0, arg1, arg2) {
        arg0.detachShader(arg1, arg2);
    };
    imports.wbg.__wbg_detachShader_3a5185eb158e3447 = function(arg0, arg1, arg2) {
        arg0.detachShader(arg1, arg2);
    };
    imports.wbg.__wbg_devicePixelContentBoxSize_46a83f780892e4fe = function(arg0) {
        const ret = arg0.devicePixelContentBoxSize;
        return ret;
    };
    imports.wbg.__wbg_devicePixelRatio_7554ba36d09d8a66 = function(arg0) {
        const ret = arg0.devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_disableVertexAttribArray_7d23d75e97f823d6 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_8abf2cbde7253afb = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_disable_b15351e74c7abba9 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disable_e28183d6e2a77985 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disconnect_c2a6d2d7afb60ce0 = function(arg0) {
        arg0.disconnect();
    };
    imports.wbg.__wbg_document_62abd3e2b80cbd9e = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_done_4d01f352bade43b7 = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_drawElements_bb4e33101721fc46 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_drawElements_ea9ffc1f56b013c2 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_elementFromPoint_cdb6182e9182969e = function(arg0, arg1, arg2) {
        const ret = arg0.elementFromPoint(arg1, arg2);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_enableVertexAttribArray_05d92d3f1fafa48c = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_66b1a020d0fa90b8 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_enable_afafe991e59b92c9 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enable_bb804bca175e6912 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_entries_41651c850143b957 = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_entries_c951fa14164704e7 = function(arg0) {
        const ret = arg0.entries();
        return ret;
    };
    imports.wbg.__wbg_error_4e978abc9692c0c5 = function() { return handleError(function (arg0) {
        const ret = arg0.error;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_error_5edc95999c70d386 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_error_b5d62a6100a65a3b = function(arg0, arg1) {
        console.error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_error_bbc7e5d1a0911165 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_existsSync_6b2031627aea3e5a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.existsSync(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_a8e43a4e138dfc93 = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_fetch_f156d10be9a5c88a = function(arg0) {
        const ret = fetch(arg0);
        return ret;
    };
    imports.wbg.__wbg_files_b4f473350f528a37 = function(arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_files_e0b5941568121d14 = function(arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_focus_7e6c35083244cb6b = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_force_94bcb8304356dec3 = function(arg0) {
        const ret = arg0.force;
        return ret;
    };
    imports.wbg.__wbg_fromCodePoint_429ae2379fd10205 = function() { return handleError(function (arg0) {
        const ret = String.fromCodePoint(arg0 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_from_12ff8e47307bd4c7 = function(arg0) {
        const ret = Array.from(arg0);
        return ret;
    };
    imports.wbg.__wbg_from_d608a04300bfd9ac = function(arg0) {
        const ret = Buffer.from(arg0);
        return ret;
    };
    imports.wbg.__wbg_generateMipmap_2c125122e082d704 = function(arg0, arg1) {
        arg0.generateMipmap(arg1 >>> 0);
    };
    imports.wbg.__wbg_generateMipmap_9c82c54966c89d51 = function(arg0, arg1) {
        arg0.generateMipmap(arg1 >>> 0);
    };
    imports.wbg.__wbg_generatorsummary_new = function(arg0) {
        const ret = GeneratorSummary.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_getAttribLocation_c6ad51cdc37c3de6 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getAttribLocation_e829ebd88232bf73 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getBoundingClientRect_d0042ccc5e93a1d4 = function(arg0) {
        const ret = arg0.getBoundingClientRect();
        return ret;
    };
    imports.wbg.__wbg_getComputedStyle_9fc8631272abb86e = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getComputedStyle(arg1);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_7413c456eda278ca = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getData_eb22cf2bdc839a57 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getElementById_6cd98fa4e2fb8b6b = function(arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getError_40ec4055b76bc793 = function(arg0) {
        const ret = arg0.getError();
        return ret;
    };
    imports.wbg.__wbg_getError_aa0de3b67aacbd3d = function(arg0) {
        const ret = arg0.getError();
        return ret;
    };
    imports.wbg.__wbg_getExtension_242a3b1709869137 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getExtension_a5457a8f4c4ef30a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getItem_cc20ea5759555a05 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getItem(getStringFromWasm0(arg2, arg3));
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getParameter_2a6f2b0210b863df = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getParameter_83c4cb1966c93776 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_dff4a292fedd4a58 = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getProgramInfoLog_ffc52289175137e2 = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getProgramParameter_1c98fdbedc7c90bf = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getProgramParameter_549b242e705d5925 = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getPropertyValue_75e0d4c9d9783e7b = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_3c9c0d586e575a16 = function() { return handleError(function (arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_getShaderInfoLog_122a419bb282c990 = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getShaderInfoLog_1b5af0db1625deae = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getShaderParameter_b757c5c8f4500fd9 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderParameter_e5d4f93592fde672 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getSupportedExtensions_92b2a4c9ac032c79 = function(arg0) {
        const ret = arg0.getSupportedExtensions();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getSupportedExtensions_96078ca792e2042a = function(arg0) {
        const ret = arg0.getSupportedExtensions();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getTimezoneOffset_31f33c0868da345e = function(arg0) {
        const ret = arg0.getTimezoneOffset();
        return ret;
    };
    imports.wbg.__wbg_getUniformLocation_340c5b8907ee7664 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getUniformLocation_7d8ccf77a8fcaff6 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_2b4cad5f7c751c74 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_3786c7f6da6a3bfa = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_6dd1850282dd8588 = function(arg0, arg1) {
        const ret = arg0.get(arg1);
        return ret;
    };
    imports.wbg.__wbg_get_92470be87867c2e5 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_a131a44bd1eb6979 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_get_a8e28596722a45ff = function() { return handleError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            const ret = chrome.storage.local.get(getStringFromWasm0(arg0, arg1));
            return ret;
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_get_d37904b955701f99 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.get(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_db3607aa76d51ccf = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_f1f75752f252b231 = function() { return handleError(function () {
        const ret = chrome.storage.local.get();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_global_b6f5c73312f62313 = function(arg0) {
        const ret = arg0.global;
        return ret;
    };
    imports.wbg.__wbg_has_809e438ee9d787a7 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_hash_0341a7d2098a8c6d = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_hash_new = function(arg0) {
        const ret = Hash.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_headers_0f0cbdc6290b6780 = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_height_4524424a4143495d = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_height_f19f08278715086c = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_hidden_e5a0f548e9553519 = function(arg0) {
        const ret = arg0.hidden;
        return ret;
    };
    imports.wbg.__wbg_host_532d35a4a2096511 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.host;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_hostname_6529305ebd2a3cba = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hostname;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_href_9bc8ec9ea5cd0919 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.href;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_id_38c1f02353fbf4fb = function(arg0, arg1) {
        const ret = arg1.id;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_identifier_e7a9ceaade82fca4 = function(arg0) {
        const ret = arg0.identifier;
        return ret;
    };
    imports.wbg.__wbg_index_405783ca8da5f008 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.index(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_indexedDB_317016dcb8a872d6 = function() { return handleError(function (arg0) {
        const ret = arg0.indexedDB;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_indexedDB_601ec26c63e333de = function() { return handleError(function (arg0) {
        const ret = arg0.indexedDB;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_indexedDB_63b82e158eb67cbd = function() { return handleError(function (arg0) {
        const ret = arg0.indexedDB;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_info_1fa0a04953ab28a7 = function(arg0, arg1) {
        console.info(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_inlineSize_c36306fc8d7bf3f5 = function(arg0) {
        const ret = arg0.inlineSize;
        return ret;
    };
    imports.wbg.__wbg_innerHTML_9ca21f60b78cba89 = function(arg0, arg1) {
        const ret = arg1.innerHTML;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_a8b6f580b363f2bc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Element_ce53836f441ef5d9 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlAnchorElement_e9e9b43a72ad6921 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLAnchorElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlButtonElement_652543a067e1ff63 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLButtonElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_988a3b62e21f5b54 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlElement_bc13b1b7827691e8 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_7f02b594aacd5039 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Map_80cc65041c96417a = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Map;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_9a05796038b7a8f6 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ResizeObserverEntry_8116de1f7d7e4f00 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ResizeObserverEntry;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ResizeObserverSize_78c0c04b72e55353 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ResizeObserverSize;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_e80ce8b7a2b968d2 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_ca460677bc155827 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WebGl2RenderingContext_5e34b2baf3516ba2 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGL2RenderingContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WebGlRenderingContext_ba6146443ab7b429 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGLRenderingContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_68f3f67bad1729c1 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_2a07fd175d45c496 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isArray_5f090bed72bd4f89 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isComposing_9eb6c0ed4ae8108e = function(arg0) {
        const ret = arg0.isComposing;
        return ret;
    };
    imports.wbg.__wbg_isComposing_c213024ae25f34cd = function(arg0) {
        const ret = arg0.isComposing;
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_90d7c4674047d684 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSecureContext_ad40f57a615a7671 = function(arg0) {
        const ret = arg0.isSecureContext;
        return ret;
    };
    imports.wbg.__wbg_is_49ee71a294f7d2fe = function(arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_item_866c3db59bfb441e = function(arg0, arg1) {
        const ret = arg0.item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_items_fd929697adef9fa4 = function(arg0) {
        const ret = arg0.items;
        return ret;
    };
    imports.wbg.__wbg_iterator_4068add5b2aef7a6 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_keyCode_d50283fd9d84a81e = function(arg0) {
        const ret = arg0.keyCode;
        return ret;
    };
    imports.wbg.__wbg_key_382127b3552a4a55 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg1.key(arg2 >>> 0);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_key_5513922ab1e29370 = function(arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_keys_42062809bf87339e = function(arg0) {
        const ret = Object.keys(arg0);
        return ret;
    };
    imports.wbg.__wbg_lastModified_5c47209de0efc59f = function(arg0) {
        const ret = arg0.lastModified;
        return ret;
    };
    imports.wbg.__wbg_left_8c32651b3b1fb51f = function(arg0) {
        const ret = arg0.left;
        return ret;
    };
    imports.wbg.__wbg_length_20ddaf9461ce812f = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_552fb010987b8bbf = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_557d12180cf88de4 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_6ffe0f203d4658e0 = function() { return handleError(function (arg0) {
        const ret = arg0.length;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_ab6d22b5ead75c72 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_f00ec12454a5d9fd = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_linkProgram_79294af73862b3ca = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_linkProgram_cec1c4d74eab2888 = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_localStorage_6b8d9cd04fe47f68 = function() { return handleError(function (arg0) {
        const ret = arg0.localStorage;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_location_53fd1bbab625ae8d = function(arg0) {
        const ret = arg0.location;
        return ret;
    };
    imports.wbg.__wbg_log_6c164928aa7b57f4 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_matchMedia_f6fead5956885195 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_matches_4a57259cd2af986f = function(arg0) {
        const ret = arg0.matches;
        return ret;
    };
    imports.wbg.__wbg_matches_dc8f84665982e2f8 = function(arg0) {
        const ret = arg0.matches;
        return ret;
    };
    imports.wbg.__wbg_metaKey_19999df0b359ea8f = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_87f241cb3857b2f9 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_mkdirSync_29d1fd92bf140bd0 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.mkdirSync(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_name_b8a1d281094eb9d6 = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_navigator_fc64ba1417939b25 = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_networkid_new = function(arg0) {
        const ret = NetworkId.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_new0_97314565408dea38 = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_new_01c9a0c36116963f = function(arg0) {
        const ret = new ArrayBuffer(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_new_07b483f72211fd66 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_0b790fd655ff1a97 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_104a6fcd57ac32c0 = function() { return handleError(function () {
        const ret = new FileReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_186abcfdff244e42 = function() { return handleError(function () {
        const ret = new AbortController();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_39fae4e38868373c = function() { return handleError(function (arg0, arg1) {
        const ret = new Worker(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_4796e1cd2eb9ea6d = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_5136e00935bbc0fc = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_58353953ad2097cc = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_84e9d2d86df15a1d = function() { return handleError(function (arg0) {
        const ret = new ResizeObserver(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_99f7f196cfe57008 = function(arg0, arg1) {
        const ret = new Intl.DateTimeFormat(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_a2957aa5684de228 = function(arg0) {
        const ret = new Date(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_a979b4b45bd55c7f = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_new_e30c39c06edaabf2 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_1650(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_e52b3efaaa774f96 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_f5f8a7325e1cb479 = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_newfromslice_7c05ab1297cb2d88 = function(arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newnoargs_ff528e72d35de39a = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_39a4625c9d5ea9a7 = function(arg0, arg1, arg2) {
        const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_3b01ecda099177e8 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_444a0e19e3d727e7 = function(arg0, arg1, arg2) {
        const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_5e331a0d7f9b887d = function(arg0, arg1, arg2) {
        const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_cbca920c0733c1bb = function(arg0, arg1, arg2) {
        const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ec96e4a6ab57b362 = function(arg0, arg1, arg2) {
        const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ed4fe47499e638c1 = function(arg0, arg1, arg2) {
        const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_08f872dc1e3ada2e = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithnodejsconfigimpl_b0a2d4e5b0763676 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1), arg2, arg3, arg4, arg5, arg6);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithrecordfromstrtoblobpromise_ce8a83cbdb300891 = function() { return handleError(function (arg0) {
        const ret = new ClipboardItem(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstrandinit_f8a9dbe009d6be37 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstrsequenceandoptions_3c68d739cf8f35ce = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithu8arraysequenceandoptions_3b5b6ab7317ffd8f = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_8bb824d217961b5d = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_e2da48d8fff7439a = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_node_905d3e251edff8a2 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_nodedescriptor_new = function(arg0) {
        const ret = NodeDescriptor.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_now_2c95c9de01293173 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_now_7ab37f05ab2d0b81 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_now_eb0821f3bd9f6529 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_objectStore_b463d32c86d6b543 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_observe_441f29c8b714f51c = function(arg0, arg1, arg2) {
        arg0.observe(arg1, arg2);
    };
    imports.wbg.__wbg_of_6894cf64ba33daf5 = function(arg0) {
        const ret = Array.of(arg0);
        return ret;
    };
    imports.wbg.__wbg_offsetTop_3aaeb017f8a240c0 = function(arg0) {
        const ret = arg0.offsetTop;
        return ret;
    };
    imports.wbg.__wbg_oldVersion_af5af638a028177c = function(arg0) {
        const ret = arg0.oldVersion;
        return ret;
    };
    imports.wbg.__wbg_on_9ef8de87725b93b5 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.on(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_once_8901720a31f56808 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.once(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_openCursor_88364ef62e4b0f37 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.openCursor(arg1, __wbindgen_enum_IdbCursorDirection[arg2]);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_open_0f04f50fa4d98f67 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_open_a63c7d86c52401c1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_origin_5c460f727a4fbf19 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.origin;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pendingtransaction_new = function(arg0) {
        const ret = PendingTransaction.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_performance_69756c79602db631 = function(arg0) {
        const ret = arg0.performance;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
        const ret = arg0.performance;
        return ret;
    };
    imports.wbg.__wbg_pixelStorei_6a718a1afe901bcc = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_pixelStorei_c1724e90dc43515b = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_port_39a6e8e9e05bbc53 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.port;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_postMessage_95ef4554c6b7ca0c = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbg_prependListener_dc1e8b094d0f731e = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.prependListener(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_prependOnceListener_93873dc17dd2fcad = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.prependOnceListener(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_preventDefault_a063596d0087ba6f = function(arg0) {
        arg0.preventDefault();
    };
    imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_protocol_20b712480a24856a = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.protocol;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_publickey_new = function(arg0) {
        const ret = PublicKey.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_push_73fd7b5550ebf707 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_put_7f0b4dcc666f09e3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.put(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_46c1df247678729f = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_8acf3ccb75ed8d11 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_readAsArrayBuffer_ec86f70be9ee80e9 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsArrayBuffer(arg1);
    }, arguments) };
    imports.wbg.__wbg_readFileSync_42b340d959241f2b = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.readFileSync(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_readPixels_76c6c1def3e0fb44 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readPixels_7dd854af16425c73 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readPixels_f2371e1f2956411e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readdir_319d9b13a44c9af9 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.readdir(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_readyState_249e5707a38b7a7a = function(arg0) {
        const ret = arg0.readyState;
        return (__wbindgen_enum_IdbRequestReadyState.indexOf(ret) + 1 || 3) - 1;
    };
    imports.wbg.__wbg_readyState_6c28968f3e6c1e47 = function(arg0) {
        const ret = arg0.readyState;
        return ret;
    };
    imports.wbg.__wbg_reload_049d841781a7e07c = function() { return handleError(function (arg0) {
        arg0.reload();
    }, arguments) };
    imports.wbg.__wbg_removeAttribute_28bd448b27dc82c7 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.removeAttribute(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_removeChild_ffecd358b6c41438 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.removeChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_98ce9b0181ba8d74 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_removeItem_1e3718a423f67796 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.removeItem(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_remove_cb9af65ab98197c5 = function() { return handleError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            const ret = chrome.storage.local.remove(getStringFromWasm0(arg0, arg1));
            return ret;
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_remove_f71492caee074d45 = function(arg0) {
        arg0.remove();
    };
    imports.wbg.__wbg_renameSync_86e78b84a05e4a0b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.renameSync(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_63a812187303a02c = function(arg0) {
        const ret = requestAnimationFrame(arg0);
        return ret;
    };
    imports.wbg.__wbg_requestAnimationFrame_72e2268c983f0d5f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_require_05f2f70e92254dbb = function(arg0, arg1) {
        const ret = require(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_require_11fc9008c54f5b90 = function(arg0, arg1) {
        const ret = require(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_require_60cc747a6bc5215a = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_0dac8c580ffd4678 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_resolvedOptions_7100b35f33d46ce4 = function(arg0) {
        const ret = arg0.resolvedOptions();
        return ret;
    };
    imports.wbg.__wbg_result_142fc4d88cbccb26 = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_result_a0f1bf2fe64a516c = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_right_3c2d1f321fc07497 = function(arg0) {
        const ret = arg0.right;
        return ret;
    };
    imports.wbg.__wbg_rpcclient_new = function(arg0) {
        const ret = RpcClient.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_scissor_437522e9bc51bf1d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_scissor_f8762489d9c183f0 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_search_7ab96fc60e23eaf5 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_send_17f8c8c8e084cc5e = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.send(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_send_9a57107cc0d7eafa = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.send(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_send_afb0c27f2d9698e3 = function() { return handleError(function (arg0, arg1) {
        arg0.send(arg1);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_a6637d7afe48112f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setInterval_160c4baec24e25f6 = function() { return handleError(function (arg0, arg1) {
        const ret = setInterval(arg0, arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setItem_2ac0fcb9e29e3f18 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setProperty_5ee26828600418f6 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setTime_cbf69d629298fd84 = function(arg0, arg1) {
        const ret = arg0.setTime(arg1);
        return ret;
    };
    imports.wbg.__wbg_setTimeout_2b339866a2aa3789 = function(arg0, arg1) {
        const ret = setTimeout(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_setTimeout_430dd4984e76f6c3 = function() { return handleError(function (arg0, arg1) {
        const ret = setTimeout(arg0, arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_005c36bbcfafb768 = function() { return handleError(function (arg0) {
        const ret = chrome.storage.local.set(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_set_7422acbe992d64ab = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_c43293f93a35998a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_d6bdfd275fb8a4ce = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_set_fe4e79d1ed3b0e9b = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_setaccept_099cf002b172c30f = function(arg0, arg1, arg2) {
        arg0.accept = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setautofocus_92b0f2463b18747e = function() { return handleError(function (arg0, arg1) {
        arg0.autofocus = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_setbinaryType_9981a6ba2bd58b94 = function(arg0, arg1) {
        arg0.binaryType = __wbindgen_enum_BinaryType[arg1];
    };
    imports.wbg.__wbg_setbody_971ec015fc13d6b4 = function(arg0, arg1) {
        arg0.body = arg1;
    };
    imports.wbg.__wbg_setbox_e0ddaf0fda86f779 = function(arg0, arg1) {
        arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
    };
    imports.wbg.__wbg_setcache_a94cd14dc0cc72a2 = function(arg0, arg1) {
        arg0.cache = __wbindgen_enum_RequestCache[arg1];
    };
    imports.wbg.__wbg_setclassName_13c484e4026db6a8 = function(arg0, arg1, arg2) {
        arg0.className = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setcredentials_920d91fb5984c94a = function(arg0, arg1) {
        arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
    };
    imports.wbg.__wbg_setdownload_f77a15085d451fd4 = function(arg0, arg1, arg2) {
        arg0.download = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setheaders_65a4eb4c0443ae61 = function(arg0, arg1) {
        arg0.headers = arg1;
    };
    imports.wbg.__wbg_setheight_da5223b4d4959337 = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_sethref_6f190d8eb681593c = function(arg0, arg1, arg2) {
        arg0.href = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setid_9b590da24b243731 = function(arg0, arg1, arg2) {
        arg0.id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setinnerHTML_904ded96a195390d = function(arg0, arg1, arg2) {
        arg0.innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setinnerText_d0e296d48743e0c2 = function(arg0, arg1, arg2) {
        arg0.innerText = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmethod_8ce1be0b4d701b7c = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmode_bd35f026f55b6247 = function(arg0, arg1) {
        arg0.mode = __wbindgen_enum_RequestMode[arg1];
    };
    imports.wbg.__wbg_setmultiple_6e7c7e8e01c84af1 = function(arg0, arg1) {
        arg0.multiple = arg1 !== 0;
    };
    imports.wbg.__wbg_setonabort_479ebb5884fcb171 = function(arg0, arg1) {
        arg0.onabort = arg1;
    };
    imports.wbg.__wbg_setonblocked_046331b614d6f8e3 = function(arg0, arg1) {
        arg0.onblocked = arg1;
    };
    imports.wbg.__wbg_setonce_418cf409fce4712c = function(arg0, arg1) {
        arg0.once = arg1 !== 0;
    };
    imports.wbg.__wbg_setonclick_e8b9eea1f736f6a0 = function(arg0, arg1) {
        arg0.onclick = arg1;
    };
    imports.wbg.__wbg_setonclose_b15bdabd419b6357 = function(arg0, arg1) {
        arg0.onclose = arg1;
    };
    imports.wbg.__wbg_setoncomplete_27bdbca012e45c05 = function(arg0, arg1) {
        arg0.oncomplete = arg1;
    };
    imports.wbg.__wbg_setonerror_537b68f474e27d4e = function(arg0, arg1) {
        arg0.onerror = arg1;
    };
    imports.wbg.__wbg_setonerror_ce5c4d34aed931bb = function(arg0, arg1) {
        arg0.onerror = arg1;
    };
    imports.wbg.__wbg_setonerror_e2c5c0fa6fbf6d99 = function(arg0, arg1) {
        arg0.onerror = arg1;
    };
    imports.wbg.__wbg_setonload_bf7e93d4a0f440ef = function(arg0, arg1) {
        arg0.onload = arg1;
    };
    imports.wbg.__wbg_setonmessage_007594843a0b97e8 = function(arg0, arg1) {
        arg0.onmessage = arg1;
    };
    imports.wbg.__wbg_setonmessage_f6cf46183c427754 = function(arg0, arg1) {
        arg0.onmessage = arg1;
    };
    imports.wbg.__wbg_setonopen_c42cfdbb28b087c4 = function(arg0, arg1) {
        arg0.onopen = arg1;
    };
    imports.wbg.__wbg_setonsuccess_0b2b45bd8cc13b95 = function(arg0, arg1) {
        arg0.onsuccess = arg1;
    };
    imports.wbg.__wbg_setonupgradeneeded_be2e0ae927917f82 = function(arg0, arg1) {
        arg0.onupgradeneeded = arg1;
    };
    imports.wbg.__wbg_setonversionchange_407ebf1ad930c84c = function(arg0, arg1) {
        arg0.onversionchange = arg1;
    };
    imports.wbg.__wbg_setonvisibilitychange_bf9148af4318598d = function(arg0, arg1) {
        arg0.onvisibilitychange = arg1;
    };
    imports.wbg.__wbg_setsignal_8e72abfe7ee03c97 = function(arg0, arg1) {
        arg0.signal = arg1;
    };
    imports.wbg.__wbg_settabIndex_4cb461d500346273 = function(arg0, arg1) {
        arg0.tabIndex = arg1;
    };
    imports.wbg.__wbg_settype_46edf1b6be363e70 = function(arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settype_acc38e64fddb9e3f = function(arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setunique_727cefd7e14cf677 = function(arg0, arg1) {
        arg0.unique = arg1 !== 0;
    };
    imports.wbg.__wbg_setvalue_566a07480c326fd3 = function(arg0, arg1, arg2) {
        arg0.value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setwidth_1d87b5f1ad4300d2 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_shaderSource_7a589d4a53657f04 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_shaderSource_853be9b5296e5b9f = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_shiftKey_3b3f09be0981b1ca = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_65139d3881002796 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_signal_b96223519a041faa = function(arg0) {
        const ret = arg0.signal;
        return ret;
    };
    imports.wbg.__wbg_size_e2929e11261f04db = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_stack_0b83281de580e52f = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_stack_c99a96ed42647c4c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_statSync_9a429acc496bafda = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.statSync(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_487c52c58d65314d = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_ee9704f328b6b291 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_78c9e3071b912620 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_a093d21393777366 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_status_a54682bbe52f9058 = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_stopPropagation_736fb4120069faa1 = function(arg0) {
        arg0.stopPropagation();
    };
    imports.wbg.__wbg_stringify_c242842b97f054cc = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_style_7337fe001c46487c = function(arg0) {
        const ret = arg0.style;
        return ret;
    };
    imports.wbg.__wbg_subarray_dd4ade7d53bd8e26 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_target_15f1da583855ac4e = function(arg0) {
        const ret = arg0.target;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_texImage2D_0b54979af70e074f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texImage2D_b2bc2e4b33d9448f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texImage2D_dfe45267ce0d8f50 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texParameteri_8367dd610bb1dbde = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_texParameteri_c4a4ce1cba81f166 = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_texSubImage2D_65906b543e5ca607 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_82dce0f6a2cd82ff = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_e87c9aebec6edf16 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_text_ec0e22f60e30dd2f = function() { return handleError(function (arg0) {
        const ret = arg0.text();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_82ab9fb4080f1707 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_then_db882932c0c714c6 = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_toLocaleString_e1d5faee72f9de10 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.toLocaleString(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_toString_2a748bb7135f7e4d = function(arg0, arg1, arg2) {
        const ret = arg1.toString(arg2);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_toString_e0223ef317f43fb7 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.toString(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_top_817aaa3d069998cc = function(arg0) {
        const ret = arg0.top;
        return ret;
    };
    imports.wbg.__wbg_touches_5f4c8dfce1c96c65 = function(arg0) {
        const ret = arg0.touches;
        return ret;
    };
    imports.wbg.__wbg_transaction_36c8b28ed4349a9a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.transaction(getStringFromWasm0(arg1, arg2), __wbindgen_enum_IdbTransactionMode[arg3]);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_transaction_new = function(arg0) {
        const ret = Transaction.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_transactioninput_new = function(arg0) {
        const ret = TransactionInput.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_transactionoutput_new = function(arg0) {
        const ret = TransactionOutput.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_transactionrecordnotification_new = function(arg0) {
        const ret = TransactionRecordNotification.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_type_00a5545ffd19769b = function(arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_type_5e03c1c7864e071f = function(arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_uniform1i_480ee6870f2c6cfd = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_81511501f6883c84 = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform2f_20f0bb243d8ec4d8 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2f(arg1, arg2, arg3);
    };
    imports.wbg.__wbg_uniform2f_d0f769bd634b82ad = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2f(arg1, arg2, arg3);
    };
    imports.wbg.__wbg_unlinkSync_656392e8d747415f = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.unlinkSync(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_update_297181dae0cc0af4 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.update(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_url_e6ed869ea05b7a71 = function(arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_useProgram_429819fe0c6aa5aa = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_useProgram_45d741846bbd56a2 = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_userAgent_a24a493cd80cbd00 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.userAgent;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_utxoentryreference_new = function(arg0) {
        const ret = UtxoEntryReference.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_value_17b896954e14f896 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_value_648dc44894c8dc95 = function() { return handleError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_a4bbd2f1909c0d63 = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_versions_c01dfd4722a88165 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_vertexAttribPointer_266cb2e02b9be248 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_vertexAttribPointer_c8134b09cf651c8d = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_29eeabd9311383a2 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_viewport_86e11c4418fb8365 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_visibilityState_dd2c8013a31cb756 = function(arg0) {
        const ret = arg0.visibilityState;
        return (__wbindgen_enum_VisibilityState.indexOf(ret) + 1 || 3) - 1;
    };
    imports.wbg.__wbg_walletdescriptor_new = function(arg0) {
        const ret = WalletDescriptor.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_warn_28319e260c89a4f8 = function(arg0, arg1) {
        console.warn(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_warn_546be8a35b05ef9a = function(arg0, arg1) {
        console.warn(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_width_1bfba151b991157a = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_width_74ff45f17c90c57c = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_writeFileSync_6325b339950ab342 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.writeFileSync(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_writeText_46d398d147639164 = function(arg0, arg1, arg2) {
        const ret = arg0.writeText(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_write_8adc039d1d95752a = function(arg0, arg1) {
        const ret = arg0.write(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper115872 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 11086, __wbg_adapter_90);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper115883 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 11087, __wbg_adapter_93);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper115887 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 11084, __wbg_adapter_96);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper117460 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 11156, __wbg_adapter_99);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper117814 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 11177, __wbg_adapter_102);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper15404 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2253, __wbg_adapter_60);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper16275 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2387, __wbg_adapter_63);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper16278 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2389, __wbg_adapter_66);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper16286 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2391, __wbg_adapter_69);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper46000 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 4088, __wbg_adapter_72);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper58297 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 5094, __wbg_adapter_75);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper58300 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 5097, __wbg_adapter_78);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper75566 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 6137, __wbg_adapter_81);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper78710 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 6262, __wbg_adapter_84);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper78725 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 6264, __wbg_adapter_87);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_falsy = function(arg0) {
        const ret = !arg0;
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbindgen_lt = function(arg0, arg1) {
        const ret = arg0 < arg1;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_neg = function(arg0) {
        const ret = -arg0;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_try_into_number = function(arg0) {
        let result;
        try { result = +arg0 } catch (e) { result = e }
        const ret = result;
        return ret;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('tondi-dashboard_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
