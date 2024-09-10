import logging from 'py-logging'
import {install} from 'py-logging/nodekit/index.js'

install(logging)

logging.basicConfig({
    filename: 'path/to/logfile.log',
    format:'%(asctime) - %(levelname) - %(message) - %(error)',
    level: 'DEBUG'
})

export default logging
