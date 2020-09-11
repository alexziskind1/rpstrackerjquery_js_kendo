import { CONFIG } from "../../config";

/*
export interface DashboardFilter {
    userId?: number;
    dateStart?: Date;
    dateEnd?: Date;
}

export interface ItemsForMonth {
    closed: PtItem[];
    open: PtItem[];
}

export interface FilteredIssues {
    categories: Date[];
    items: ItemsForMonth[];
}
*/

export class DashboardRepository {
  constructor() {}

  getFilterParamString(filter) {
    const params = [
      filter.userId ? `userId=${filter.userId}` : "",
      filter.dateStart ? `dateStart=${filter.dateStart.toDateString()}` : "",
      filter.dateEnd ? `dateEnd=${filter.dateEnd.toDateString()}` : "",
    ];
    const paramStr = params.join("&");
    return paramStr;
  }
  getStatusCountsUrl(paramStr) {
    return `${CONFIG.apiEndpoint}/stats/statuscounts?${paramStr}`;
  }

  getPriorityCountsUrl(paramStr) {
    return `${CONFIG.apiEndpoint}/stats/prioritycounts?${paramStr}`;
  }

  getTypeCountsUrl(paramStr) {
    return `${CONFIG.apiEndpoint}/stats/prioritycounts?${paramStr}`;
  }

  getFilteredIssuesUrl(paramStr) {
    return `${CONFIG.apiEndpoint}/stats/filteredissues?${paramStr}`;
  }

  getStatusCounts(filter) {
    return fetch(
      this.getStatusCountsUrl(this.getFilterParamString(filter))
    ).then((response) => response.json());
  }

  getPriorityCounts(filter) {
    return fetch(
      this.getPriorityCountsUrl(this.getFilterParamString(filter))
    ).then((response) => response.json());
  }

  getTypeCounts(filter) {
    return fetch(
      this.getTypeCountsUrl(this.getFilterParamString(filter))
    ).then((response) => response.json());
  }

  getFilteredIssues(filter) {
    return fetch(
      this.getFilteredIssuesUrl(this.getFilterParamString(filter))
    ).then((response) => response.json());
  }
}
