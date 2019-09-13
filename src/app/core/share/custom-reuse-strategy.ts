import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from "@angular/router";
import { AppUtils } from "../shared/utils";

export class CustomReuseStrategy implements RouteReuseStrategy {
    
  
    constructor() {
      
    }
  
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data && (route.data as any).shouldDetach;
    }
  
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
      AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")] = handle;    
    }
  
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
      return !!AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")];    
    }
  
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
      return AppUtils.routeHandlers[route.url.join("/") || route.parent.url.join("/")];    
    }
  
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
      return future.routeConfig === curr.routeConfig;
    }
  
  }