import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetMyNotificationUnreadCount} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)

    const UserWallet = ParsePathGiveParameter(req.url);
    if(UserWallet == -1){res.end()}

    console.log("UserWallet: " + UserWallet);
    const notifications = await GetMyNotificationUnreadCount(UserWallet);


    console.log("server, UserWallet: " + UserWallet);
    console.log("server: " + JSON.stringify(notifications));

    res.end(JSON.stringify(notifications, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute