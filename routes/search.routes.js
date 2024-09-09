import { Router } from "express";
import { getMoredata, search, searchWithFillter, topThreeDoctor } from "../controllers/searchController.js";
import {upload, uploadPdf} from '../middelwares/multer.js'

const searchRoutes = Router();


searchRoutes.get('/' , search)
searchRoutes.post('/searchwithfilter' , searchWithFillter)

searchRoutes.get('/getmoredata',getMoredata)
searchRoutes.get('/topthreedoctors',topThreeDoctor)





export default searchRoutes