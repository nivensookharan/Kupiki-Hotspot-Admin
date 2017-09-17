'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routing from './main.routes';
import moment from 'moment';

export class MainController {
  /*@ngInject*/
  constructor($http, $scope, appConfig) {
    this.$http = $http;
    this.$scope = $scope;

    this.$scope.filterServices = function(switchStatus) {
      if (switchStatus) {
        let filterByName = function(service) {
          return appConfig.servicesFilters.includes(service.name);
        };
        this.dataFiltered = this.$scope.$parent.$ctrl.data.filter(filterByName);
        this.$scope.$parent.$ctrl.services.data = this.dataFiltered;
      } else {
        this.$scope.$parent.$ctrl.services.data = this.$scope.$parent.$ctrl.data;
      }
    }
    // this.socket = socket;

    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('thing');
    // });
  }

  $onInit() {
    this.switch = false;
    this.$http.get('/api/cpu')
      .then(response => {
        this.cpu = response.data;
        this.cpu.class = "bg-info";
        if (this.cpu.percent > 60) this.cpu.class = "bg-warning";
        if (this.cpu.percent > 90) this.cpu.class = "bg-danger";
      });
    this.$http.get('/api/disk')
      .then(response => {
        this.disk = response.data;
        this.disk.class = "bg-info";
        if (this.disk.percent > 60) this.disk.class = "bg-warning";
        if (this.disk.percent > 90) this.disk.class = "bg-danger";
      });
    this.$http.get('/api/information')
      .then(response => {
        this.information = response.data;
      });
    this.$http.get('/api/memory')
      .then(response => {
        this.memory = response.data;
        this.memory.class = "bg-info";
        if (this.memory.percent > 60) this.memory.class = "bg-warning";
        if (this.memory.percent > 90) this.memory.class = "bg-danger";
      });
    this.$http.get('/api/services')
      .then(response => {
        var cellTemplateButton = "" +
          "<label class='tgl tgl-disabled' style='font-size:10px'>" +
          "<input type='checkbox' disabled ng-checked='row.entity.status'/>" +
          "<span data-on='On' data-off='Off'></span>" +
          "</label>";
        this.data = response.data;
        this.services = {
          enableSorting: true,
          data: response.data,
          columnDefs: [
            { name: "Service", field: 'name', width: '80%' },
            { name: "Status", field: 'status', cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton}
          ]
        };
        // this.switch = true;
      });
    this.$http.get('/api/uptime')
      .then(response => {
        var duration = moment.duration(parseInt(response.data), 'seconds');
        this.uptime = {
          days : duration._data.days,
          hours : duration._data.hours,
          minutes : duration._data.minutes,
        };
        this.uptime.subtitle = "";
        if (this.uptime.minutes !== 0) {
          this.uptime.title = this.uptime.minutes;
          this.uptime.unit = "min";
          this.uptime.subtitle = this.uptime.minutes+"m";
        }
        if (this.uptime.hours !== 0) {
          this.uptime.title = this.uptime.hours;
          this.uptime.unit = "hours";
          this.uptime.subtitle = this.uptime.hours+"h "+this.uptime.subtitle;
        }
        if (this.uptime.days !== 0) {
          this.uptime.title = this.uptime.days;
          this.uptime.unit = "days";
          this.uptime.subtitle = this.uptime.days+"d "+this.uptime.subtitle;
        }
        this.uptime.subtitle = "Uptime "+this.uptime.subtitle;
        this.uptime.class = "bg-info";
      });
  }

  // addThing() {
  //   if(this.newThing) {
  //     this.$http.post('/api/things', {
  //       name: this.newThing
  //     });
  //     this.newThing = '';
  //   }
  // }

  // deleteThing(thing) {
  //   this.$http.delete(`/api/things/${thing._id}`);
  // }
}

export default angular.module('kupikiHotspotAdminApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
