import axios from 'axios'
import RouteSource from '../types/route'

class BgpSpaceSource implements RouteSource {
    private routes: Array<string>
    private inited = false

    private async init() {
        const res = await axios.get('https://bgp.space/all_cn_cidr.html')
        const { data }: { data: string } = res;
        const clearTop = data.substr(data.indexOf('&nbsp;#########') + 15 + 5)
        const cleared = clearTop.substr(0, clearTop.indexOf('######### &nbsp;') - 1)

        this.routes = cleared.replace(/\<br\>/g, '')
            .split('\n')
    }

    async getRouteList(): Promise<Array<string>> {
        if (!this.inited) {
            await this.init()
        }

        return this.routes
    }
}

export default BgpSpaceSource
