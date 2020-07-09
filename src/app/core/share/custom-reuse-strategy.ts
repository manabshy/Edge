import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from "@angular/router";
import { AppUtils, IRouteConfigData } from "../shared/utils";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {

    constructor() {

    }


    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const data = this.getRouteData(route);
        return data && data.shouldDetach;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const url = this.getFullRouteUrl(route);
        const data = this.getRouteData(route);
        AppUtils.routeCache.set(url, { handle, data });
        this.addRedirectsRecursively(route);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const url = this.getFullRouteUrl(route);
        return AppUtils.routeCache.has(url);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        const url = this.getFullRouteUrl(route);
        const data = this.getRouteData(route);
        return data && data.shouldDetach && AppUtils.routeCache.has(url)
            ? AppUtils.routeCache.get(url).handle
            : null;
    }

    private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
        const config = route.routeConfig;
        if (config) {
            if (!config.loadChildren) {
                const routeFirstChild = route.firstChild;
                const routeFirstChildUrl = routeFirstChild
                    ? this.getRouteUrlPaths(routeFirstChild).join('/')
                    : '';
                const childConfigs = config.children;
                if (childConfigs) {
                    const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
                    if (childConfigWithRedirect) {
                        childConfigWithRedirect.redirectTo = routeFirstChildUrl;
                    }
                }
            }
            route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
        }
    }

    private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
        return this.getFullRouteUrlPaths(route).filter(Boolean).join('/');
    }

    private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        const paths = this.getRouteUrlPaths(route);
        return route.parent
            ? [...this.getFullRouteUrlPaths(route.parent), ...paths]
            : paths;
    }

    private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        return route.url.map(urlSegment => urlSegment.path);
    }

    private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
        return route.routeConfig && route.routeConfig.data as IRouteConfigData;
    }

    // shouldDetach(route: ActivatedRouteSnapshot): boolean {
    //     return route.data && (route.data as any).shouldDetach;
    // }

    // store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    //     AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")] = handle;
    // }

    // shouldAttach(route: ActivatedRouteSnapshot): boolean {
    //     console.log(route.url.join("/") || route.parent.url.join("/"));
    //     console.log(AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")]);
    //     console.log(AppUtils.routeHandlers);
    //     return !!AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")];
    // }

    // retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    //     return AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")];
    // }

    // shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    //     return future.routeConfig === curr.routeConfig;
    // }

}