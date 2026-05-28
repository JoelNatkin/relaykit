// Committed canonical constraint data — single enforcement source of truth.
//
// PM generates the populated VERTICALS array from the Airtable Constraints base
// (appxThB8UWmNulAMt) via the Airtable MCP connector in a follow-up session.
// No runtime Airtable sync — this file is the contract.
//
// Slugs are kebab-case and load-bearing (URL segments, primer file paths).
// They are authored at generation time, not derived from name at runtime.

import type { Vertical } from "./types";

export const VERTICALS: ReadonlyArray<Vertical> = [];
