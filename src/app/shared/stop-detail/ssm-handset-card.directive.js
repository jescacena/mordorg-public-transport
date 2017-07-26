/**
  * @ngdoc directive
  * @name ssmHandsetCard
  * @description Render a handset card in the store
*/
/*global angular*/
(function() {
    'use strict';

    angular.module('simyoApp.shared')
    .directive('ssmHandsetCard', ssmHandsetCard);


      function ssmHandsetCard() {
          var directive = {
              restrict: 'EA',
              templateUrl: 'templates/shared/directives/ssm-handset-card.html',
              scope: {
                  modelHandset: '=',
                  modelHandsetIndex:'=',
                  subscriptionPayType:'=',
                  groupId:'=',
                  buyFn:'=',
                  modelMgmCheck:'=',
                  modalFn:'='
              },
              // link: linkFunc,
              controller: MyController,
              // note: This would be 'ExampleController' (the exported controller name, as string)
              // if referring to a defined controller in its separate file.
              controllerAs: 'vm',
              bindToController: true // because the scope is isolated
          };

          return directive;

          // function linkFunc(scope, el, attr, ctrl) {
          // }
      }

      MyController.$inject = ['$scope','messages', 'API_ENV',
        '$state', '$rootScope','$filter'];

      function MyController($scope, messages, API_ENV,
          $state,$rootScope,$filter) {
          // Injecting $scope just for comparison
          var vm = this;
          var originalUpfront;
          var originalDue;
          var originalInstallment;


          vm.modalTemplate='templates/store/modal-flexible-payment.html';
          vm.imgBaseUrl = $rootScope.imgBaseUrl;
          vm.radioName = "payment_type_"+ vm.groupId + "_" + vm.modelHandsetIndex;
          vm.radioIdPaymentInitial = "pt_initial_" + vm.groupId + "_" + vm.modelHandsetIndex;
          vm.radioIdPaymentOne = "pt_one_" + vm.groupId + "_" + vm.modelHandsetIndex;

          vm.message="";

          //Set original values for upfront, fee and months
          originalUpfront = vm.modelHandset.upfront;
          originalDue = vm.modelHandset.due;
          originalInstallment = vm.modelHandset.installment;


          vm.isOutlet = ($state.current.name==='store-outlet')? true : false;

          //Listen for changes in modal flexible payment
          $rootScope.$on('change-flexible-payment-handset-'+vm.modelHandset.digest, function(event, args) {
            // console.log('JES change-flexible-payment-handset-'+vm.modelHandset.digest+' args',args);
            // var handset = _.find(handsetsArray);
            //TODO make business logic for rules
            // var data = StoreService.applyFlexiblePaymentRules(args.data);

            // console.log(data);
            $rootScope.safeApply(function() {
              vm.modelHandset.upfront = (args.data.due.model > 0)? parseFloat(args.data.upfront.model): originalUpfront;
              vm.modelHandset.upfront = _.round(vm.modelHandset.upfront,2);
              vm.modelHandset.discountedUpfront = vm.modelHandset.upfront - vm.modelHandset.mgmPoints;
              vm.modelHandset.discountedUpfront = _.round(vm.modelHandset.discountedUpfront,2);
              vm.modelHandset.discountedUpfront = (vm.modelHandset.discountedUpfront < 0)? 0: vm.modelHandset.discountedUpfront;

              vm.modelHandset.installment = (args.data.due.model > 0)? parseFloat(args.data.fee.model) : originalInstallment;
              vm.modelHandset.due = (args.data.due.model > 0)? args.data.due.model : originalDue;

              vm.modelHandset.paymentType = (args.data.due.model > 0)? 'initial' : 'one';
              vm.modelHandset.flexiblePaymentSelected = true;
              var splitInstallment=$filter('splitFloat')(vm.modelHandset.installment);
              vm.modelHandset.installment_integer = splitInstallment.integer;
              vm.modelHandset.installment_decimal = splitInstallment.decimal || '00';
            });

          });


          /////


      }






})();
