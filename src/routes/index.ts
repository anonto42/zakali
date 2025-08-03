import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { BoostRoutes } from '../app/modules/boost/boost.route';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { InformationRoutes } from '../app/modules/informations/info.module';
import { SupportRoutes } from '../app/modules/support/support.route';
import { CommunicationRoutes } from '../app/modules/communication/communication.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/boost',
    route: BoostRoutes,
  },
  {
    path: '/subscription',
    route: SubscriptionRoutes
  },
  {
    path: '/information',
    route: InformationRoutes
  },
  {
    path: "/support",
    route: SupportRoutes
  },
  {
    path: "/communication",
    route: CommunicationRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
