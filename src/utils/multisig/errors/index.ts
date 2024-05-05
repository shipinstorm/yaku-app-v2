/* eslint-disable max-classes-per-file */
/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ErrorWithCode = Error & { code: number };
type MaybeErrorWithCode = ErrorWithCode | null | undefined;

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map();
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map();

/**
 * KeyNotInMultisig: ''
 *
 * @category Errors
 * @category generated
 */
export class KeyNotInMultisigError extends Error {
  readonly code: number = 0x1770;

  readonly name: string = "KeyNotInMultisig";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, KeyNotInMultisigError);
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new KeyNotInMultisigError());
createErrorFromNameLookup.set(
  "KeyNotInMultisig",
  () => new KeyNotInMultisigError()
);

/**
 * InvalidTransactionState: ''
 *
 * @category Errors
 * @category generated
 */
export class InvalidTransactionStateError extends Error {
  readonly code: number = 0x1771;

  readonly name: string = "InvalidTransactionState";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidTransactionStateError);
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new InvalidTransactionStateError());
createErrorFromNameLookup.set(
  "InvalidTransactionState",
  () => new InvalidTransactionStateError()
);

/**
 * InvalidNumberOfAccounts: ''
 *
 * @category Errors
 * @category generated
 */
export class InvalidNumberOfAccountsError extends Error {
  readonly code: number = 0x1772;

  readonly name: string = "InvalidNumberOfAccounts";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidNumberOfAccountsError);
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new InvalidNumberOfAccountsError());
createErrorFromNameLookup.set(
  "InvalidNumberOfAccounts",
  () => new InvalidNumberOfAccountsError()
);

/**
 * InvalidInstructionAccount: ''
 *
 * @category Errors
 * @category generated
 */
export class InvalidInstructionAccountError extends Error {
  readonly code: number = 0x1773;

  readonly name: string = "InvalidInstructionAccount";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidInstructionAccountError);
    }
  }
}

createErrorFromCodeLookup.set(
  0x1773,
  () => new InvalidInstructionAccountError()
);
createErrorFromNameLookup.set(
  "InvalidInstructionAccount",
  () => new InvalidInstructionAccountError()
);

/**
 * InvalidAuthorityIndex: ''
 *
 * @category Errors
 * @category generated
 */
export class InvalidAuthorityIndexError extends Error {
  readonly code: number = 0x1774;

  readonly name: string = "InvalidAuthorityIndex";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidAuthorityIndexError);
    }
  }
}

createErrorFromCodeLookup.set(0x1774, () => new InvalidAuthorityIndexError());
createErrorFromNameLookup.set(
  "InvalidAuthorityIndex",
  () => new InvalidAuthorityIndexError()
);

/**
 * TransactionAlreadyExecuted: ''
 *
 * @category Errors
 * @category generated
 */
export class TransactionAlreadyExecutedError extends Error {
  readonly code: number = 0x1775;

  readonly name: string = "TransactionAlreadyExecuted";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, TransactionAlreadyExecutedError);
    }
  }
}

createErrorFromCodeLookup.set(
  0x1775,
  () => new TransactionAlreadyExecutedError()
);
createErrorFromNameLookup.set(
  "TransactionAlreadyExecuted",
  () => new TransactionAlreadyExecutedError()
);

/**
 * CannotRemoveSoloMember: ''
 *
 * @category Errors
 * @category generated
 */
export class CannotRemoveSoloMemberError extends Error {
  readonly code: number = 0x1776;

  readonly name: string = "CannotRemoveSoloMember";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, CannotRemoveSoloMemberError);
    }
  }
}

createErrorFromCodeLookup.set(0x1776, () => new CannotRemoveSoloMemberError());
createErrorFromNameLookup.set(
  "CannotRemoveSoloMember",
  () => new CannotRemoveSoloMemberError()
);

/**
 * InvalidThreshold: ''
 *
 * @category Errors
 * @category generated
 */
export class InvalidThresholdError extends Error {
  readonly code: number = 0x1777;

  readonly name: string = "InvalidThreshold";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidThresholdError);
    }
  }
}

createErrorFromCodeLookup.set(0x1777, () => new InvalidThresholdError());
createErrorFromNameLookup.set(
  "InvalidThreshold",
  () => new InvalidThresholdError()
);

/**
 * DeprecatedTransaction: ''
 *
 * @category Errors
 * @category generated
 */
export class DeprecatedTransactionError extends Error {
  readonly code: number = 0x1778;

  readonly name: string = "DeprecatedTransaction";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, DeprecatedTransactionError);
    }
  }
}

createErrorFromCodeLookup.set(0x1778, () => new DeprecatedTransactionError());
createErrorFromNameLookup.set(
  "DeprecatedTransaction",
  () => new DeprecatedTransactionError()
);

/**
 * InstructionFailed: ''
 *
 * @category Errors
 * @category generated
 */
export class InstructionFailedError extends Error {
  readonly code: number = 0x1779;

  readonly name: string = "InstructionFailed";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InstructionFailedError);
    }
  }
}

createErrorFromCodeLookup.set(0x1779, () => new InstructionFailedError());
createErrorFromNameLookup.set(
  "InstructionFailed",
  () => new InstructionFailedError()
);

/**
 * MaxMembersReached: ''
 *
 * @category Errors
 * @category generated
 */
export class MaxMembersReachedError extends Error {
  readonly code: number = 0x177a;

  readonly name: string = "MaxMembersReached";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, MaxMembersReachedError);
    }
  }
}

createErrorFromCodeLookup.set(0x177a, () => new MaxMembersReachedError());
createErrorFromNameLookup.set(
  "MaxMembersReached",
  () => new MaxMembersReachedError()
);

/**
 * EmptyMembers: ''
 *
 * @category Errors
 * @category generated
 */
export class EmptyMembersError extends Error {
  readonly code: number = 0x177b;

  readonly name: string = "EmptyMembers";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, EmptyMembersError);
    }
  }
}

createErrorFromCodeLookup.set(0x177b, () => new EmptyMembersError());
createErrorFromNameLookup.set("EmptyMembers", () => new EmptyMembersError());

/**
 * PartialExecution: ''
 *
 * @category Errors
 * @category generated
 */
export class PartialExecutionError extends Error {
  readonly code: number = 0x177c;

  readonly name: string = "PartialExecution";

  constructor() {
    super("");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, PartialExecutionError);
    }
  }
}

createErrorFromCodeLookup.set(0x177c, () => new PartialExecutionError());
createErrorFromNameLookup.set(
  "PartialExecution",
  () => new PartialExecutionError()
);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code);
  return createError != null ? createError() : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name);
  return createError != null ? createError() : null;
}
