/**!
 * jPost-it 1.0
 * https://github.com/jonathanfievet/jPost-it
 *
 * Use jQuery & jQuery-ui
 * http://jquery.com/
 * http://jqueryui.com/
 *
 * Created by Jonathan Fievet 2016
 * https://github.com/jonathanfievet
 *
 */

;(function ( $, window, document, undefined ) {

	"use strict";

		
		var idPostIt, pluginName = "jPostIt";

		function jPostIt (element, config) {
			this.element = element;
			this._name = pluginName;
			this.config = config;
			this.init();
		}

		$.extend(jPostIt.prototype, {
			init: function () {
				var postIts = $(".post-it"),
					contentPostIt = $(".post-it .content_post_it"),
		        	boxPostIt = $(".post-it .box"),
		        	deletePostIt = $(".delete"),
		        	object = this;


				$(postIts).draggable({
			      handle: ".header",
			      containment: "parent",
			      stop: function() {
			        object.save(
						$(this).attr('id'),
				        $(this).find('.content_post_it').html(), 
				        $(this).data('color'),
				        $(this).css('width'),
				        $(this).offset().left, 
				        $(this).offset().top   
			        );
			      }
			    });
			    $(postIts).resizable({
			      handles: 'e, w',
			      minWidth: 160,
			      stop: function() {
			        object.save(
						$(this).attr('id'),
				        $(this).find('.content_post_it').html(), 
				        $(this).data('color'),
				        $(this).css('width'),
				        $(this).offset().left, 
				        $(this).offset().top   
			        );
			      }
			    });
			    $(contentPostIt).focusout(function() {
			      if (!$(this).parent().hasClass("saving")) {
          			object.save(
						$(this).parent().attr('id'),
						$(this).html(),
						$(this).parent().data('color'),
						$(this).css('width'),
						$(this).parent().offset().left,
						$(this).parent().offset().top
          			);
			      }
			    });
			    $(deletePostIt).click(function(e) {
			      e.stopPropagation();
			      object.destroy($(this).parent().parent().attr('id'));
			    });
			    $(boxPostIt).click(function() {
			      if ($(this).parent().parent().data("color") != $(this).data("color")) {
			        $(this).parent().parent().switchClass($(this).parent().parent().data("color"), $(this).data("color"), 5);
			        $(this).parent().parent().data("color", $(this).data("color"));
          			object.save(
						$(this).parent().parent().attr('id'),
						$(this).parent().parent().find(".content_post_it").html(), 
						$(this).parent().parent().data('color'),
						$(this).parent().parent().css('width'),
						$(this).parent().parent().offset().left,
						$(this).parent().parent().offset().top
          			);
			      }
			    });

		        $(contentPostIt).click(function(e) {
		        	e.stopPropagation();
		        });
					
			},
			create: function(options) {

				var defaults = {
					"content": "",
					"color": "yellow",
					'top': $(this.element).offset().top,
					'left': $(this.element).offset().left
				},
				options = $.extend( defaults, options ),
				object = this;

				$.ajax({
			        url: object.config.url.create,
			        type: 'POST',
			        data: $.extend(options, {"action" : "create"}),
			        success : function(object_id, statut) {
			          idPostIt = object_id;
			          $(object.element).append('<div class="post-it ' + options.color + '" data-color="' + options.color + '" id="'+ idPostIt +'"><div class="header"><div class="box yellow" data-color="yellow"></div> <div class="box green" data-color="green"></div> <div class="box blue" data-color="blue"></div> <div class="box purple" data-color="purple"></div> <div class="delete">X</div></div><div contenteditable="true" class="content_post_it">' + options.content +'</div></div>');

				      $("#" + idPostIt).css({
				        'top': options.top, 
				        'left': options.left
				      });
				      object.init();

				      $(object.element).trigger("jPostItcreated", { 
				      	"id": object_id,
				      	"action" : "create",
				      	"content": $("#"+ object_id).find('.content_post_it').html(),
				      	"color": $("#"+ object_id).data('color'),
				      	"width": $("#"+ object_id).css('width'),
				      	"top": $("#"+ object_id).offset().top,
				      	"left": $("#"+ object_id).offset().left
				      });
			        }
			    });
			},
			save : function(id, content, color, width, posX, posY) {
				var attributes = {
					"id": id,
					"action": "update",
					"content": content,
					"color": color,
					"width": width,
					'left': posX,
					'top': posY
				},
				object = this;

				$("#" + id).addClass("saving");
				$.ajax({
			        url: object.config.url.update,
			        type: 'POST',
			        data: attributes,
			        success : function(object_id, statut) {
			          $("#" + id).removeClass("saving");

			          $(object.element).trigger("jPostItupdated", { 
			          	"id": object_id,
			          	"action": "update",
				      	"content": $("#"+ object_id).find('.content_post_it').html(),
				      	"color": $("#"+ object_id).data('color'),
				      	"width": $("#"+ object_id).css('width'),
				      	"top": $("#"+ object_id).offset().top,
				      	"left": $("#"+ object_id).offset().left
			          });
			        }
			    });
			},
			destroy : function(id) {
				var attributes = {
					"id": id,
					"action": "delete"
				},
				object = this;

				$.ajax({
			        url: object.config.url.delete,
			        type: 'POST',
			        data: attributes,
			        success : function(object_id, statut) {
			          $(object.element).trigger("jPostItdeleted", { 
			          	"id": object_id,
			          	"action": "delete",
				      	"content": $("#"+ object_id).find('.content_post_it').html(),
				      	"color": $("#"+ object_id).data('color'),
				      	"width": $("#"+ object_id).css('width'),
				      	"top": $("#"+ object_id).offset().top,
				      	"left": $("#"+ object_id).offset().left
			          });
			          $("#" + id).remove();
			        }
			    });
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( method_name, options ) {
			return this.each(function() {
				// target.data(key, value) regroupe les éléments de jQuery 
				if ( !$(this).data("plugin_" + pluginName ) ) {
						var config = method_name;
						$(this).data("plugin_" + pluginName, new jPostIt( this, config) );
				}
				else {
					if (method_name == 'create') {
						$(this).data("plugin_" + pluginName).create(options);
					}
				}
			});
		};

})( jQuery, window, document );
