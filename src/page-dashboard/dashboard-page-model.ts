import { BehaviorSubject, Observable } from "rxjs";

import { Store } from "../core/state/app-store";
import { PtUserService } from "../core/services/pt-user-service";
import { DashboardRepository, DashboardFilter, FilteredIssues } from "../core/services/dashboard.repository";
import { DashboardService } from "../core/services/dashboard.service";
import { StatusCounts } from "../shared/models/ui";
import { PtUser } from "../core/models/domain";


interface DateRange {
    dateStart: Date;
    dateEnd: Date;
}

interface DataForChart {
    categories: Date[];
    itemsOpenByMonth: number[];
    itemsClosedByMonth: number[];
}

export class DashboardPageModel {

    private store: Store = new Store();
    private dashboardRepo: DashboardRepository = new DashboardRepository();
    private dashboardService: DashboardService = new DashboardService(this.dashboardRepo);
    private userService: PtUserService = new PtUserService(this.store);

    public filter$: BehaviorSubject<DashboardFilter> = new BehaviorSubject<DashboardFilter>({});
    public statusCounts$: BehaviorSubject<StatusCounts> = new BehaviorSubject<StatusCounts>(undefined);

    public dataForChart$: BehaviorSubject<DataForChart> = new BehaviorSubject<DataForChart>(undefined);

    public users$: Observable<PtUser[]> = this.store.select<PtUser[]>('users');

    public selectedUserIdStr: string = '';

    /*
        public categories: Date[] = [];
        public itemsOpenByMonth: number[] = [];
        public itemsClosedByMonth: number[] = [];
        */


    public onMonthRangeSelected(months: number) {
        const range = this.getDateRange(months);
        const userId = this.filter$.value ? this.filter$.value.userId ? this.filter$.value.userId : undefined : undefined;
        this.filter$.next({
            userId: userId,
            dateEnd: range.dateEnd,
            dateStart: range.dateStart
        });
        this.refresh();
    }

    private getDateRange(months: number): DateRange {
        const now = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months);
        return {
            dateStart: start,
            dateEnd: now
        };
    }

    public refresh() {
        const filter = this.filter$.value;
        if (filter) {
            Promise.all<StatusCounts, FilteredIssues>([
                this.dashboardService.getStatusCounts(filter),
                this.dashboardService.getFilteredIssues(filter),
            ]).then(results => {
                this.statusCounts$.next(results[0]);
                this.updateStats(results[1]);
            });

            /*
            this.dashboardService.getStatusCounts(filter)
                .then(result => {
                    this.statusCounts$.next(result);
                });
                */
        }
    }

    public usersRequested() {
        this.userService.fetchUsers();
    }

    public userFilterValueChange() {
        if (this.selectedUserIdStr) {
            this.filter$.value.userId = Number(this.selectedUserIdStr);
        } else {
            this.filter$.value.userId = undefined;
        }
        this.refresh();
    }

    private updateStats(issuesAll: FilteredIssues) {
        const cats = issuesAll.categories.map(c => new Date(c));
        const itemsOpenByMonth: number[] = [];
        const itemsClosedByMonth: number[] = [];
        issuesAll.items.forEach((item, index) => {
            itemsOpenByMonth.push(item.open.length);
            itemsClosedByMonth.push(item.closed.length);
        });
        this.dataForChart$.next({
            categories: cats,
            itemsOpenByMonth: itemsOpenByMonth,
            itemsClosedByMonth: itemsClosedByMonth
        });
    }
}
