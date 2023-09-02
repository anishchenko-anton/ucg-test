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

app.service('UserService', [
  'ActiveStatusState',
  function (ActiveStatusState) {
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
        ActiveStatusState.setSuccessMessage('user updated successfully')
      }
    }

    this.deleteUser = function (updatedUser) {
      const userIndex = this.getUserIndex(updatedUser)

      if (userIndex !== -1) {
        users.splice(userIndex, 1)
        ActiveStatusState.setSuccessMessage('user deleted successfully')
      }
    }

    this.createUser = function (newUser) {
      users.push(newUser)
      ActiveStatusState.setSuccessMessage('user created successfully')
    }
  },
])

app.factory('store', function () {
  return {
    selectedUser: null,
    isNewUser: false,
    getUserById: function (id) {
      return
    },
  }
})

app.factory('ActiveStatusState', function () {
  return {
    successMessage: null,
    errorMessage: null,
    setSuccessMessage: function (message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = null
      }, 1000)
    },

    setErrorMessage: function (message) {
      this.errorMessage = message
    },
  }
})

app.controller('StateController', function (ActiveStatusState) {
  this.activeStatusState = ActiveStatusState
})

app.controller('UserListController', function (UserService, store) {
  this.store = store
  this.users = UserService.getUsers()
  this.selectedUser = null
  this.selectUser = function (user) {
    if (this.store.selectedUser === user) {
      this.store.selectedUser = null
    } else {
      this.store.selectedUser = user
    }
  }
  this.toggleCreateUserForm = function () {
    this.store.isNewUser = !this.store.isNewUser
  }
})

app.controller(
  'UserDetailController',
  function (UserService, store, ActiveStatusState) {
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
  }
)

app.directive('uniqueUsername', [
  'UserService',
  'ActiveStatusState',
  function (UserService, ActiveStatusState) {
    const users = UserService.getUsers()
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        ngModelCtrl.$parsers.push(function (viewValue) {
          if (!users) {
            return viewValue
          }

          let isUsernameUnique = true
          ActiveStatusState.errorMessage = null
          for (var i = 0; i < users.length; i++) {
            if (users[i].username === viewValue) {
              isUsernameUnique = false
              ActiveStatusState.setErrorMessage('Username already in use')
              break
            }
          }

          ngModelCtrl.$setValidity('uniqueUsername', isUsernameUnique)
          return viewValue
        })
      },
    }
  },
])

app.directive('strongPassword', [
  'ActiveStatusState',
  function (ActiveStatusState) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        ngModelCtrl.$parsers.push(function (viewValue) {
          const hasLowerCase = /[a-z]/.test(viewValue)
          const hasDigit = /\d/.test(viewValue)
          const hasMinLength = viewValue.length >= 8
          // console.log(viewValue)

          const isValid = hasLowerCase && hasDigit && hasMinLength
          ActiveStatusState.errorMessage = isValid
            ? null
            : 'min length 8. at least one number and one letter'
          ngModelCtrl.$setValidity('strongPassword', isValid)
          return viewValue
        })
      },
    }
  },
])
