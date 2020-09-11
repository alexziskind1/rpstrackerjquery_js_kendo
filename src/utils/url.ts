export function pushUrl(page: string, title: string, url: string) {
    if ("undefined" !== typeof history.pushState) {
        history.pushState({ page: page }, title, url);
    } else {
        window.location.assign(url);
    }
}

export function getQueryParameter(paramName: string): string {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(paramName)) {
        return urlParams.get(paramName);
    } else {
        return undefined;
    }
}
