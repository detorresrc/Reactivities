import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "@/features/activities/dashboard/ActivityDashboard";
import ActivityForm from "@/features/activities/form/ActivityForm";
import ActivityDetails from "@/features/activities/details/ActivityDetails";
import TestError from "@/features/errors/TestError";
import NotFound from "@/features/errors/NotFound";
import ServerError from "@/features/errors/ServerError";
import ProfilePage from "@/features/profiles/ProfilePage";
import RequireAuth from "./RequireAuth";
import RegistrationSuccess from "@/features/users/RegistrationSuccess";
import ConfirmEmail from "@/features/users/ConfirmEmail";

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'activities',
            element: <ActivityDashboard/>
          },
          {
            path: 'activities/:id',
            element: <ActivityDetails/>
          },
          {
            path: 'activities/edit/:id',
            element: <ActivityForm key="edit"/>,
            loader: ActivityForm.loader
          },
          {
            path: 'activities/create',
            element: <ActivityForm key="create"/>
          },
          {
            path: 'profiles/:username',
            element: <ProfilePage/>
          },
          {
            path: 'errors',
            element: <TestError/>
          },
        ]
      },
      {
        path: '/account/registration-success',
        element: <RegistrationSuccess/>
      },
      {
        path: '/account/verifyEmail',
        element: <ConfirmEmail/>
      },
      {
        path: 'not-found',
        element: <NotFound/>
      },
      {
        path: 'server-error',
        element: <ServerError/>
      },
      {
        path: '*',
        element: <Navigate replace to='/not-found'/>
      }
    ]
  }
]

export const router = createBrowserRouter(routes);