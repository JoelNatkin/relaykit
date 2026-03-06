export interface AsyncCheckResult {
  ruleId: string;
  passed: boolean;
  severity: 'warning';
  details: string;
}

export interface AsyncScanResult {
  overallStatus: 'clean' | 'warning';
  checks: AsyncCheckResult[];
}
