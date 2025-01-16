import dayjs from 'dayjs'

dayjs.locale('en')

import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export { dayjs }
