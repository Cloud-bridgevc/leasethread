// S3 ObjectCreated -> Lambda. NOT YET DEPLOYED.
// 1) Textract (or PDF text) -> 2) Bedrock structured extraction with per-field quoted passages
// 3) Verify each passage actually appears in the source text (reject hallucinated quotes)
// 4) Insert into lease_extractions (status 'extracted'); managers verify in the UI.
export const handler = async (_event: unknown) => { throw new Error('Not implemented — see docs/BACKEND_STATUS.md') }
