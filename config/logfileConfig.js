import logging from 'py-logging'
import {install} from 'py-logging/nodekit/index.js'

install(logging)

logging.basicConfig({
    filename: '/var/log/logs.log',
    format:'%(asctime) - %(levelname) - %(message) - %(error)',
    level: 'DEBUG'
})

export default logging
