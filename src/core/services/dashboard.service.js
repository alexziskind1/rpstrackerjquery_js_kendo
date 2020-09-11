export class DashboardService {
  constructor(repo) {
    this.repo = repo;
  }

  getStatusCounts(filter) {
    return this.repo.getStatusCounts(filter);
  }

  getPriorityCounts(filter) {
    return this.repo.getPriorityCounts(filter);
  }

  getTypeCounts(filter) {
    return this.repo.getTypeCounts(filter);
  }

  getFilteredIssues(filter) {
    return this.repo.getFilteredIssues(filter);
  }
}
