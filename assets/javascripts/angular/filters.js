(function (angular) {

    var trust = ['$sce', function($sce) {
        return function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }];

    var yesNo = [function() {
        return function (input) {
            return input ? 'Yes' : 'No';
        };
    }];

    var stripHtmlToPlaintext = [function() {
        return function(text) {
          return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }];

    angular.module("matting-ly")
        .filter("trust", trust)
        .filter("yesNo", yesNo)
        .filter("stripHtmlToPlaintext", stripHtmlToPlaintext)
    ;

})(window.angular);