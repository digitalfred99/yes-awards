export const SuccessCodes = {
  RECORD_FETCHED: { code: "SVF_S2000", message: "Operation done successfully", },
  RECORD_CREATED: { code: "SVF_S2001", message: "Operation done successfully", },
  RECORD_UPDATED: { code: "SVF_S2002", message: "Operation done successfully", },
  RECORD_DELETED: { code: "SVF_S2003", message: "Operation done successfully", },
} as const;

export type SuccessCode =
  (typeof SuccessCodes)[keyof typeof SuccessCodes];