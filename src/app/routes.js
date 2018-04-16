import NotFound from 'pages/fallbacks/NotFound'
import AppLayout from 'layouts/AppLayout'

import { routes as auth } from 'pages/auth'
import { routes as dashboard } from 'pages/dashboard'
import { routes as test } from 'pages/test'
import { routes as testConnected } from 'pages/test-connected'

import { access } from 'common/session'

const appRoutes = [
  {
    path: '/',
    exact: true,
    name: 'root',
    redirectTo: '/dashboard',
  },
  {
    path: '/',
    layout: AppLayout,
    routes: [
      {
        path: '/auth',
        routes: auth,
        access: access.F_UNAUTHRORIZED,
        accessRedirectTo: '/dashboard',
      },
      {
        path: '/dashboard',
        routes: dashboard,
        access: access.F_PROTECTED,
        accessRedirectTo: '/auth',
        name: 'dashboard',
      },
      {
        path: '/test',
        routes: test,
        access: access.F_PUBLIC,
        name: 'test',
      },
      {
        path: '/test-connected',
        routes: testConnected,
        access: access.F_PUBLIC,
        name: 'test-connected',
      },
      {
        path: '/additional',
        name: 'additional',
        component: ()=> <span>additional</span>,
      },
      {
        component: NotFound,
      },
    ],
  },
]

export default appRoutes
export const namedRoutes = routesMap(appRoutes)

function routesMap(routes, basePath = '/') {
  return routes.reduce(function(acc, { name, path, routes }) {
    if(!path) {
      return acc
    }

    path = makePath(path, basePath)

    if(name) {
      acc = {
        ...acc,
        [name]: path,
      }
    }

    if(routes) {
      acc = {
        ...acc,
        ...(routesMap(routes, path)),
      }
    }
    return acc
  }, {})
}

function makePath(path, basePath) {
  return (basePath + path).replace(/\/+/g, '/')
}
