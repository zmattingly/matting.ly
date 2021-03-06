(function(angular) {

    EditPostController.$inject = ['$scope', '$state', '$http', '$timeout'];
    function EditPostController ($scope, $state, $http, $timeout) {
        $scope.model = {
            header: 'Edit Post',
            post: {},
            postLoading: true,
            datePickerOpen: false,
            dateOptions: {
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            },
            dateFormats: [
                'longDate', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'
            ],
            defaultDateFormat: 'longDate',
        };

        // TinyMCE Editor Setup
        $scope.editingContent = false;
        $scope.defaultTinymceOptions.setup = function(ed) {
            ed.on('blur', function(e) {
                $scope.editingContent = false;
                $scope.$apply();
            });
        };
        $scope.$watch('editingContent', function(newVal, oldVal) {
            if (newVal == true && oldVal == false) {
                $timeout(function() {
                    tinyMCE.activeEditor.focus();
                }, 50);
            }
        });

        $scope.init = function() {
            // Give us a half-sec to check out the nifty spinner
            setTimeout(function() {
                $scope.getPost();
            }, 500)
        };

        $scope.datePickerOpen = function() {
            $scope.model.datePickerOpen = true;
        };

        $scope.getPost = function() {
            $scope.model.postLoading = true;
            $http.get('/api/posts/' + $state.params.postId)
                .success(function(data) {
                    if (!data._id) {
                        console.error("Error retrieving post " + $state.params.postId);
                        $state.go('error.404');
                    }
                    $scope.model.post = data;
                    $scope.model.post.date = new Date($scope.model.post.date);
                    $scope.model.postLoading = false;
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };

        $scope.submitEdits = function(post) {
            $http.put('/api/posts/' + post._id, post)
                .success(function(data) {
                    $scope.getPost();
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };

        $scope.deletePost = function(post) {
            $http.delete('/api/posts/' + post._id)
                .success(function(data) {
                    $state.go('admin.viewPosts')
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };
    }

    angular.module('matting-ly')
        .controller('EditPostController', EditPostController);

})(window.angular);