export class DuplicateEntryException {
  constructor(public duplicateEntries: Record<string, boolean>) {}
}
