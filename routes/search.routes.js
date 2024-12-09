import { Router } from "express";
import { search, searchWithFillter, topThreeDoctor } from "../controllers/searchController.js";
import { authRole, userAuth } from "../middelwares/userAuth.js";



const searchRoutes = Router();


searchRoutes.get('/' , search)
searchRoutes.get('/admin/' ,userAuth,authRole('admin'), search)
searchRoutes.post('/searchwithfilter' , searchWithFillter)


searchRoutes.get('/topthreedoctors',topThreeDoctor)







export default searchRoutes