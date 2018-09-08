import BgpSpaceSource from "./source/BgpSpace";
import * as CIDR from 'cidr-js'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

const cidr = new CIDR()

const RULE_COUNT = 10
const DEFAULT_RULE = `\n    <Rule enabled="true">
        <Name>Default</Name>
        <Action type="Direct" />
    </Rule>\n`

async function main() {
    const source = new BgpSpaceSource()
    const routes = await source.getRouteList()

    const preRuleCount = parseInt(((routes.length + RULE_COUNT) / RULE_COUNT)
        .toFixed(0))

    let data = '<RuleList>\n'

    for (let i = 1; i <= RULE_COUNT; i++) {
        const name = `chnroute-${i}`

        const routeText = routes
            .slice((i - 1) * preRuleCount, (
                (i * preRuleCount) > routes.length
                    ? routes.length
                    : i * preRuleCount
            ))
            .map(i => `${cidr.range(i).start}-${cidr.range(i).end}`)
            .join(';')

        data += `        <Rule enable="true">
            <Name>${name}</Name>
            <Target>${routeText}</Target>
            <Action type="Direct" />
        </Rule>\n`
    }

    // trim space
    let result = data.split('\n')
        .map(i => i.replace(/        /g, '    '))
        .join("\n")

    result += DEFAULT_RULE
    result += '</RuleList>'

    await writeFile('chnroute.xml', result)
}

main()
