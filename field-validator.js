/*!
FieldValidator, a Field Validator without form for jQuery and Prototype
by Gary Aguero for crgary, 

Version 1.0.0
Full source at https://github.com/crgary/fieldValidator
Copyright (c) 2016 crgary

MIT License, https://github.com/crgary/fieldValidator/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
    var $,
        AbstractFieldValidator,
        FieldValidator,
        _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() { this.constructor = child; }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    AbstractFieldValidator = (function() {
        function AbstractFieldValidator(form_field, options) {
            this.form_field = form_field;
            this.options = options != null ? options : {};
            if (!AbstractFieldValidator.browser_is_supported()) {
                return;
            }
            this.setup();
            this.set_default_values();            
            if(!this.is_button){
                this.set_message_error();    
            }            
            this.set_up_html();
            this.register_observers();
            this.on_ready();
        }

        AbstractFieldValidator.prototype.set_message_error=function(){
            this.message_error = this.get_message_error(this.$form_field);
        };

        AbstractFieldValidator.prototype.get_message_error=function($form_field){
            return $form_field.data('message-error') != null
                ? $form_field.data('message-error')
                : AbstractFieldValidator.default_message_error;
        };        

        AbstractFieldValidator.prototype.set_default_values = function() {
            this.group_validator = this.options.group_validator != null 
                ? this.options.group_validator 
                : this.$form_field.data('group-validator') != null
                    ? this.$form_field.data('group-validator')
                    : null;
            this.is_button = this.$form_field.is('button') 
                || this.$form_field.is('a') 
                || this.$form_field.is('input:submit');

            //callbacks
            this.on_click = this.options.on_click != null ? this.options.on_click : function(){};

        };        

        AbstractFieldValidator.browser_is_supported = function() {
            if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/Android/i.test(window.navigator.userAgent)) {
                if (/Mobile/i.test(window.navigator.userAgent)) {
                    return false;
                }
            }
            if (/IEMobile/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/Windows Phone/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/BlackBerry/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/BB10/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (window.navigator.appName === "Microsoft Internet Explorer") {
                return document.documentMode >= 8;
            }
            return true;
        };

        AbstractFieldValidator.default_message_error = "Required Field";

        return AbstractFieldValidator;

    })();

    $ = jQuery;

    $.fn.extend({
        fieldValidator: function(options) {
            if (!AbstractFieldValidator.browser_is_supported()) {
                return this;
            }
            return this.each(function(input_field) {
                var $this, fieldValidator;
                $this = $(this);
                fieldValidator = $this.data('fieldValidator');
                if (options === 'destroy') {
                    if (fieldValidator instanceof FieldValidator) {
                        fieldValidator.destroy();
                    }
                    return;
                }
                if (!(fieldValidator instanceof FieldValidator)) {
                    $this.data('fieldValidator', new FieldValidator(this, options));
                }
            });
        }
    });

    FieldValidator = (function(_super) {
        __extends(FieldValidator, _super);

        function FieldValidator() {
            _ref = FieldValidator.__super__.constructor.apply(this, arguments);
            return _ref;
        }

        FieldValidator.prototype.setup = function() {
            return this.$form_field = $(this.form_field);
        };

        FieldValidator.prototype.set_up_html = function() {
            var container_classes, container_props;
            container_classes = ["validation-error-message"];
            container_props = {
                class: container_classes.join(' '),
            };

            if(this.is_button){
                var _this = this;
                var form_fields = $(this.group_validator);
                this.fields = [];
                $.each(form_fields, function(i, form_field){
                    var $form_field = $(form_field);
                    var container_error = $("<span />", container_props);
                    container_error.html('<i>' + _this.get_message_error($form_field) + '</i>');
                    $form_field.after(container_error);
                    var field = {
                        form_field: form_field,
                        $form_field: $form_field,
                        is_required: $form_field.prop('required'),
                        container_error: container_error,
                        form_field_label: _this.get_label_behavior(form_field)
                    };
                    _this.fields.push(field);
                })
            }else{
                this.container_error = $("<span />", container_props);
                this.container_error.html('<i>' + this.message_error + '</i>');

                this.$form_field.after(this.container_error);    
            }            

            return this.set_label_behavior();
        };

        FieldValidator.prototype.on_ready = function() {
            return this.$form_field.trigger("fieldValidator:ready", {
                fieldValidator: this
            });
        };

        FieldValidator.prototype.register_observers = function() {
            var _this = this;
            if(this.group_validator){
                this.$form_field.unbind('click');
                this.$form_field.bind('click.fieldValidator', function(evt) {
                    _this.field_click(evt);
                    return evt.preventDefault();
                });
            }else{
                this.$form_field.bind('focusout.fieldValidator', function(evt) {
                    _this.field_focusout(evt);
                    return evt.preventDefault();
                });
            }            
        };

        FieldValidator.prototype.field_focusout = function(evt) {
            this.validate_field();
        };

        FieldValidator.prototype.field_click = function(evt) {
            var _this = this;
            var has_errors = false;
            $.each(this.fields, function(i, field){
                if(!_this.validate_field(field)){
                    has_errors = true;
                }
            }); 
            if(!has_errors){
                this.on_click.call(this.$form_field);
            }            
        };

        FieldValidator.prototype.validate_field = function(field){
            var _$form_field = field ? field.$form_field : this.$form_field;
            var is_required = _$form_field.prop('required');
            var value = _$form_field.val();

            if(is_required && !value){
                this.set_validation_error(field);                                
                return false;
            }else{
                if(is_required && _$form_field.is('input[type=email]')){
                    var match = /([\d\w]+[\.\w\d]*)\+?([\.\w\d]*)?@([\w\d]+[\.\w\d]*)/g.test(value);
                    if(match){
                        this.clear_validation_error(field);
                        return true;
                    }else{
                        this.set_validation_error(field);    
                        return false;
                    }
                }else{
                    this.clear_validation_error(field);
                    return true;
                }                
            }
        }

        FieldValidator.prototype.set_validation_error = function(field) {
            var _$form_field = field ? field.$form_field : this.$form_field;
            var _form_field_label = field ? field.form_field_label : this.form_field_label;
            var _container_error = field ? field.container_error : this.container_error;

            $(_form_field_label).addClass('validation-error-label');
            _$form_field.addClass('validation-error');
            _container_error.show();
        };

        FieldValidator.prototype.clear_validation_error = function(field) {
            var _$form_field = field ? field.$form_field : this.$form_field;
            var _form_field_label = field ? field.form_field_label : this.form_field_label;
            var _container_error = field ? field.container_error : this.container_error;
            
            $(_form_field_label).removeClass('validation-error-label');
            _$form_field.removeClass('validation-error');
            _container_error.hide();
        };        

        FieldValidator.prototype.set_label_behavior = function() {
            this.form_field_label = this.get_label_behavior(this.form_field);
        };

        FieldValidator.prototype.get_label_behavior = function(form_field) {
            var _this = this;
            var label = $(form_field).parents("label");
            if (!label.length && form_field.id.length) {
                label = $("label[for='" + form_field.id + "']");
            }
            return label;
        };        

        FieldValidator.prototype.destroy = function() {
            if(this.is_button){
                $.each(this.fields, function(i, field){
                    field.container_error.remove();
                    field.$form_field.removeData('fieldValidator');                
                });
            }else{
                this.container_error.remove();
                this.$form_field.removeData('fieldValidator');                
            }
            return this.$form_field.removeData('fieldValidator');    
        };

        return FieldValidator;

    })(AbstractFieldValidator);

}).call(this);