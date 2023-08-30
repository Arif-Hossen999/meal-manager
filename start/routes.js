'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.get('/', () => {
//   return { greeting: 'Hello world in JSON' }
// })

Route.group(() => {
  // Route for user registration
  Route.post('/auth/register', 'UserController.register').validator(
    'CreateUser',
  )
  // Route for confirmation mail
  Route.post('/auth/register/confirm', 'UserController.confirm')
  // Route for resend confirmation mail
  Route.patch('/auth/register/resend/:id', 'ResendController.resend')
  // Route for user login
  Route.post('/auth/login', 'UserController.login').validator('LoginUser')
  // Route for update password
  Route.patch('/auth/updatepassword', 'UserController.updatepassword')
  // Route for forgotPassword
  Route.post(
    '/auth/forgotpassword',
    'ForgotPasswordController.forgotpassword',
  ).validator('CreatePassword')

  // Route for Hostel
  Route.get('/hostels', 'HostelController.view').middleware('auth')
  Route.post('/hostels', 'HostelController.create')
    .middleware('auth')
    .validator('CreateHostel')
  Route.patch('/hostels/:id', 'HostelController.update').middleware('auth')
  Route.delete('/hostels/:id', 'HostelController.destroy').middleware('auth')

  // Route for add memebers
  Route.get('/members', 'MemberController.view').middleware('auth')
  Route.post('/members', 'MemberController.create')
    .middleware('auth')
    .validator('CreateMember')
  Route.patch('/members/:id', 'MemberController.update').middleware('auth')
  Route.delete('/members/:id', 'MemberController.destroy').middleware('auth')

  // Route for deposit
  Route.get('/deposits', 'DepositController.view').middleware('auth')
  Route.post('/deposits', 'DepositController.create')
    .middleware('auth')
    .validator('CreateDeposit')
  Route.patch('/deposits/:id', 'DepositController.update').middleware('auth')
  Route.delete('/deposits/:id', 'DepositController.destroy').middleware('auth')

  // Route for bazar list
  Route.get('/bazarlists', 'BazarListController.view').middleware('auth')
  Route.post('/bazarlists', 'BazarListController.create')
    .middleware('auth')
    .validator('CreateBazarList')
  Route.patch('/bazarlists/:id', 'BazarListController.update').middleware(
    'auth',
  )
  Route.delete('/bazarlists/:id', 'BazarListController.destroy').middleware(
    'auth',
  )

  // Route for create meals
  Route.get('/meals', 'MealController.view').middleware('auth')
  Route.post('/meals', 'MealController.create')
    .middleware('auth')
    .validator('CreateMeal')
  Route.patch('/meals/:id', 'MealController.update').middleware('auth')
  Route.delete('/meals/:id', 'MealController.destroy').middleware('auth')

  // Route for extra cost
  Route.get('/extracosts', 'ExtraCostController.view').middleware('auth')
  Route.post('/extracosts', 'ExtraCostController.create')
    .middleware('auth')
    .validator('CreateExtraCost')
  Route.patch('/extracosts/:id', 'ExtraCostController.update').middleware(
    'auth',
  )
  Route.delete('/extracosts/:id', 'ExtraCostController.destroy').middleware(
    'auth',
  )

  // Route for total bazar costs
  Route.post('/totalcosts', 'TotalCostController.totalBazar').middleware('auth')

  // Route for total meals
  Route.post('/totalmeals', 'TotalCostController.totalMeal').middleware('auth')

  // Route for total extra costs
  Route.post(
    '/totalextracosts',
    'TotalCostController.totalExtraCost',
  ).middleware('auth')

  // Route for profile
  Route.get('/profiles/:id', 'ProfileController.myProfile').middleware('auth')

  // Route for image
  Route.get('/images', 'ImageController.view').middleware('auth')
  Route.post('/images', 'ImageController.upload').middleware('auth')
  Route.patch('/images', 'ImageController.update').middleware('auth')
  Route.delete('/images', 'ImageController.destroy').middleware('auth')

  // Route for nofitication
  Route.get('/notifications', 'NotificationUserController.view').middleware(
    'auth',
  )
  Route.post('/notifications', 'NotificationUserController.create').middleware(
    'auth',
  )
  Route.delete(
    '/notifications/:id',
    'NotificationUserController.destroy',
  ).middleware('auth')
  // Route for comfirm Notification
  Route.post('/notification/confirm', 'NotificationUserController.confirm')

  // Route for change manager
  Route.patch('/add/manager/:id', 'ChangeManagerController.update').middleware(
    'auth',
  )

  // Route for app version
  Route.get('/appversion', 'AppVersionController.updateVersion')
}).prefix('api')
