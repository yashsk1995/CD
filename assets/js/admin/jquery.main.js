var rate_adjustment_row_html = '';

var list_key_row_html = {};
var lists_keys = ['loan_term', 'atm_term', 'tier', 'property_type', 'occupancy', 'documentation', 'purpose', 'rate_buydown', 'ysp', 'credit', 'prepay', 'states']

var sales_reps_row_html = '';

var portal_row_html = ''
var admin_asset_url = '/images/admin/uploads/';

function saveTemplateHtml(){

  if($('#rate_adjustment_tbl_row_template').length != 0){
    rate_adjustment_row_html = $('#rate_adjustment_tbl_row_template').clone().html();
  }
  
  for(var index = 0; index < lists_keys.length; index++){
    if($('#lists_' + lists_keys[index] + '_tbl_row_template').length != 0){
      list_key_row_html[lists_keys[index]] = $('#lists_' + lists_keys[index] + '_tbl_row_template').clone().html();
    }
  }

  if($('#sales_reps_tbl_row_template').length != 0){
    sales_reps_row_html = $('#sales_reps_tbl_row_template').clone().html();
  }

  if($('#home_portal_row_template').length != 0){
    portal_row_html = $('#home_portal_row_template').clone().html();
  }
}

jQuery(function() {
  saveTemplateHtml();
  initCustomForms();
  initMobileNav();
  initTag();
  initPopups();
  initTabs();
});

// content tabs init
function initTabs() {
  jQuery('ul.tabset').tabset({
    tabLinks: 'a',
    defaultTab: false
  });
};

/*
 * jQuery Tabs plugin
 */

(function($, $win) {
  'use strict';

  function Tabset($holder, options) {
    this.$holder = $holder;
    this.options = options;

    this.init();
  }

  Tabset.prototype = {
    init: function() {
      this.$tabLinks = this.$holder.find(this.options.tabLinks);

      this.setStartActiveIndex();
      this.setActiveTab();

      if (this.options.autoHeight) {
        this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
      }
    },

    setStartActiveIndex: function() {
      var $classTargets = this.getClassTarget(this.$tabLinks);
      var $activeLink = $classTargets.filter('.' + this.options.activeClass);
      var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
      var activeIndex;

      if (this.options.checkHash && $hashLink.length) {
        $activeLink = $hashLink;
      }

      activeIndex = $classTargets.index($activeLink);

      this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
    },

    setActiveTab: function() {
      var self = this;

      this.$tabLinks.each(function(i, link) {
        var $link = $(link);
        var $classTarget = self.getClassTarget($link);
        var $tab = $($link.attr(self.options.attrib));

        if (i !== self.activeTabIndex) {
          $classTarget.removeClass(self.options.activeClass);
          $tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
        } else {
          $classTarget.addClass(self.options.activeClass);
          $tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
        }

        self.attachTabLink($link, i);
      });
    },

    attachTabLink: function($link, i) {
      var self = this;

      $link.on(this.options.event + '.tabset', function(e) {
        e.preventDefault();

        if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
          self.activeTabIndex = i;
          self.switchTabs();
        }
      });
    },

    resizeHolder: function(height) {
      var self = this;

      if (height) {
        this.$tabHolder.height(height);
        setTimeout(function() {
          self.$tabHolder.addClass('transition');
        }, 10);
      } else {
        self.$tabHolder.removeClass('transition').height('');
      }
    },

    switchTabs: function() {
      var self = this;

      var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
      var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

      var $prevTab = this.getTab($prevLink);
      var $nextTab = this.getTab($nextLink);

      $prevTab.removeClass(this.options.activeClass);

      if (self.haveTabHolder()) {
        this.resizeHolder($prevTab.outerHeight());
      }

      setTimeout(function() {
        self.getClassTarget($prevLink).removeClass(self.options.activeClass);

        $prevTab.addClass(self.options.tabHiddenClass);
        $nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);

        self.getClassTarget($nextLink).addClass(self.options.activeClass);

        if (self.haveTabHolder()) {
          self.resizeHolder($nextTab.outerHeight());

          setTimeout(function() {
            self.resizeHolder();
            self.prevTabIndex = self.activeTabIndex;
          }, self.options.animSpeed);
        } else {
          self.prevTabIndex = self.activeTabIndex;
        }
      }, this.options.autoHeight ? this.options.animSpeed : 1);
    },

    getClassTarget: function($link) {
      return this.options.addToParent ? $link.parent() : $link;
    },

    getActiveTab: function() {
      return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
    },

    getTab: function($link) {
      return $($link.attr(this.options.attrib));
    },

    haveTabHolder: function() {
      return this.$tabHolder && this.$tabHolder.length;
    },

    destroy: function() {
      var self = this;

      this.$tabLinks.off('.tabset').each(function() {
        var $link = $(this);

        self.getClassTarget($link).removeClass(self.options.activeClass);
        $($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
      });

      this.$holder.removeData('Tabset');
    }
  };

  $.fn.tabset = function(options) {
    options = $.extend({
      activeClass: 'active',
      addToParent: false,
      autoHeight: false,
      checkHash: false,
      defaultTab: true,
      animSpeed: 500,
      tabLinks: 'a',
      attrib: 'href',
      event: 'click',
      tabHiddenClass: 'js-tab-hidden'
    }, options);
    options.autoHeight = options.autoHeight && $.support.opacity;

    return this.each(function() {
      var $holder = $(this);

      if (!$holder.data('Tabset')) {
        $holder.data('Tabset', new Tabset($holder, options));
      }
    });
  };
}(jQuery, jQuery(window)));


// initialize custom form elements
function initCustomForms() {
  jcf.setOptions('Select', {
    wrapNative: false,
    wrapNativeOnMobile: false,
  });
  jcf.replaceAll();
}

// mobile menu init
function initMobileNav() {
  jQuery('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener'
  });
}

//tag input
function initTag() {
  jQuery('.tagsInput').each( function() {
    block = jQuery(this);
    block.tagit();
  });
}

// popups init
function initPopups() {
  jQuery('.heading-format').contentPopup({
    mode: 'click',
    popup: '.heading-list',
    btnOpen: '.heading-text',
    openClass: 'active-drop'
  });
}


/*
 * Simple Mobile Navigation
 */
;(function($) {
  function MobileNav(options) {
    this.options = $.extend({
      container: null,
      hideOnClickOutside: false,
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener',
      menuDrop: '.nav-drop',
      toggleEvent: 'click',
      outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
    }, options);
    this.initStructure();
    this.attachEvents();
  }
  MobileNav.prototype = {
    initStructure: function() {
      this.page = $('html');
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function() {
      var self = this;

      if(activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }

      this.outsideClickHandler = function(e) {
        if(self.isOpened()) {
          var target = $(e.target);
          if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
            self.hide();
          }
        }
      };

      this.openerClickHandler = function(e) {
        e.preventDefault();
        self.toggle();
      };

      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function() {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function() {
      this.container.addClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function() {
      this.container.removeClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function() {
      if(this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function() {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    }
  };

  var activateResizeHandler = function() {
    var win = $(window),
      doc = $('html'),
      resizeClass = 'resize-active',
      flag, timer;
    var removeClassHandler = function() {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function() {
      if(!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on('resize orientationchange', resizeHandler);
  };

  $.fn.mobileNav = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function() {
      var $container = jQuery(this);
      var instance = $container.data('MobileNav');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $container.data('MobileNav', new MobileNav($.extend({
          container: this
        }, opt)));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
}(jQuery));

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.jcf = factory(jQuery);
  }
}(this, function($) {
  'use strict';

  // define version
  var version = '1.1.3';

  // private variables
  var customInstances = [];

  // default global options
  var commonOptions = {
    optionsKey: 'jcf',
    dataKey: 'jcf-instance',
    rtlClass: 'jcf-rtl',
    focusClass: 'jcf-focus',
    pressedClass: 'jcf-pressed',
    disabledClass: 'jcf-disabled',
    hiddenClass: 'jcf-hidden',
    resetAppearanceClass: 'jcf-reset-appearance',
    unselectableClass: 'jcf-unselectable'
  };

  // detect device type
  var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
    isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
  commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

  var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
  if(isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
  commonOptions.ios = isIOS;

  // create global stylesheet if custom forms are used
  var createStyleSheet = function() {
    var styleTag = $('<style>').appendTo('head'),
      styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

    // crossbrowser style handling
    var addCSSRule = function(selector, rules, index) {
      if (styleSheet.insertRule) {
        styleSheet.insertRule(selector + '{' + rules + '}', index);
      } else {
        styleSheet.addRule(selector, rules, index);
      }
    };

    // add special rules
    addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
    addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
    addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
    addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

    // detect rtl pages
    var html = $('html'), body = $('body');
    if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
      html.addClass(commonOptions.rtlClass);
    }

    // handle form reset event
    html.on('reset', function() {
      setTimeout(function() {
        api.refreshAll();
      }, 0);
    });

    // mark stylesheet as created
    commonOptions.styleSheetCreated = true;
  };

  // simplified pointer events handler
  (function() {
    var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
      touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
      eventList, eventMap = {}, eventPrefix = 'jcf-';

    // detect events to attach
    if (pointerEventsSupported) {
      eventList = {
        pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
        pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
        pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
        pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
      };
    } else {
      eventList = {
        pointerover: 'mouseover',
        pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
        pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
        pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
      };
    }

    // create event map
    $.each(eventList, function(targetEventName, fakeEventList) {
      $.each(fakeEventList.split(' '), function(index, fakeEventName) {
        eventMap[fakeEventName] = targetEventName;
      });
    });

    // jQuery event hooks
    $.each(eventList, function(eventName, eventHandlers) {
      eventHandlers = eventHandlers.split(' ');
      $.event.special[eventPrefix + eventName] = {
        setup: function() {
          var self = this;
          $.each(eventHandlers, function(index, fallbackEvent) {
            if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? {passive: false} : false);
            else self['on' + fallbackEvent] = fixEvent;
          });
        },
        teardown: function() {
          var self = this;
          $.each(eventHandlers, function(index, fallbackEvent) {
            if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? {passive: false} : false);
            else self['on' + fallbackEvent] = null;
          });
        }
      };
    });

    // check that mouse event are not simulated by mobile browsers
    var lastTouch = null;
    var mouseEventSimulated = function(e) {
      var dx = Math.abs(e.pageX - lastTouch.x),
        dy = Math.abs(e.pageY - lastTouch.y),
        rangeDistance = 25;

      if (dx <= rangeDistance && dy <= rangeDistance) {
        return true;
      }
    };

    // normalize event
    var fixEvent = function(e) {
      var origEvent = e || window.event,
        touchEventData = null,
        targetEventName = eventMap[origEvent.type];

      e = $.event.fix(origEvent);
      e.type = eventPrefix + targetEventName;

      if (origEvent.pointerType) {
        switch (origEvent.pointerType) {
          case 2: e.pointerType = 'touch'; break;
          case 3: e.pointerType = 'pen'; break;
          case 4: e.pointerType = 'mouse'; break;
          default: e.pointerType = origEvent.pointerType;
        }
      } else {
        e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
      }

      if (!e.pageX && !e.pageY) {
        touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
        e.pageX = touchEventData.pageX;
        e.pageY = touchEventData.pageY;
      }

      if (origEvent.type === 'touchend') {
        lastTouch = { x: e.pageX, y: e.pageY };
      }
      if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
        return;
      } else {
        return ($.event.dispatch || $.event.handle).call(this, e);
      }
    };
  }());

  // custom mousewheel/trackpad handler
  (function() {
    var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
      shimEventName = 'jcf-mousewheel';

    $.event.special[shimEventName] = {
      setup: function() {
        var self = this;
        $.each(wheelEvents, function(index, fallbackEvent) {
          if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
          else self['on' + fallbackEvent] = fixEvent;
        });
      },
      teardown: function() {
        var self = this;
        $.each(wheelEvents, function(index, fallbackEvent) {
          if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
          else self['on' + fallbackEvent] = null;
        });
      }
    };

    var fixEvent = function(e) {
      var origEvent = e || window.event;
      e = $.event.fix(origEvent);
      e.type = shimEventName;

      // old wheel events handler
      if ('detail'      in origEvent) { e.deltaY = -origEvent.detail;      }
      if ('wheelDelta'  in origEvent) { e.deltaY = -origEvent.wheelDelta;  }
      if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
      if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

      // modern wheel event handler
      if ('deltaY' in origEvent) {
        e.deltaY = origEvent.deltaY;
      }
      if ('deltaX' in origEvent) {
        e.deltaX = origEvent.deltaX;
      }

      // handle deltaMode for mouse wheel
      e.delta = e.deltaY || e.deltaX;
      if (origEvent.deltaMode === 1) {
        var lineHeight = 16;
        e.delta *= lineHeight;
        e.deltaY *= lineHeight;
        e.deltaX *= lineHeight;
      }

      return ($.event.dispatch || $.event.handle).call(this, e);
    };
  }());

  // extra module methods
  var moduleMixin = {
    // provide function for firing native events
    fireNativeEvent: function(elements, eventName) {
      $(elements).each(function() {
        var element = this, eventObject;
        if (element.dispatchEvent) {
          eventObject = document.createEvent('HTMLEvents');
          eventObject.initEvent(eventName, true, true);
          element.dispatchEvent(eventObject);
        } else if (document.createEventObject) {
          eventObject = document.createEventObject();
          eventObject.target = element;
          element.fireEvent('on' + eventName, eventObject);
        }
      });
    },
    // bind event handlers for module instance (functions beggining with "on")
    bindHandlers: function() {
      var self = this;
      $.each(self, function(propName, propValue) {
        if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
          // dont use $.proxy here because it doesn't create unique handler
          self[propName] = function() {
            return propValue.apply(self, arguments);
          };
        }
      });
    }
  };

  // public API
  var api = {
    version: version,
    modules: {},
    getOptions: function() {
      return $.extend({}, commonOptions);
    },
    setOptions: function(moduleName, moduleOptions) {
      if (arguments.length > 1) {
        // set module options
        if (this.modules[moduleName]) {
          $.extend(this.modules[moduleName].prototype.options, moduleOptions);
        }
      } else {
        // set common options
        $.extend(commonOptions, moduleName);
      }
    },
    addModule: function(proto) {
      // add module to list
      var Module = function(options) {
        // save instance to collection
        if (!options.element.data(commonOptions.dataKey)) {
          options.element.data(commonOptions.dataKey, this);
        }
        customInstances.push(this);

        // save options
        this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

        // bind event handlers to instance
        this.bindHandlers();

        // call constructor
        this.init.apply(this, arguments);
      };

      // parse options from HTML attribute
      var getInlineOptions = function(element) {
        var dataOptions = element.data(commonOptions.optionsKey),
          attrOptions = element.attr(commonOptions.optionsKey);

        if (dataOptions) {
          return dataOptions;
        } else if (attrOptions) {
          try {
            return $.parseJSON(attrOptions);
          } catch (e) {
            // ignore invalid attributes
          }
        }
      };

      // set proto as prototype for new module
      Module.prototype = proto;

      // add mixin methods to module proto
      $.extend(proto, moduleMixin);
      if (proto.plugins) {
        $.each(proto.plugins, function(pluginName, plugin) {
          $.extend(plugin.prototype, moduleMixin);
        });
      }

      // override destroy method
      var originalDestroy = Module.prototype.destroy;
      Module.prototype.destroy = function() {
        this.options.element.removeData(this.options.dataKey);

        for (var i = customInstances.length - 1; i >= 0; i--) {
          if (customInstances[i] === this) {
            customInstances.splice(i, 1);
            break;
          }
        }

        if (originalDestroy) {
          originalDestroy.apply(this, arguments);
        }
      };

      // save module to list
      this.modules[proto.name] = Module;
    },
    getInstance: function(element) {
      return $(element).data(commonOptions.dataKey);
    },
    replace: function(elements, moduleName, customOptions) {
      var self = this,
        instance;

      if (!commonOptions.styleSheetCreated) {
        createStyleSheet();
      }

      $(elements).each(function() {
        var moduleOptions,
          element = $(this);

        instance = element.data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        } else {
          if (!moduleName) {
            $.each(self.modules, function(currentModuleName, module) {
              if (module.prototype.matchElement.call(module.prototype, element)) {
                moduleName = currentModuleName;
                return false;
              }
            });
          }
          if (moduleName) {
            moduleOptions = $.extend({ element: element }, customOptions);
            instance = new self.modules[moduleName](moduleOptions);
          }
        }
      });
      return instance;
    },
    refresh: function(elements) {
      $(elements).each(function() {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        }
      });
    },
    destroy: function(elements) {
      $(elements).each(function() {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.destroy();
        }
      });
    },
    replaceAll: function(context) {
      var self = this;
      $.each(this.modules, function(moduleName, module) {
        $(module.prototype.selector, context).each(function() {
          if (this.className.indexOf('jcf-ignore') < 0) {
            self.replace(this, moduleName);
          }
        });
      });
    },
    refreshAll: function(context) {
      if (context) {
        $.each(this.modules, function(moduleName, module) {
          $(module.prototype.selector, context).each(function() {
            var instance = $(this).data(commonOptions.dataKey);
            if (instance) {
              instance.refresh();
            }
          });
        });
      } else {
        for (var i = customInstances.length - 1; i >= 0; i--) {
          customInstances[i].refresh();
        }
      }
    },
    destroyAll: function(context) {
      if (context) {
        $.each(this.modules, function(moduleName, module) {
          $(module.prototype.selector, context).each(function(index, element) {
            var instance = $(element).data(commonOptions.dataKey);
            if (instance) {
              instance.destroy();
            }
          });
        });
      } else {
        while (customInstances.length) {
          customInstances[0].destroy();
        }
      }
    }
  };

  // always export API to the global window object
  window.jcf = api;

  return api;
}));

 /*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($, window) {
  'use strict';

  jcf.addModule({
    name: 'Select',
    selector: 'select',
    options: {
      element: null,
      multipleCompactStyle: false
    },
    plugins: {
      ListBox: ListBox,
      ComboBox: ComboBox,
      SelectList: SelectList
    },
    matchElement: function(element) {
      return element.is('select');
    },
    init: function() {
      this.element = $(this.options.element);
      this.createInstance();
    },
    isListBox: function() {
      return this.element.is('[size]:not([jcf-size]), [multiple]');
    },
    createInstance: function() {
      if (this.instance) {
        this.instance.destroy();
      }
      if (this.isListBox() && !this.options.multipleCompactStyle) {
        this.instance = new ListBox(this.options);
      } else {
        this.instance = new ComboBox(this.options);
      }
    },
    refresh: function() {
      var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
                (!this.isListBox() && this.instance instanceof ListBox);

      if (typeMismatch) {
        this.createInstance();
      } else {
        this.instance.refresh();
      }
    },
    destroy: function() {
      this.instance.destroy();
    }
  });

  // combobox module
  function ComboBox(options) {
    this.options = $.extend({
      wrapNative: true,
      wrapNativeOnMobile: true,
      fakeDropInBody: true,
      useCustomScroll: true,
      flipDropToFit: true,
      maxVisibleItems: 10,
      fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
      fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
      optionClassPrefix: 'jcf-option-',
      selectClassPrefix: 'jcf-select-',
      dropContentSelector: '.jcf-select-drop-content',
      selectTextSelector: '.jcf-select-text',
      dropActiveClass: 'jcf-drop-active',
      flipDropClass: 'jcf-drop-flipped'
    }, options);
    this.init();
  }
  $.extend(ComboBox.prototype, {
    init: function() {
      this.initStructure();
      this.bindHandlers();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function() {
      // prepare structure
      this.win = $(window);
      this.doc = $(document);
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
      this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
      this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
      makeUnselectable(this.fakeElement);

      // copy classes from original select
      this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

      // handle compact multiple style
      if (this.realElement.prop('multiple')) {
        this.fakeElement.addClass('jcf-compact-multiple');
      }

      // detect device type and dropdown behavior
      if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
        this.options.wrapNative = true;
      }

      if (this.options.wrapNative) {
        // wrap native select inside fake block
        this.realElement.prependTo(this.fakeElement).css({
          position: 'absolute',
          height: '100%',
          width: '100%'
        }).addClass(this.options.resetAppearanceClass);
      } else {
        // just hide native select
        this.realElement.addClass(this.options.hiddenClass);
        this.fakeElement.attr('title', this.realElement.attr('title'));
        this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
      }
    },
    attachEvents: function() {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function() {
        setTimeout(function() {
          self.refresh();
          if (self.list) {
            self.list.refresh();
            self.list.scrollToActiveOption();
          }
        }, 1);
      };

      // native dropdown event handlers
      if (this.options.wrapNative) {
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          click: this.onChange,
          keydown: this.onChange
        });
      } else {
        // custom dropdown event handlers
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          keydown: this.onKeyDown
        });
        this.fakeElement.on({
          'jcf-pointerdown': this.onSelectAreaPress
        });
      }
    },
    onKeyDown: function(e) {
      if (e.which === 13) {
        this.toggleDropdown();
      } else if (this.dropActive) {
        this.delayedRefresh();
      }
    },
    onChange: function() {
      this.refresh();
    },
    onFocus: function() {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
        this.toggleListMode(true);
        this.focusedFlag = true;
      }
    },
    onBlur: function() {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
        this.toggleListMode(false);
        this.focusedFlag = false;
      }
    },
    onResize: function() {
      if (this.dropActive) {
        this.hideDropdown();
      }
    },
    onSelectDropPress: function() {
      this.pressedFlag = true;
    },
    onSelectDropRelease: function(e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onSelectAreaPress: function(e) {
      // skip click if drop inside fake element or real select is disabled
      var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
      if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
        return;
      }

      // toggle dropdown visibility
      this.selectOpenedByEvent = e.pointerType;
      this.toggleDropdown();

      // misc handlers
      if (!this.focusedFlag) {
        if (e.pointerType === 'mouse') {
          this.realElement.focus();
        } else {
          this.onFocus(e);
        }
      }
      this.pressedFlag = true;
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
    },
    onSelectAreaRelease: function(e) {
      if (this.focusedFlag && e.pointerType === 'mouse') {
        this.realElement.focus();
      }
      this.pressedFlag = false;
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
    },
    onOutsideClick: function(e) {
      var target = $(e.target),
        clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

      if (!clickedInsideSelect) {
        this.hideDropdown();
      }
    },
    onSelect: function() {
      this.refresh();

      if (this.realElement.prop('multiple')) {
        this.repositionDropdown();
      } else {
        this.hideDropdown();
      }

      this.fireNativeEvent(this.realElement, 'change');
    },
    toggleListMode: function(state) {
      if (!this.options.wrapNative) {
        if (state) {
          // temporary change select to list to avoid appearing of native dropdown
          this.realElement.attr({
            size: 4,
            'jcf-size': ''
          });
        } else {
          // restore select from list mode to dropdown select
          if (!this.options.wrapNative) {
            this.realElement.removeAttr('size jcf-size');
          }
        }
      }
    },
    createDropdown: function() {
      // destroy previous dropdown if needed
      if (this.dropdown) {
        this.list.destroy();
        this.dropdown.remove();
      }

      // create new drop container
      this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
      this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      makeUnselectable(this.dropdown);

      // handle compact multiple style
      if (this.realElement.prop('multiple')) {
        this.dropdown.addClass('jcf-compact-multiple');
      }

      // set initial styles for dropdown in body
      if (this.options.fakeDropInBody) {
        this.dropdown.css({
          position: 'absolute',
          top: -9999
        });
      }

      // create new select list instance
      this.list = new SelectList({
        useHoverClass: true,
        handleResize: false,
        alwaysPreventMouseWheel: true,
        maxVisibleItems: this.options.maxVisibleItems,
        useCustomScroll: this.options.useCustomScroll,
        holder: this.dropdown.find(this.options.dropContentSelector),
        multipleSelectWithoutKey: this.realElement.prop('multiple'),
        element: this.realElement
      });
      $(this.list).on({
        select: this.onSelect,
        press: this.onSelectDropPress,
        release: this.onSelectDropRelease
      });
    },
    repositionDropdown: function() {
      var selectOffset = this.fakeElement.offset(),
        selectWidth = this.fakeElement.outerWidth(),
        selectHeight = this.fakeElement.outerHeight(),
        dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
        winScrollTop = this.win.scrollTop(),
        winHeight = this.win.height(),
        calcTop, calcLeft, bodyOffset, needFlipDrop = false;

      // check flip drop position
      if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
        needFlipDrop = true;
      }

      if (this.options.fakeDropInBody) {
        bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
        if (this.options.flipDropToFit && needFlipDrop) {
          // calculate flipped dropdown position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top - dropHeight - bodyOffset;
        } else {
          // calculate default drop position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top + selectHeight - bodyOffset;
        }

        // update drop styles
        this.dropdown.css({
          width: selectWidth,
          left: calcLeft,
          top: calcTop
        });
      }

      // refresh flipped class
      this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
    },
    showDropdown: function() {
      // do not show empty custom dropdown
      if (!this.realElement.prop('options').length) {
        return;
      }

      // create options list if not created
      if (!this.dropdown) {
        this.createDropdown();
      }

      // show dropdown
      this.dropActive = true;
      this.dropdown.appendTo(this.fakeDropTarget);
      this.fakeElement.addClass(this.options.dropActiveClass);
      this.refreshSelectedText();
      this.repositionDropdown();
      this.list.setScrollTop(this.savedScrollTop);
      this.list.refresh();

      // add temporary event handlers
      this.win.on('resize', this.onResize);
      this.doc.on('jcf-pointerdown', this.onOutsideClick);
    },
    hideDropdown: function() {
      if (this.dropdown) {
        this.savedScrollTop = this.list.getScrollTop();
        this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
        this.dropdown.removeClass(this.options.flipDropClass).detach();
        this.doc.off('jcf-pointerdown', this.onOutsideClick);
        this.win.off('resize', this.onResize);
        this.dropActive = false;
        if (this.selectOpenedByEvent === 'touch') {
          this.onBlur();
        }
      }
    },
    toggleDropdown: function() {
      if (this.dropActive) {
        this.hideDropdown();
      } else {
        this.showDropdown();
      }
    },
    refreshSelectedText: function() {
      // redraw selected area
      var selectedIndex = this.realElement.prop('selectedIndex'),
        selectedOption = this.realElement.prop('options')[selectedIndex],
        selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
        selectedOptionText = '',
        selectedOptionClasses,
        self = this;

      if (this.realElement.prop('multiple')) {
        $.each(this.realElement.prop('options'), function(index, option) {
          if (option.selected) {
            selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
          }
        });
        if (!selectedOptionText) {
          selectedOptionText = self.realElement.attr('placeholder') || '';
        }
        this.selectText.removeAttr('class').html(selectedOptionText);
      } else if (!selectedOption) {
        if (this.selectImage) {
          this.selectImage.hide();
        }
        this.selectText.removeAttr('class').empty();
      } else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
        selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
        this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

        if (selectedOptionImage) {
          if (!this.selectImage) {
            this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
          }
          this.selectImage.attr('src', selectedOptionImage).show();
        } else if (this.selectImage) {
          this.selectImage.hide();
        }

        this.currentSelectedText = selectedOption.innerHTML;
        this.currentSelectedImage = selectedOptionImage;
      }
    },
    refresh: function() {
      // refresh fake select visibility
      if (this.realElement.prop('style').display === 'none') {
        this.fakeElement.hide();
      } else {
        this.fakeElement.show();
      }

      // refresh selected text
      this.refreshSelectedText();

      // handle disabled state
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
    },
    destroy: function() {
      // restore structure
      if (this.options.wrapNative) {
        this.realElement.insertBefore(this.fakeElement).css({
          position: '',
          height: '',
          width: ''
        }).removeClass(this.options.resetAppearanceClass);
      } else {
        this.realElement.removeClass(this.options.hiddenClass);
        if (this.realElement.is('[jcf-size]')) {
          this.realElement.removeAttr('size jcf-size');
        }
      }

      // removing element will also remove its event handlers
      this.fakeElement.remove();

      // remove other event handlers
      this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
      this.realElement.off({
        focus: this.onFocus
      });
    }
  });

  // listbox module
  function ListBox(options) {
    this.options = $.extend({
      wrapNative: true,
      useCustomScroll: true,
      fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
      selectClassPrefix: 'jcf-select-',
      listHolder: '.jcf-list-wrapper'
    }, options);
    this.init();
  }
  $.extend(ListBox.prototype, {
    init: function() {
      this.bindHandlers();
      this.initStructure();
      this.attachEvents();
    },
    initStructure: function() {
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
      this.listHolder = this.fakeElement.find(this.options.listHolder);
      makeUnselectable(this.fakeElement);

      // copy classes from original select
      this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      this.realElement.addClass(this.options.hiddenClass);

      this.list = new SelectList({
        useCustomScroll: this.options.useCustomScroll,
        holder: this.listHolder,
        selectOnClick: false,
        element: this.realElement
      });
    },
    attachEvents: function() {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function(e) {
        if (e && e.which === 16) {
          // ignore SHIFT key
          return;
        } else {
          clearTimeout(self.refreshTimer);
          self.refreshTimer = setTimeout(function() {
            self.refresh();
            self.list.scrollToActiveOption();
          }, 1);
        }
      };

      // other event handlers
      this.realElement.on({
        focus: this.onFocus,
        click: this.delayedRefresh,
        keydown: this.delayedRefresh
      });

      // select list event handlers
      $(this.list).on({
        select: this.onSelect,
        press: this.onFakeOptionsPress,
        release: this.onFakeOptionsRelease
      });
    },
    onFakeOptionsPress: function(e, pointerEvent) {
      this.pressedFlag = true;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onFakeOptionsRelease: function(e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onSelect: function() {
      this.fireNativeEvent(this.realElement, 'change');
      this.fireNativeEvent(this.realElement, 'click');
    },
    onFocus: function() {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
        this.focusedFlag = true;
      }
    },
    onBlur: function() {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
        this.focusedFlag = false;
      }
    },
    refresh: function() {
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
      this.list.refresh();
    },
    destroy: function() {
      this.list.destroy();
      this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
      this.fakeElement.remove();
    }
  });

  // options list module
  function SelectList(options) {
    this.options = $.extend({
      holder: null,
      maxVisibleItems: 10,
      selectOnClick: true,
      useHoverClass: false,
      useCustomScroll: false,
      handleResize: true,
      multipleSelectWithoutKey: false,
      alwaysPreventMouseWheel: false,
      indexAttribute: 'data-index',
      cloneClassPrefix: 'jcf-option-',
      containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
      containerSelector: '.jcf-list-content',
      captionClass: 'jcf-optgroup-caption',
      disabledClass: 'jcf-disabled',
      optionClass: 'jcf-option',
      groupClass: 'jcf-optgroup',
      hoverClass: 'jcf-hover',
      selectedClass: 'jcf-selected',
      scrollClass: 'jcf-scroll-active'
    }, options);
    this.init();
  }
  $.extend(SelectList.prototype, {
    init: function() {
      this.initStructure();
      this.refreshSelectedClass();
      this.attachEvents();
    },
    initStructure: function() {
      this.element = $(this.options.element);
      this.indexSelector = '[' + this.options.indexAttribute + ']';
      this.container = $(this.options.containerStructure).appendTo(this.options.holder);
      this.listHolder = this.container.find(this.options.containerSelector);
      this.lastClickedIndex = this.element.prop('selectedIndex');
      this.rebuildList();
    },
    attachEvents: function() {
      this.bindHandlers();
      this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
      this.listHolder.on('jcf-pointerdown', this.onPress);

      if (this.options.useHoverClass) {
        this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
      }
    },
    onPress: function(e) {
      $(this).trigger('press', e);
      this.listHolder.on('jcf-pointerup', this.onRelease);
    },
    onRelease: function(e) {
      $(this).trigger('release', e);
      this.listHolder.off('jcf-pointerup', this.onRelease);
    },
    onHoverItem: function(e) {
      var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
      this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
    },
    onItemPress: function(e) {
      if (e.pointerType === 'touch' || this.options.selectOnClick) {
        // select option after "click"
        this.tmpListOffsetTop = this.list.offset().top;
        this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
      } else {
        // select option immediately
        this.onSelectItem(e);
      }
    },
    onItemRelease: function(e) {
      // remove event handlers and temporary data
      this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

      // simulate item selection
      if (this.tmpListOffsetTop === this.list.offset().top) {
        this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
      }
      delete this.tmpListOffsetTop;
    },
    onSelectItem: function(e) {
      var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
        pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
        range;

      // remove click event handler
      this.listHolder.off('click', this.indexSelector, this.onSelectItem);

      // ignore clicks on disabled options
      if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
        return;
      }

      if (this.element.prop('multiple')) {
        if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
          // if CTRL/CMD pressed or touch devices - toggle selected option
          this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
        } else if (e.shiftKey) {
          // if SHIFT pressed - update selection
          range = [this.lastClickedIndex, clickedIndex].sort(function(a, b) {
            return a - b;
          });
          this.realOptions.each(function(index, option) {
            option.selected = (index >= range[0] && index <= range[1]);
          });
        } else {
          // set single selected index
          this.element.prop('selectedIndex', clickedIndex);
        }
      } else {
        this.element.prop('selectedIndex', clickedIndex);
      }

      // save last clicked option
      if (!e.shiftKey) {
        this.lastClickedIndex = clickedIndex;
      }

      // refresh classes
      this.refreshSelectedClass();

      // scroll to active item in desktop browsers
      if (pointerType === 'mouse') {
        this.scrollToActiveOption();
      }

      // make callback when item selected
      $(this).trigger('select');
    },
    rebuildList: function() {
      // rebuild options
      var self = this,
        rootElement = this.element[0];

      // recursively create fake options
      this.storedSelectHTML = rootElement.innerHTML;
      this.optionIndex = 0;
      this.list = $(this.createOptionsList(rootElement));
      this.listHolder.empty().append(this.list);
      this.realOptions = this.element.find('option');
      this.fakeOptions = this.list.find(this.indexSelector);
      this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
      delete this.optionIndex;

      // detect max visible items
      var maxCount = this.options.maxVisibleItems,
        sizeValue = this.element.prop('size');
      if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
        maxCount = sizeValue;
      }

      // handle scrollbar
      var needScrollBar = this.fakeOptions.length > maxCount;
      this.container.toggleClass(this.options.scrollClass, needScrollBar);
      if (needScrollBar) {
        // change max-height
        this.listHolder.css({
          maxHeight: this.getOverflowHeight(maxCount),
          overflow: 'auto'
        });

        if (this.options.useCustomScroll && jcf.modules.Scrollable) {
          // add custom scrollbar if specified in options
          jcf.replace(this.listHolder, 'Scrollable', {
            handleResize: this.options.handleResize,
            alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
          });
          return;
        }
      }

      // disable edge wheel scrolling
      if (this.options.alwaysPreventMouseWheel) {
        this.preventWheelHandler = function(e) {
          var currentScrollTop = self.listHolder.scrollTop(),
            maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

          // check edge cases
          if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
            e.preventDefault();
          }
        };
        this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
      }
    },
    refreshSelectedClass: function() {
      var self = this,
        selectedItem,
        isMultiple = this.element.prop('multiple'),
        selectedIndex = this.element.prop('selectedIndex');

      if (isMultiple) {
        this.realOptions.each(function(index, option) {
          self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
        });
      } else {
        this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
        selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
        if (this.options.useHoverClass) {
          selectedItem.addClass(this.options.hoverClass);
        }
      }
    },
    scrollToActiveOption: function() {
      // scroll to target option
      var targetOffset = this.getActiveOptionOffset();
      if (typeof targetOffset === 'number') {
        this.listHolder.prop('scrollTop', targetOffset);
      }
    },
    getSelectedIndexRange: function() {
      var firstSelected = -1, lastSelected = -1;
      this.realOptions.each(function(index, option) {
        if (option.selected) {
          if (firstSelected < 0) {
            firstSelected = index;
          }
          lastSelected = index;
        }
      });
      return [firstSelected, lastSelected];
    },
    getChangedSelectedIndex: function() {
      var selectedIndex = this.element.prop('selectedIndex'),
        targetIndex;

      if (this.element.prop('multiple')) {
        // multiple selects handling
        if (!this.previousRange) {
          this.previousRange = [selectedIndex, selectedIndex];
        }
        this.currentRange = this.getSelectedIndexRange();
        targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
        this.previousRange = this.currentRange;
        return targetIndex;
      } else {
        // single choice selects handling
        return selectedIndex;
      }
    },
    getActiveOptionOffset: function() {
      // calc values
      var dropHeight = this.listHolder.height(),
        dropScrollTop = this.listHolder.prop('scrollTop'),
        currentIndex = this.getChangedSelectedIndex(),
        fakeOption = this.fakeOptions.eq(currentIndex),
        fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
        fakeOptionHeight = fakeOption.innerHeight();

      // scroll list
      if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
        // scroll down (always scroll to option)
        return fakeOptionOffset - dropHeight + fakeOptionHeight;
      } else if (fakeOptionOffset < dropScrollTop) {
        // scroll up to option
        return fakeOptionOffset;
      }
    },
    getOverflowHeight: function(sizeValue) {
      var item = this.fakeListItems.eq(sizeValue - 1),
        listOffset = this.list.offset().top,
        itemOffset = item.offset().top,
        itemHeight = item.innerHeight();

      return itemOffset + itemHeight - listOffset;
    },
    getScrollTop: function() {
      return this.listHolder.scrollTop();
    },
    setScrollTop: function(value) {
      this.listHolder.scrollTop(value);
    },
    createOption: function(option) {
      var newOption = document.createElement('span');
      newOption.className = this.options.optionClass;
      newOption.innerHTML = option.innerHTML;
      newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

      var optionImage, optionImageSrc = option.getAttribute('data-image');
      if (optionImageSrc) {
        optionImage = document.createElement('img');
        optionImage.src = optionImageSrc;
        newOption.insertBefore(optionImage, newOption.childNodes[0]);
      }
      if (option.disabled) {
        newOption.className += ' ' + this.options.disabledClass;
      }
      if (option.className) {
        newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
      }
      return newOption;
    },
    createOptGroup: function(optgroup) {
      var optGroupContainer = document.createElement('span'),
        optGroupName = optgroup.getAttribute('label'),
        optGroupCaption, optGroupList;

      // create caption
      optGroupCaption = document.createElement('span');
      optGroupCaption.className = this.options.captionClass;
      optGroupCaption.innerHTML = optGroupName;
      optGroupContainer.appendChild(optGroupCaption);

      // create list of options
      if (optgroup.children.length) {
        optGroupList = this.createOptionsList(optgroup);
        optGroupContainer.appendChild(optGroupList);
      }

      optGroupContainer.className = this.options.groupClass;
      return optGroupContainer;
    },
    createOptionContainer: function() {
      var optionContainer = document.createElement('li');
      return optionContainer;
    },
    createOptionsList: function(container) {
      var self = this,
        list = document.createElement('ul');

      $.each(container.children, function(index, currentNode) {
        var item = self.createOptionContainer(currentNode),
          newNode;

        switch (currentNode.tagName.toLowerCase()) {
          case 'option': newNode = self.createOption(currentNode); break;
          case 'optgroup': newNode = self.createOptGroup(currentNode); break;
        }
        list.appendChild(item).appendChild(newNode);
      });
      return list;
    },
    refresh: function() {
      // check for select innerHTML changes
      if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
        this.rebuildList();
      }

      // refresh custom scrollbar
      var scrollInstance = jcf.getInstance(this.listHolder);
      if (scrollInstance) {
        scrollInstance.refresh();
      }

      // refresh selectes classes
      this.refreshSelectedClass();
    },
    destroy: function() {
      this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
      this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
      this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
      this.listHolder.off('jcf-pointerdown', this.onPress);
    }
  });

  // helper functions
  var getPrefixedClasses = function(className, prefixToAdd) {
    return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
  };
  var makeUnselectable = (function() {
    var unselectableClass = jcf.getOptions().unselectableClass;
    function preventHandler(e) {
      e.preventDefault();
    }
    return function(node) {
      node.addClass(unselectableClass).on('selectstart', preventHandler);
    };
  }());

}(jQuery, this));


 /*!
 * JavaScript Custom Forms : Checkbox Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($) {
  'use strict';

  jcf.addModule({
    name: 'Checkbox',
    selector: 'input[type="checkbox"]',
    options: {
      wrapNative: true,
      checkedClass: 'jcf-checked',
      uncheckedClass: 'jcf-unchecked',
      labelActiveClass: 'jcf-label-active',
      fakeStructure: '<span class="jcf-checkbox"><span></span></span>'
    },
    matchElement: function(element) {
      return element.is(':checkbox');
    },
    init: function() {
      this.initStructure();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function() {
      // prepare structure
      this.doc = $(document);
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
      this.labelElement = this.getLabelFor();

      if (this.options.wrapNative) {
        // wrap native checkbox inside fake block
        this.realElement.appendTo(this.fakeElement).css({
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: 0,
          margin: 0
        });
      } else {
        // just hide native checkbox
        this.realElement.addClass(this.options.hiddenClass);
      }
    },
    attachEvents: function() {
      // add event handlers
      this.realElement.on({
        focus: this.onFocus,
        click: this.onRealClick
      });
      this.fakeElement.on('click', this.onFakeClick);
      this.fakeElement.on('jcf-pointerdown', this.onPress);
    },
    onRealClick: function(e) {
      // just redraw fake element (setTimeout handles click that might be prevented)
      var self = this;
      this.savedEventObject = e;
      setTimeout(function() {
        self.refresh();
      }, 0);
    },
    onFakeClick: function(e) {
      // skip event if clicked on real element inside wrapper
      if (this.options.wrapNative && this.realElement.is(e.target)) {
        return;
      }

      // toggle checked class
      if (!this.realElement.is(':disabled')) {
        delete this.savedEventObject;
        this.stateChecked = this.realElement.prop('checked');
        this.realElement.prop('checked', !this.stateChecked);
        this.fireNativeEvent(this.realElement, 'click');
        if (this.savedEventObject && this.savedEventObject.isDefaultPrevented()) {
          this.realElement.prop('checked', this.stateChecked);
        } else {
          this.fireNativeEvent(this.realElement, 'change');
        }
        delete this.savedEventObject;
      }
    },
    onFocus: function() {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.focusedFlag = true;
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
      }
    },
    onBlur: function() {
      if (!this.pressedFlag) {
        this.focusedFlag = false;
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
      }
    },
    onPress: function(e) {
      if (!this.focusedFlag && e.pointerType === 'mouse') {
        this.realElement.focus();
      }
      this.pressedFlag = true;
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on('jcf-pointerup', this.onRelease);
    },
    onRelease: function(e) {
      if (this.focusedFlag && e.pointerType === 'mouse') {
        this.realElement.focus();
      }
      this.pressedFlag = false;
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off('jcf-pointerup', this.onRelease);
    },
    getLabelFor: function() {
      var parentLabel = this.realElement.closest('label'),
        elementId = this.realElement.prop('id');

      if (!parentLabel.length && elementId) {
        parentLabel = $('label[for="' + elementId + '"]');
      }
      return parentLabel.length ? parentLabel : null;
    },
    refresh: function() {
      // redraw custom checkbox
      var isChecked = this.realElement.is(':checked'),
        isDisabled = this.realElement.is(':disabled');

      this.fakeElement.toggleClass(this.options.checkedClass, isChecked)
              .toggleClass(this.options.uncheckedClass, !isChecked)
              .toggleClass(this.options.disabledClass, isDisabled);

      if (this.labelElement) {
        this.labelElement.toggleClass(this.options.labelActiveClass, isChecked);
      }
    },
    destroy: function() {
      // restore structure
      if (this.options.wrapNative) {
        this.realElement.insertBefore(this.fakeElement).css({
          position: '',
          width: '',
          height: '',
          opacity: '',
          margin: ''
        });
      } else {
        this.realElement.removeClass(this.options.hiddenClass);
      }

      // removing element will also remove its event handlers
      this.fakeElement.off('jcf-pointerdown', this.onPress);
      this.fakeElement.remove();

      // remove other event handlers
      this.doc.off('jcf-pointerup', this.onRelease);
      this.realElement.off({
        focus: this.onFocus,
        click: this.onRealClick
      });
    }
  });

}(jQuery));


 /*!
 * JavaScript Custom Forms : File Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($) {
  'use strict';

  jcf.addModule({
    name: 'File',
    selector: 'input[type="file"]',
    options: {
      fakeStructure: '<span class="jcf-file"><span class="jcf-fake-input"></span><span class="jcf-upload-button"><span class="jcf-button-content"></span></span></span>',
      buttonText: 'Choose file',
      placeholderText: 'No file chosen',
      realElementClass: 'jcf-real-element',
      extensionPrefixClass: 'jcf-extension-',
      selectedFileBlock: '.jcf-fake-input',
      buttonTextBlock: '.jcf-button-content'
    },
    matchElement: function(element) {
      return element.is('input[type="file"]');
    },
    init: function() {
      this.initStructure();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function() {
      this.doc = $(document);
      this.realElement = $(this.options.element).addClass(this.options.realElementClass);
      this.fakeElement = $(this.options.fakeStructure).insertBefore(this.realElement);
      this.fileNameBlock = this.fakeElement.find(this.options.selectedFileBlock);
      this.buttonTextBlock = this.fakeElement.find(this.options.buttonTextBlock).text(this.options.buttonText);

      this.realElement.appendTo(this.fakeElement).css({
        position: 'absolute',
        opacity: 0
      });
    },
    attachEvents: function() {
      this.realElement.on({
        'jcf-pointerdown': this.onPress,
        change: this.onChange,
        focus: this.onFocus
      });
    },
    onChange: function() {
      this.refresh();
    },
    onFocus: function() {
      this.fakeElement.addClass(this.options.focusClass);
      this.realElement.on('blur', this.onBlur);
    },
    onBlur: function() {
      this.fakeElement.removeClass(this.options.focusClass);
      this.realElement.off('blur', this.onBlur);
    },
    onPress: function() {
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on('jcf-pointerup', this.onRelease);
    },
    onRelease: function() {
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off('jcf-pointerup', this.onRelease);
    },
    getFileName: function() {
      var resultFileName = '',
        files = this.realElement.prop('files');

      if (files && files.length) {
        $.each(files, function(index, file) {
          resultFileName += (index > 0 ? ', ' : '') + file.name;
        });
      } else {
        resultFileName = this.realElement.val().replace(/^[\s\S]*(?:\\|\/)([\s\S^\\\/]*)$/g, '$1');
      }

      return resultFileName;
    },
    getFileExtension: function() {
      var fileName = this.realElement.val();
      return fileName.lastIndexOf('.') < 0 ? '' : fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    },
    updateExtensionClass: function() {
      var currentExtension = this.getFileExtension(),
        currentClassList = this.fakeElement.prop('className'),
        cleanedClassList = currentClassList.replace(new RegExp('(\\s|^)' + this.options.extensionPrefixClass + '[^ ]+','gi'), '');

      this.fakeElement.prop('className', cleanedClassList);
      if (currentExtension) {
        this.fakeElement.addClass(this.options.extensionPrefixClass + currentExtension);
      }
    },
    refresh: function() {
      var selectedFileName = this.getFileName() || this.options.placeholderText;
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
      this.fileNameBlock.text(selectedFileName);
      this.updateExtensionClass();
    },
    destroy: function() {
      // reset styles and restore element position
      this.realElement.insertBefore(this.fakeElement).removeClass(this.options.realElementClass).css({
        position: '',
        opacity: ''
      });
      this.fakeElement.remove();

      // remove event handlers
      this.realElement.off({
        'jcf-pointerdown': this.onPress,
        change: this.onChange,
        focus: this.onFocus,
        blur: this.onBlur
      });
      this.doc.off('jcf-pointerup', this.onRelease);
    }
  });

}(jQuery));

/*
 * Popups plugin
 */
;(function($) {
  function ContentPopup(opt) {
    this.options = $.extend({
      holder: null,
      popup: '.popup',
      btnOpen: '.open',
      btnClose: '.close',
      openClass: 'popup-active',
      clickEvent: 'click',
      mode: 'click',
      hideOnClickLink: true,
      hideOnClickOutside: true,
      delay: 50
    }, opt);
    if (this.options.holder) {
      this.holder = $(this.options.holder);
      this.init();
    }
  }
  ContentPopup.prototype = {
    init: function() {
      this.findElements();
      this.attachEvents();
    },
    findElements: function() {
      this.popup = this.holder.find(this.options.popup);
      this.btnOpen = this.holder.find(this.options.btnOpen);
      this.btnClose = this.holder.find(this.options.btnClose);
    },
    attachEvents: function() {
      // handle popup openers
      var self = this;
      this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

      if (this.clickMode) {
        // handle click mode
        this.btnOpen.bind(self.options.clickEvent + '.popup', function(e) {
          if (self.holder.hasClass(self.options.openClass)) {
            if (self.options.hideOnClickLink) {
              self.hidePopup();
            }
          } else {
            self.showPopup();
          }
          e.preventDefault();
        });

        // prepare outside click handler
        this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
      } else {
        // handle hover mode
        var timer, delayedFunc = function(func) {
          clearTimeout(timer);
          timer = setTimeout(function() {
            func.call(self);
          }, self.options.delay);
        };
        this.btnOpen.on('mouseover.popup', function() {
          delayedFunc(self.showPopup);
        }).on('mouseout.popup', function() {
          delayedFunc(self.hidePopup);
        });
        this.popup.on('mouseover.popup', function() {
          delayedFunc(self.showPopup);
        }).on('mouseout.popup', function() {
          delayedFunc(self.hidePopup);
        });
      }

      // handle close buttons
      this.btnClose.on(self.options.clickEvent + '.popup', function(e) {
        self.hidePopup();
        e.preventDefault();
      });
    },
    outsideClickHandler: function(e) {
      // hide popup if clicked outside
      var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
      if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
        this.hidePopup();
      }
    },
    showPopup: function() {
      // reveal popup
      this.holder.addClass(this.options.openClass);
      this.popup.css({
        display: 'block'
      });

      // outside click handler
      if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
        this.outsideHandlerActive = true;
        $(document).on('click touchstart', this.outsideClickHandler);
      }
    },
    hidePopup: function() {
      // hide popup
      this.holder.removeClass(this.options.openClass);
      this.popup.css({
        display: 'none'
      });

      // outside click handler
      if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
        this.outsideHandlerActive = false;
        $(document).off('click touchstart', this.outsideClickHandler);
      }
    },
    bind: function(f, scope, forceArgs) {
      return function() {
        return f.apply(scope, forceArgs ? [forceArgs] : arguments);
      };
    },
    destroy: function() {
      this.popup.removeAttr('style');
      this.holder.removeClass(this.options.openClass);
      this.btnOpen.add(this.btnClose).add(this.popup).off('.popup');
      $(document).off('click touchstart', this.outsideClickHandler);
    }
  };

  // detect touch devices
  var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  // jQuery plugin interface
  $.fn.contentPopup = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function() {
      var $holder = jQuery(this);
      var instance = $holder.data('ContentPopup');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $holder.data('ContentPopup', new ContentPopup($.extend({
          holder: this
        }, opt)));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
}(jQuery));


(function(b){b.widget("ui.tagit",{options:{allowDuplicates:!1,caseSensitive:!0,fieldName:"tags",placeholderText:null,readOnly:!1,removeConfirmation:!1,tagLimit:null,availableTags:[],autocomplete:{},showAutocompleteOnFocus:!1,allowSpaces:!1,singleField:!1,singleFieldDelimiter:",",singleFieldNode:null,animate:!0,tabIndex:null,beforeTagAdded:null,afterTagAdded:null,beforeTagRemoved:null,afterTagRemoved:null,onTagClicked:null,onTagLimitExceeded:null,onTagAdded:null,onTagRemoved:null,tagSource:null},_create:function(){var a=
this;this.element.is("input")?(this.tagList=b("<ul></ul>").insertAfter(this.element),this.options.singleField=!0,this.options.singleFieldNode=this.element,this.element.addClass("tagit-hidden-field")):this.tagList=this.element.find("ul, ol").andSelf().last();this.tagInput=b('<input type="text" />').addClass("ui-widget-content");this.options.readOnly&&this.tagInput.attr("disabled","disabled");this.options.tabIndex&&this.tagInput.attr("tabindex",this.options.tabIndex);this.options.placeholderText&&this.tagInput.attr("placeholder",
this.options.placeholderText);this.options.autocomplete.source||(this.options.autocomplete.source=function(a,e){var d=a.term.toLowerCase(),c=b.grep(this.options.availableTags,function(a){return 0===a.toLowerCase().indexOf(d)});this.options.allowDuplicates||(c=this._subtractArray(c,this.assignedTags()));e(c)});this.options.showAutocompleteOnFocus&&(this.tagInput.focus(function(b,d){a._showAutocomplete()}),"undefined"===typeof this.options.autocomplete.minLength&&(this.options.autocomplete.minLength=
0));b.isFunction(this.options.autocomplete.source)&&(this.options.autocomplete.source=b.proxy(this.options.autocomplete.source,this));b.isFunction(this.options.tagSource)&&(this.options.tagSource=b.proxy(this.options.tagSource,this));this.tagList.addClass("tagit").addClass("ui-widget ui-widget-content ui-corner-all").append(b('<li class="tagit-new"></li>').append(this.tagInput)).click(function(d){var c=b(d.target);c.hasClass("tagit-label")?(c=c.closest(".tagit-choice"),c.hasClass("removed")||a._trigger("onTagClicked",
d,{tag:c,tagLabel:a.tagLabel(c)})):a.tagInput.focus()});var c=!1;if(this.options.singleField)if(this.options.singleFieldNode){var d=b(this.options.singleFieldNode),f=d.val().split(this.options.singleFieldDelimiter);d.val("");b.each(f,function(b,d){a.createTag(d,null,!0);c=!0})}else this.options.singleFieldNode=b('<input type="hidden" style="display:none;" value="" name="'+this.options.fieldName+'" />'),this.tagList.after(this.options.singleFieldNode);c||this.tagList.children("li").each(function(){b(this).hasClass("tagit-new")||
(a.createTag(b(this).text(),b(this).attr("class"),!0),b(this).remove())});this.tagInput.keydown(function(c){if(c.which==b.ui.keyCode.BACKSPACE&&""===a.tagInput.val()){var d=a._lastTag();!a.options.removeConfirmation||d.hasClass("remove")?a.removeTag(d):a.options.removeConfirmation&&d.addClass("remove ui-state-highlight")}else a.options.removeConfirmation&&a._lastTag().removeClass("remove ui-state-highlight");if(c.which===b.ui.keyCode.COMMA&&!1===c.shiftKey||c.which===b.ui.keyCode.ENTER||c.which==
b.ui.keyCode.TAB&&""!==a.tagInput.val()||c.which==b.ui.keyCode.SPACE&&!0!==a.options.allowSpaces&&('"'!=b.trim(a.tagInput.val()).replace(/^s*/,"").charAt(0)||'"'==b.trim(a.tagInput.val()).charAt(0)&&'"'==b.trim(a.tagInput.val()).charAt(b.trim(a.tagInput.val()).length-1)&&0!==b.trim(a.tagInput.val()).length-1))c.which===b.ui.keyCode.ENTER&&""===a.tagInput.val()||c.preventDefault(),a.options.autocomplete.autoFocus&&a.tagInput.data("autocomplete-open")||(a.tagInput.autocomplete("close"),a.createTag(a._cleanedInput()))}).blur(function(b){a.tagInput.data("autocomplete-open")||
a.createTag(a._cleanedInput())});if(this.options.availableTags||this.options.tagSource||this.options.autocomplete.source)d={select:function(b,c){a.createTag(c.item.value);return!1}},b.extend(d,this.options.autocomplete),d.source=this.options.tagSource||d.source,this.tagInput.autocomplete(d).bind("autocompleteopen.tagit",function(b,c){a.tagInput.data("autocomplete-open",!0)}).bind("autocompleteclose.tagit",function(b,c){a.tagInput.data("autocomplete-open",!1)}),this.tagInput.autocomplete("widget").addClass("tagit-autocomplete")},
destroy:function(){b.Widget.prototype.destroy.call(this);this.element.unbind(".tagit");this.tagList.unbind(".tagit");this.tagInput.removeData("autocomplete-open");this.tagList.removeClass("tagit ui-widget ui-widget-content ui-corner-all tagit-hidden-field");this.element.is("input")?(this.element.removeClass("tagit-hidden-field"),this.tagList.remove()):(this.element.children("li").each(function(){b(this).hasClass("tagit-new")?b(this).remove():(b(this).removeClass("tagit-choice ui-widget-content ui-state-default ui-state-highlight ui-corner-all remove tagit-choice-editable tagit-choice-read-only"),
b(this).text(b(this).children(".tagit-label").text()))}),this.singleFieldNode&&this.singleFieldNode.remove());return this},_cleanedInput:function(){return b.trim(this.tagInput.val().replace(/^"(.*)"$/,"$1"))},_lastTag:function(){return this.tagList.find(".tagit-choice:last:not(.removed)")},_tags:function(){return this.tagList.find(".tagit-choice:not(.removed)")},assignedTags:function(){var a=this,c=[];this.options.singleField?(c=b(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter),
""===c[0]&&(c=[])):this._tags().each(function(){c.push(a.tagLabel(this))});return c},_updateSingleTagsField:function(a){b(this.options.singleFieldNode).val(a.join(this.options.singleFieldDelimiter)).trigger("change")},_subtractArray:function(a,c){for(var d=[],f=0;f<a.length;f++)-1==b.inArray(a[f],c)&&d.push(a[f]);return d},tagLabel:function(a){return this.options.singleField?b(a).find(".tagit-label:first").text():b(a).find("input:first").val()},_showAutocomplete:function(){this.tagInput.autocomplete("search",
"")},_findTagByLabel:function(a){var c=this,d=null;this._tags().each(function(f){if(c._formatStr(a)==c._formatStr(c.tagLabel(this)))return d=b(this),!1});return d},_isNew:function(a){return!this._findTagByLabel(a)},_formatStr:function(a){return this.options.caseSensitive?a:b.trim(a.toLowerCase())},_effectExists:function(a){return Boolean(b.effects&&(b.effects[a]||b.effects.effect&&b.effects.effect[a]))},createTag:function(a,c,d){var f=this;a=b.trim(a);this.options.preprocessTag&&(a=this.options.preprocessTag(a));
if(""===a)return!1;if(!this.options.allowDuplicates&&!this._isNew(a))return a=this._findTagByLabel(a),!1!==this._trigger("onTagExists",null,{existingTag:a,duringInitialization:d})&&this._effectExists("highlight")&&a.effect("highlight"),!1;if(this.options.tagLimit&&this._tags().length>=this.options.tagLimit)return this._trigger("onTagLimitExceeded",null,{duringInitialization:d}),!1;var g=b(this.options.onTagClicked?'<a class="tagit-label"></a>':'<span class="tagit-label"></span>').text(a),e=b("<li></li>").addClass("tagit-choice ui-widget-content ui-state-default ui-corner-all").addClass(c).append(g);
this.options.readOnly?e.addClass("tagit-choice-read-only"):(e.addClass("tagit-choice-editable"),c=b("<span></span>").addClass("ui-icon ui-icon-close"),c=b('<a><span class="text-icon">\u00d7</span></a>').addClass("tagit-close").append(c).click(function(a){f.removeTag(e)}),e.append(c));this.options.singleField||(g=g.html(),e.append('<input type="hidden" value="'+g+'" name="'+this.options.fieldName+'" class="tagit-hidden-field" />'));!1!==this._trigger("beforeTagAdded",null,{tag:e,tagLabel:this.tagLabel(e),
duringInitialization:d})&&(this.options.singleField&&(g=this.assignedTags(),g.push(a),this._updateSingleTagsField(g)),this._trigger("onTagAdded",null,e),this.tagInput.val(""),this.tagInput.parent().before(e),this._trigger("afterTagAdded",null,{tag:e,tagLabel:this.tagLabel(e),duringInitialization:d}),this.options.showAutocompleteOnFocus&&!d&&setTimeout(function(){f._showAutocomplete()},0))},removeTag:function(a,c){c="undefined"===typeof c?this.options.animate:c;a=b(a);this._trigger("onTagRemoved",
null,a);if(!1!==this._trigger("beforeTagRemoved",null,{tag:a,tagLabel:this.tagLabel(a)})){if(this.options.singleField){var d=this.assignedTags(),f=this.tagLabel(a),d=b.grep(d,function(a){return a!=f});this._updateSingleTagsField(d)}if(c){a.addClass("removed");var d=this._effectExists("blind")?["blind",{direction:"horizontal"},"fast"]:["fast"],g=this;d.push(function(){a.remove();g._trigger("afterTagRemoved",null,{tag:a,tagLabel:g.tagLabel(a)})});a.fadeOut("fast").hide.apply(a,d).dequeue()}else a.remove(),
this._trigger("afterTagRemoved",null,{tag:a,tagLabel:this.tagLabel(a)})}},removeTagByLabel:function(a,b){var d=this._findTagByLabel(a);if(!d)throw"No such tag exists with the name '"+a+"'";this.removeTag(d,b)},removeAll:function(){var a=this;this._tags().each(function(b,d){a.removeTag(d,!1)})}})})(jQuery);

(function($) {

  function initPriceMatrixSection(){
    $(document).on('click', '#price_matrix_save_btn', function(){
      var data = $('#price_matrix_form').serialize();
      $.ajax({
        url: '/adminaccess/pricematrix',
        type: 'post',
        data: data,
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initPriceMatrixSection

  function initRateAdjustmentsSection(){
    $(document).on('click', '#rate_adjustment_add_btn', function(){
      $('#rate_adjustment_tbl').append(rate_adjustment_row_html);
      initCustomForms();
    })
  
    $(document).on('click', '.rate-adjustment-remove-btn', function(){
      $(this).parents('tr').remove();
    })
  
    $(document).on('click', '#rate_adjustment_save_btn', function(){
      var min_loan_rate = $('[name="min_loan_rate"]').val();
      var min_loan_amount = $('[name="min_loan_amount"]').val();
      var max_loan_amount = $('[name="max_loan_amount"]').val();
      var ysp_selected = $('[name="ysp_selected"]').val();
      var rate_buydown_selected = $('[name="rate_buydown_selected"]').val();
  
      var rate_adjustments_rows = $('#rate_adjustment_tbl tr');
      var rate_adjustments = [];
      for(var index = 0; index < rate_adjustments_rows.length; index++){
        var rate_adjustments_description = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_description"]').val();
        var rate_adjustments_conditions_ltv = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_ltv"]').val();
        var rate_adjustments_conditions_loan_amount_operation = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_loan_amount_operation"]').val();
        var rate_adjustments_conditions_loan_amount = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_loan_amount"]').val();
        var rate_adjustments_conditions_loan_term = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_loan_term"]').val();
        var rate_adjustments_conditions_atm_term = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_atm_term"]').val();
        var rate_adjustments_conditions_teir = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_teir"]').val();
        var rate_adjustments_conditions_occupancy = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_occupancy"]').val();
        var rate_adjustments_conditions_documentation = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_documentation"]').val();
        var rate_adjustments_conditions_purpose = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_purpose"]').val();
        var rate_adjustments_conditions_credit_score_operation = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_credit_score_operation"]').val();
        var rate_adjustments_conditions_credit_score = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_credit_score"]').val();
        var rate_adjustments_conditions_prepay_buydown = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_conditions_prepay_buydown"]').val();
        var rate_adjustments_rate_adjustment = $(rate_adjustments_rows[index]).find('[name="rate_adjustments_rate_adjustment"]').val();
  
        rate_adjustments.push({
          rate_adjustments_description: rate_adjustments_description,
          rate_adjustments_conditions_ltv: rate_adjustments_conditions_ltv,
          rate_adjustments_conditions_loan_amount_operation: rate_adjustments_conditions_loan_amount_operation,
          rate_adjustments_conditions_loan_amount: rate_adjustments_conditions_loan_amount,
          rate_adjustments_conditions_loan_term: rate_adjustments_conditions_loan_term,
          rate_adjustments_conditions_atm_term: rate_adjustments_conditions_atm_term,
          rate_adjustments_conditions_teir: rate_adjustments_conditions_teir,
          rate_adjustments_conditions_occupancy: rate_adjustments_conditions_occupancy,
          rate_adjustments_conditions_documentation: rate_adjustments_conditions_documentation,
          rate_adjustments_conditions_purpose: rate_adjustments_conditions_purpose,
          rate_adjustments_conditions_credit_score_operation: rate_adjustments_conditions_credit_score_operation,
          rate_adjustments_conditions_credit_score: rate_adjustments_conditions_credit_score,
          rate_adjustments_conditions_prepay_buydown: rate_adjustments_conditions_prepay_buydown,
          rate_adjustments_rate_adjustment: rate_adjustments_rate_adjustment,
        })
        
      }
      $.ajax({
        url: '/adminaccess/rateadjustments',
        type: 'post',
        data:{
          min_loan_rate: min_loan_rate,
          min_loan_amount: min_loan_amount,
          max_loan_amount: max_loan_amount,
          ysp_selected: ysp_selected,
          rate_buydown_selected: rate_buydown_selected,
          rate_adjustments: rate_adjustments
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initRateAdjustmentsSection

  function initLTVAdjustmentsSection(){
    $(document).on('click', '#ltv_adjustment_save_btn', function(){
      var data = $('#ltv_adjustments_form').serialize();
      $.ajax({
        url: '/adminaccess/ltvadjustments',
        type: 'post',
        data: data,
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initLTVAdjustmentsSection

  function initListsSection(){
    $(document).on('click', '.lists_option_add_btn', function(){
      var key = $(this).attr('key');      
      $('#lists_' + key + '_tbl').append(list_key_row_html[key]);
      initCustomForms();
    })

    $(document).on('click', '#lists_save_btn', function(){

      var lists = {};
      for(var kindex = 0; kindex < lists_keys.length; kindex++){
        var key = lists_keys[kindex];
        var table_ele = $('#lists_' + key + '_tbl');
        var trs = $(table_ele).find('tr');
        lists[key] = [];

        for(var trindex = 0; trindex < trs.length; trindex++){
          var inputs = $(trs[trindex]).find('input');
          var row_data = {};
          for(var pindex = 0; pindex < inputs.length; pindex ++){
            var val = $(inputs[pindex]).val();
            var name = $(inputs[pindex]).attr('name');
            var type = $(inputs[pindex]).attr('type');

            if(type == 'checkbox'){
              val = $(inputs[pindex]).prop('checked');
            }
            
            row_data[name] = val;
          }

          var selects = $(trs[trindex]).find('select');
          for(var pindex = 0; pindex < selects.length; pindex ++){
            var val = $(selects[pindex]).val();
            var name = $(selects[pindex]).attr('name');
            row_data[name] = val;
          }

          lists[key].push(row_data);
          
        }
      }
      
      $.ajax({
        url: '/adminaccess/lists',
        type: 'post',
        data: {
          lists: lists
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })

    $(document).on('click', '.remove-btn', function(){
      $(this).parents('tr').remove();
    })
  }
  // initListsSection

  function initSalesRepsSection(){
    $(document).on('click', '#sales_reps_add_btn', function(){
      $('#sales_reps_tbl').append(sales_reps_row_html);
      initCustomForms();
    })

    $(document).on('click', '.remove-btn', function(){
      $(this).parents('tr').remove();
    })

    $(document).on('click', '#sales_reps_save_btn', function(){
      var rows = $('#sales_reps_tbl tr');
      var data = [];
      for(var rindex = 0; rindex < rows.length; rindex++){
        var state = $(rows[rindex]).find('[name="state"]').val();
        var sales_rep = $(rows[rindex]).find('[name="sales_rep"]').val();
        var rep_email = $(rows[rindex]).find('[name="rep_email"]').val();
        var rep_phone = $(rows[rindex]).find('[name="rep_phone"]').val();

        data.push({
          state: state,
          sales_rep: sales_rep,
          rep_email: rep_email,
          rep_phone: rep_phone
        });
      }

      $.ajax({
        url: '/adminaccess/sales_reps',
        type: 'post',
        data: {
          data: data
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })

    })
  }
  // initSalesRepsSection

  function initHomeBannerSection(){
    var file_input = document.getElementById('image_file');

    function uploadFile(){
      var formData = new FormData();
      formData.append('file', file_input.files[0]);

      var img_data = null;
      var reader = new FileReader();
      reader.onload = function(e) {
        img_data = e.target.result;
      }
      reader.readAsDataURL(file_input.files[0]);
      
      $.ajax({
        url: '/adminaccess/homebanner',
        type: 'post',
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
        contentType: false,
        processData: false,
        dateType: 'json',
        success: function(response){
          if(response.success){

            var newhtml = '';
            newhtml = '<tr class="banner--active">';
            newhtml = newhtml + '<td><img class="banner__image" filename="' + admin_asset_url + response.filename + '" src="' + img_data + '"></td>';
            newhtml = newhtml + '<td><span class="table-btn btn-activity" activity="true">inactive</span><span class="table-btn btn-remove">remove</span></td>';
            newhtml = newhtml + '</tr>';

            $('#uploaded_banner_list').append(newhtml);
          }
        }
      })
    }

    file_input.addEventListener('change', () => {
      uploadFile();
    });

    $(document).on('click', '#upload_banner_btn', function(){
      file_input.click();
    })

    $(document).on('click', '.btn-activity', function(){
      if($(this).attr('activity') == 'true'){
        $(this).parents('tr').removeClass('banner--active');
        $(this).parents('tr').addClass('banner--inactive');
        $(this).attr('activity', 'false');
        $(this).html('active');
      }
      else{
        $(this).parents('tr').removeClass('banner--inactive');
        $(this).parents('tr').addClass('banner--active');
        $(this).attr('activity', 'true');
        $(this).html('inactive');
      }
    })

    $(document).on('click', '.btn-remove', function(){
      $(this).parents('tr').remove();
    })

    $(document).on('click', '#home_banner_save_btn', function(){
      var banner_rows = $('#uploaded_banner_list tr');
      var banners = [];
      for(var bindex = 0; bindex < banner_rows.length; bindex++){
        var filename = $(banner_rows[bindex]).find('.banner__image').attr('filename');
        var activity = $(banner_rows[bindex]).find('.btn-activity').attr('activity');

        banners.push({
          filename: filename,
          activity: activity
        })
      }

      $.ajax({
        url: '/adminaccess/savehomebanner',
        type: 'post',
        data: {
          banners: banners
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initHomeBannerSection

  function initHomePortalSection(){

    var portal_rows = $('.portal-item');
    for(var pindex = 0; pindex < portal_rows.length; pindex++){
      var instance = $(portal_rows[pindex]).find('[name="portal_type"]');
      if($(instance).val() == 'text'){
        $(instance).parents('.portal-item').find('.portal-item-group--value').hide();
      }
      else if($(instance).val() == 'file'){
        $(instance).parents('.portal-item').find('.portal-item-group--value').show();
        $(instance).parents('.portal-item').find('.portal-item-group--value .portal-item__title').text('Choose File');
        $(instance).parents('.portal-item').find('.portal-item-group--value [name="portal_file_upload_btn"]').show();
        $(instance).parents('.portal-item').find('.portal-item-group--value [name="portal_file_name"]').show();
        $(instance).parents('.portal-item').find('.portal-item-group--value [name="portal_link"]').hide();
      }
      else if($(instance).val() == 'link'){
        $(instance).parents('.portal-item').find('.portal-item-group--value').show();
        $(instance).parents('.portal-item').find('.portal-item-group--value .portal-item__title').text('Portal Link');
        $(instance).parents('.portal-item').find('.portal-item-group--value [name="portal_file_upload_btn"]').hide();
        $(instance).parents('.portal-item').find('.portal-item-group--value [name="portal_file_name"]').hide();
        $(instance).parents('.portal-item').find('.portal-item-group--value [name="portal_link"]').show();
      }
    }

    $(document).on('change', '.portal-item__type', function(){
      if($(this).val() == 'text'){
        $(this).parents('.portal-item').find('.portal-item-group--value').hide();
      }
      else if($(this).val() == 'file'){
        $(this).parents('.portal-item').find('.portal-item-group--value').show();
        $(this).parents('.portal-item').find('.portal-item-group--value .portal-item__title').text('Choose File');
        $(this).parents('.portal-item').find('.portal-item-group--value [name="portal_file_upload_btn"]').show();
        $(this).parents('.portal-item').find('.portal-item-group--value [name="portal_file_name"]').show();
        $(this).parents('.portal-item').find('.portal-item-group--value [name="portal_link"]').hide();
      }
      else if($(this).val() == 'link'){
        $(this).parents('.portal-item').find('.portal-item-group--value').show();
        $(this).parents('.portal-item').find('.portal-item-group--value .portal-item__title').text('Portal Link');
        $(this).parents('.portal-item').find('.portal-item-group--value [name="portal_file_upload_btn"]').hide();
        $(this).parents('.portal-item').find('.portal-item-group--value [name="portal_file_name"]').hide();
        $(this).parents('.portal-item').find('.portal-item-group--value [name="portal_link"]').show();
      }
    })

    $(document).on('click', '#home_portal_add_btn', function(){
      $('#home_portal_list').append(portal_row_html);
      initCustomForms();
      $('html,body').animate({
        scrollTop: $("#home_portal_list .portal-item:last-of-type").offset().top
      }, 'slow');
    })

    $(document).on('click', '.portal-item-btn-delete', function(){
      $(this).parents('.portal-item').remove();
    })

    $(document).on('click', '[name="portal_file_upload_btn"]', function(){
      $(this).parents('.portal-item-group').find('[type="file"]').click();
      // file_input.click();
    })

    $(document).on('change', '.portal-item-group [type="file"]', function(event){
      var formData = new FormData();
      var instance = this;
      // $(this).parents('.portal-item-group').find('[name="portal_file_name"]').text(event.target.files[0].name);
      formData.append('file', event.target.files[0]);
      // formData.append('filename', event.target.files[0].name);
      $(this).parents('.portal-item-group').find('[name="portal_file_upload_btn"]').addClass('loading');
      $.ajax({
        url: '/adminaccess/uploadPortal',
        type: 'post',
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
        contentType: false,
        processData: false,
        dateType: 'json',
        success: function(response){
          if(response.success){
            // $(instance).parents('.portal-item-group').find('[name="portal_file_name"]').attr('filename', event.target.files[0].name);
            //$(instance).parents('.portal-item-group').find('[name="portal_file_name"]').attr('filename', response.filename);
            $(instance).parents('.portal-item-group').find('[name="portal_file_name"]').text( response.filename);
          }
          else{
            $(instance).parents('.portal-item-group').find('[name="portal_file_name"]').text('upload failed');
          }
          $(instance).parents('.portal-item-group').find('[name="portal_file_upload_btn"]').removeClass('loading');
        }
      })
    })

    $(document).on('click', '#home_portal_save_btn', function(){
      var portal_rows = $('#home_portal_list .portal-item');
      var portals = [];
      var bError = false;
      for(var pindex = 0; pindex < portal_rows.length; pindex++){
        var portal_title = $(portal_rows[pindex]).find('[name="portal_title"]').val();
        var portal_type = $(portal_rows[pindex]).find('[name="portal_type"]').val();
        var portal_val = portal_title;
        if(portal_type == 'file'){
          portal_val = $(portal_rows[pindex]).find('[name="portal_file_name"]').text();
          if(portal_val == 'upload failed'){
            portal_val = '';
          }
        }
        else if(portal_type == 'link'){
          portal_val = $(portal_rows[pindex]).find('[name="portal_link"]').val();
        }

        if(portal_title == ''){
          bError = true;
          $(portal_rows[pindex]).find('[name="portal_title"]').parents('.portal-item-group').addClass('has--error');
        }
        else{
          $(portal_rows[pindex]).find('[name="portal_title"]').parents('.portal-item-group').removeClass('has--error');
        }

        if(portal_val == ''){
          bError = true;
          if(portal_type == 'file'){
            $(portal_rows[pindex]).find('[name="portal_file_name"]').parents('.portal-item-group').addClass('has--error-nofile');
          }
          else if(portal_type == 'link'){
            $(portal_rows[pindex]).find('[name="portal_link"]').parents('.portal-item-group').addClass('has--error');
          }
          
        }
        else{
          if(portal_type == 'file'){
            $(portal_rows[pindex]).find('[name="portal_file_name"]').parents('.portal-item-group').removeClass('has--error-nofile');
          }
          else if(portal_type == 'link'){
            $(portal_rows[pindex]).find('[name="portal_link"]').parents('.portal-item-group').removeClass('has--error');
          }
        }

        portals.push({
          title: portal_title,
          type: portal_type,
          val: portal_val
        })
      }

      if(bError){
        alert('Please Fill All Fields');
        return;
      }

      $.ajax({
        url: '/adminaccess/savehomeportal',
        type: 'post',
        data: {
          portals: portals
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initHomePortalSection

  function initHomeFeaturedSection(){
    $(document).on('click', '#home_featured_save_btn', function(){
      $.ajax({
        url: '/adminaccess/featureddownload',
        type: 'post',
        data: {
          title: $('[name="title"]').val(),
          desc: $('[name="desc"]').val()
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initHomeFeaturedSection

  function initHomeMortgageSection(){
    var file_input = document.getElementById('video_file');

    function uploadFile(){
      var formData = new FormData();
      formData.append('file', file_input.files[0]);

      var img_data = null;
      var reader = new FileReader();
      reader.onload = function(e) {
        img_data = e.target.result;
      }
      reader.readAsDataURL(file_input.files[0]);

      jQuery('#upload_banner_btn').addClass('loading');
      $.ajax({
        url: '/adminaccess/homemortgageinsight',
        type: 'post',
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
        contentType: false,
        processData: false,
        dateType: 'json',
        success: function(response){
          if(response.success){

            setTimeout(function(){
              var newhtml = '';
              newhtml = '<tr class="banner--active">';
              //newhtml = newhtml + '<td><video><source src="/images/admin/uploads/' + response.filename + '"></video></td>';
              newhtml = newhtml + '<td><video><source filename="' + admin_asset_url + response.filename + '" src="' + img_data + '"></video></td>';
              newhtml = newhtml + '<td><span class="table-btn btn-activity" activity="true">inactive</span><span class="table-btn btn-remove">remove</span></td>';
              newhtml = newhtml + '</tr>';

              $('#uploaded_video_list').append(newhtml);
              jQuery('#upload_banner_btn').removeClass('loading');
            }, 2000);
          }
          else{
            jQuery('#upload_banner_btn').removeClass('loading');
          }
        }
      })
    }

    file_input.addEventListener('change', () => {
      uploadFile();
    });

    $(document).on('click', '#upload_banner_btn', function(){
      file_input.click();
    })

    $(document).on('click', '.btn-activity', function(){
      if($(this).attr('activity') == 'true'){
        $(this).parents('tr').removeClass('banner--active');
        $(this).parents('tr').addClass('banner--inactive');
        $(this).attr('activity', 'false');
        $(this).html('active');
      }
      else{
        $(this).parents('tr').removeClass('banner--inactive');
        $(this).parents('tr').addClass('banner--active');
        $(this).attr('activity', 'true');
        $(this).html('inactive');
      }
    })

    $(document).on('click', '.btn-remove', function(){
      $(this).parents('tr').remove();
    })

    $(document).on('click', '#home_mortgage_save_btn', function(){
      var banner_rows = $('#uploaded_video_list tr');
      var videos = [];
      for(var bindex = 0; bindex < banner_rows.length; bindex++){
        var filename = $(banner_rows[bindex]).find('source').attr('filename');
        var activity = $(banner_rows[bindex]).find('.btn-activity').attr('activity');

        videos.push({
          filename: filename,
          activity: activity
        })
      }

      $.ajax({
        url: '/adminaccess/savehomemortgageinsight',
        type: 'post',
        data: {
          videos: videos
        },
        success: function(response){
          alert('Saved Successfully!');
        }
      })
    })
  }
  // initHomeMortgageSection

  if($('#price_matrix_section').length != 0){
    initPriceMatrixSection();
  }

  if($('#rate_adjustments_section').length != 0){
    initRateAdjustmentsSection();
  }

  if($('#ltv_adjustments_section').length != 0){
    initLTVAdjustmentsSection();
  }

  if($('#lists_section').length != 0){
    initListsSection();
  }

  if($('#sales_reps_section').length != 0){
    initSalesRepsSection();
  }

  if($('#home_banner_section').length != 0){
    initHomeBannerSection();
  }

  if($('#home_portal_section').length != 0){
    initHomePortalSection();
  }

  if($('#home_featured_section').length != 0){
    initHomeFeaturedSection();
  }

  if($('#home_mortgage_section').length != 0){
    initHomeMortgageSection();
  }
})(jQuery)