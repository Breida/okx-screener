import dayjs from 'dayjs'

dayjs.locale('en')

// импортируем плагины
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

// подключаем плагины
dayjs.extend(customParseFormat)
dayjs.extend(utc)

export { dayjs }
