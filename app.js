var app = angular.module('myApp', ['ngRoute'])

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/users', {
      templateUrl: 'templates/user-list.html',
      // controller: 'UserListController',
    })
    // .when('/users/:userId', {
    //   templateUrl: 'templates/user-detail.html',
    //   controller: 'UserDetailController',
    // })
    .when('/404', {
      templateUrl: 'templates/error-404.html',
    })
    .otherwise({
      redirectTo: '/users',
    })

  $locationProvider
    .html5Mode({ enabled: true, requireBase: false })
    .hashPrefix('')
})

app.service('UserService', function () {
  let users = [
    {
      id: 1,
      username: 'user1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      user_type: 'Admin',
    },
    {
      id: 2,
      username: 'user2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: 'jane456',
      user_type: 'Driver',
    },
    {
      id: 15,
      username: 'user15',
      first_name: 'Alice',
      last_name: 'Johnson',
      email: 'alice@example.com',
      password: 'alice789',
      user_type: 'Driver',
    },
  ]

  this.getUsers = function () {
    return users
  }

  this.getUserIndex = function (updatedUser) {
    return users.findIndex((user) => {
      return user.id === updatedUser.id
    })
  }

  this.getUserById = function (userId) {
    return users.find(function (user) {
      return user.id === userId
    })
  }

  this.updateUser = function (updatedUser) {
    const userIndex = this.getUserIndex(updatedUser)

    if (userIndex !== -1) {
      users[userIndex] = updatedUser
    }
  }

  this.deleteUser = function (updatedUser) {
    const userIndex = this.getUserIndex(updatedUser)

    if (userIndex !== -1) {
      users.splice(userIndex, 1)
    }
  }

  this.createUser = function (newUser) {
    users.push(newUser)
  }
})

app.factory('store', function () {
  return {
    selectedUser: null,
    isNewUser: false,
    getUserById: function (id) {
      return
    },
  }
})

app.controller('UserListController', function (UserService, store) {
  this.store = store
  this.users = UserService.getUsers()
  this.selectedUser = null
  this.selectUser = function (user) {
    this.store.selectedUser = user
  }
  this.createUser = function () {
    this.store.isNewUser = true
  }
})

app.controller('UserDetailController', function (UserService, store) {
  this.store = store
  this.user = this.store.isNewUser
    ? {}
    : UserService.getUserById(this.store.selectedUser.id)
  this.editMode = true
  this.toggleEditMode = function () {
    this.store.selectedUser = null
    this.store.isNewUser = false
  }
  this.saveUser = function () {
    UserService.updateUser(this.user)
    this.toggleEditMode()
  }
  this.deleteUser = function () {
    UserService.deleteUser(this.user)
    this.toggleEditMode()
  }
  this.createUser = function () {
    UserService.createUser(this.user)
    this.toggleEditMode()
  }
})
