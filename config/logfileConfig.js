import logging from 'py-logging'
import {install} from 'py-logging/nodekit/index.js'

install(logging)

logging.basicConfig({
    filename: './logFiles/logs.log',
    format:'%(asctime) - %(levelname) - %(message) - %(error)',
    level: 'DEBUG'
})

export default logging
