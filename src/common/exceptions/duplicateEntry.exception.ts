/**
 * control exception flow with custom error on duplicates in database
 */
export class DuplicateEntryException {
  constructor(public duplicateEntries: Record<string, boolean>) {}
}
