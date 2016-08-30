var muzimaCoreModule = angular.module('muzimaCoreModule', ['ui.bootstrap', 'ngRoute', 'ngSanitize', 'filters', 'muzimafilters']);

muzimaCoreModule.
    config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);
        $routeProvider.
            when('/queue/:uuid', {controller: QueueCtrl, templateUrl: '../../moduleResources/muzimacore/partials/queue.html'}).
            when('/queues', {controller: QueuesCtrl, templateUrl: '../../moduleResources/muzimacore/partials/queues.html'}).
            when('/error/:uuid', {controller: ErrorCtrl, templateUrl: '../../moduleResources/muzimacore/partials/error.html'}).
            when('/errors', {controller: ErrorsCtrl, templateUrl: '../../moduleResources/muzimacore/partials/errors.html'}).
            when('/source/:uuid', {controller: SourceCtrl, templateUrl: '../../moduleResources/muzimacore/partials/source.html'}).
            when('/createSource/', {controller: SourceCtrl, templateUrl: '../../moduleResources/muzimacore/partials/source.html'}).
            when('/sources', {controller: SourcesCtrl, templateUrl: '../../moduleResources/muzimacore/partials/sources.html'}).
            when('/edit/:uuid', {controller: EditCtrl, templateUrl: '../../moduleResources/muzimacore/partials/edit.html'}).
            when('/registrations', {controller: ListRegistrationsCtrl, templateUrl: '../../moduleResources/muzimacore/partials/registrations.html'}).
            when('/registration/:uuid', {controller: ViewRegistrationCtrl, templateUrl: '../../moduleResources/muzimacore/partials/registration.html'}).
            when('/forms', {controller: FormsCtrl,  templateUrl: '../../moduleResources/muzimacore/partials/forms.html'}).
            when('/xforms', {controller: XFormsCtrl, templateUrl: '../../moduleResources/muzimacore/partials/xforms.html'}).
            when('/import/xforms', {controller: ImportCtrl, templateUrl: '../../moduleResources/muzimacore/partials/import/xforms.html'}).
            when('/update/xforms/:muzimaform_uuid',{controller: UpdateCtrl, templateUrl: '../../moduleResources/muzimacore/partials/update/xforms.html'}).
            otherwise({redirectTo: '/sources'});
    }]);

muzimaCoreModule.factory('$data', function ($http) {
    var getQueues = function (search, pageNumber, pageSize) {
        if (search === undefined) {
            // replace undefined search term with empty string
            search = '';
        }
        return $http.get("queues.json?search=" + search + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize);
    };
    var deleteQueues = function (uuidList) {
        return $http.post("queues.json", {"uuidList": uuidList});
    };
    var getQueue = function (uuid) {
        return $http.get("queue.json?uuid=" + uuid);
    };

    var getErrors = function (search, pageNumber, pageSize) {
        if (search === undefined) {
            // replace undefined search term with empty string
            search = '';
        }
        return $http.get("errors.json?search=" + search + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize);
    };
    var reQueueErrors = function (uuidList) {
        return $http.post("errors.json", {"uuidList": uuidList});
    };
    var getError = function (uuid) {
        return $http.get("error.json?uuid=" + uuid);
    };

    var getSources = function (search, pageNumber, pageSize) {
        if (search === undefined) {
            // replace undefined search term with empty string
            search = '';
        }
        return $http.get("sources.json?search=" + search + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize);
    };
    var getSource = function (uuid) {
        return $http.get("source.json?uuid=" + uuid);
    };
    var saveSource = function (uuid, name, description) {
        return $http.post("source.json", {"uuid": uuid, "name": name, "description": description});
    };
    var deleteSource = function (uuid) {
        return $http.post("source.json", {"uuid": uuid});
    };
    var getEdit = function (uuid) {
        return $http.get("edit.json?uuid=" + uuid);
    };
    var editErrors = function (formData) {
        return $http.post("edit.json",{"formData": formData});
    };
    var validateData = function (uuid, formData) {
            return $http.post("validate.json?uuid="+uuid+"&formData="+formData);
    };
    var saveEditedFormData = function (uuid, formData) {
            return $http.post("error.json?uuid="+uuid+"&formData="+formData);
    };

    return {
        getQueues: getQueues,
        getQueue: getQueue,
        deleteQueue: deleteQueues,

        getErrors: getErrors,
        getError: getError,
        reQueueErrors: reQueueErrors,

        getSources: getSources,
        getSource: getSource,
        saveSource: saveSource,
        deleteSource: deleteSource,
        saveEditedFormData : saveEditedFormData,

        getEdit: getEdit,
        editErrors: editErrors,
        validateData: validateData
    }
});

muzimaCoreModule.factory('FormService', function ($http) {

    var get = function (id) {
        return $http.get('../../ws/rest/v1/muzima/form/' + id + "?v=custom:(id,uuid,name,model,modelJson,html,tags,version,description,discriminator)");
    };
    var save = function (form) {
        return $http.post('form.form', form);
    };
    var all = function () {
        return $http.get('../../ws/rest/v1/muzima/form', {cache: false});
    };
    var getForms = function() {
        return $http.get('../../ws/rest/v1/form?v=custom:(name,uuid,version,description)');
    };
    var retire = function (form, retireReason) {
        return $http.delete('retire/' + form.id +'.form' +'?retireReason=' + retireReason);
    };

    var getDiscriminatorTypes = function() {
        return $http.get('../../module/muzimacore/discriminator.json', {cache: false});
    };

    return {
        all: all,
        get: get,
        save: save,
        getForms: getForms,
        retire: retire,
        getDiscriminatorTypes: getDiscriminatorTypes
    }
});

muzimaCoreModule.factory('XFormService', function ($http) {
    var all = function () {
        return $http.get('xforms.form');
    };

    var save = function (data) {
        return $http({url: 'xforms.form', method: 'POST', params: data});
    };

    var getDiscriminatorTypes = function() {
        return $http.get('../../module/muzimacore/discriminator.json', {cache: false});
    };

    return {
        all: all,
        save: save,
        getDiscriminatorTypes: getDiscriminatorTypes
    };
});

muzimaCoreModule.factory('TagService', function ($http) {
    var all = function () {
        return $http.get('../../ws/rest/v1/muzima/tag');
    };
    return {all: all};
});

muzimaCoreModule.factory('FileUploadService', function ($http) {
    return {
        post: function (options) {
            return $http({
                method: 'POST',
                url: options.url,
                headers: { 'Content-Type': undefined},
                transformRequest: function (data) {
                    var formData = new FormData();
                    angular.forEach(data.params, function (key, value) {
                        formData.append(value, key);
                    });
                    formData.append("file", data.file);
                    return formData;
                },
                data: {file: options.file, params: options.params}
            })
        }
    };
});

muzimaCoreModule.factory('_', function () {
    return window._;
});

muzimaCoreModule.factory('$registrations', function($http) {
    var getRegistration = function(uuid) {
        return $http.get("registration.json?uuid=" + uuid);
    };
    var getRegistrations = function(pageNumber, pageSize) {
        return $http.get("registrations.json?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
    };
    return {
        getRegistrations: getRegistrations,
        getRegistration: getRegistration
    }
});