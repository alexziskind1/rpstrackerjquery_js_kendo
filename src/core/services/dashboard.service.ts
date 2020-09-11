import { DashboardRepository, DashboardFilter, FilteredIssues } from "./dashboard.repository";
import { StatusCounts, PriorityCounts, TypeCounts } from "../../shared/models/ui";


export class DashboardService {

    constructor(
        private repo: DashboardRepository
    ) { }

    public getStatusCounts(filter: DashboardFilter): Promise<StatusCounts> {
        return this.repo.getStatusCounts(filter);
    }

    public getPriorityCounts(filter: DashboardFilter): Promise<PriorityCounts> {
        return this.repo.getPriorityCounts(filter);
    }

    public getTypeCounts(filter: DashboardFilter): Promise<TypeCounts> {
        return this.repo.getTypeCounts(filter);
    }

    public getFilteredIssues(filter: DashboardFilter): Promise<FilteredIssues> {
        return this.repo.getFilteredIssues(filter);
    }
}
