interface RouteSource {
    getRouteList(): Promise<Array<string>>;
}

export default RouteSource
