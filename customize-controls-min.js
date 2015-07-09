(function(a,c){var b=wp.customize;b.Setting=b.Value.extend({initialize:function(g,f,d){var e;b.Value.prototype.initialize.call(this,f,d);this.id=g;this.transport=this.transport||"refresh";this.bind(this.preview)},preview:function(){switch(this.transport){case"refresh":return this.previewer.refresh();case"postMessage":return this.previewer.send("setting",[this.id,this()])}}});b.Control=b.Class.extend({initialize:function(i,e){var g=this,d,h,f;this.params={};c.extend(this,e||{});this.id=i;this.selector="#customize-control-"+i.replace("]","").replace("[","-");this.container=c(this.selector);f=c.map(this.params.settings,function(j){return j});b.apply(b,f.concat(function(){var j;g.settings={};for(j in g.params.settings){g.settings[j]=b(g.params.settings[j])}g.setting=g.settings["default"]||null;g.ready()}));g.elements=[];d=this.container.find("[data-customize-setting-link]");h={};d.each(function(){var k=c(this),j;if(k.is(":radio")){j=k.prop("name");if(h[j]){return}h[j]=true;k=d.filter('[name="'+j+'"]')}b(k.data("customizeSettingLink"),function(m){var l=new b.Element(k);g.elements.push(l);l.sync(m);l.set(m())})})},ready:function(){},dropdownInit:function(){var f=this,e=this.container.find(".dropdown-status"),g=this.params,h=function(i){if(typeof i==="string"&&g.statuses&&g.statuses[i]){e.html(g.statuses[i]).show()}else{e.hide()}};var d=false;this.container.on("click keydown",".dropdown",function(i){if(i.type==="keydown"&&13!==i.which){return}i.preventDefault();if(!d){f.container.toggleClass("open")}if(f.container.hasClass("open")){f.container.parent().parent().find("li.library-selected").focus()}d=true;setTimeout(function(){d=false},400)});this.setting.bind(h);h(this.setting())}});b.ColorControl=b.Control.extend({ready:function(){var e=this,d=this.container.find(".color-picker-hex");d.val(e.setting()).wpColorPicker({change:function(g,f){e.setting.set(d.wpColorPicker("color"))},clear:function(){e.setting.set(false)}})}});b.UploadControl=b.Control.extend({ready:function(){var d=this;this.params.removed=this.params.removed||"";this.success=c.proxy(this.success,this);this.uploader=c.extend({container:this.container,browser:this.container.find(".upload"),dropzone:this.container.find(".upload-dropzone"),success:this.success,plupload:{},params:{}},this.uploader||{});if(d.params.extensions){d.uploader.plupload.filters=[{title:b.l10n.allowedFiles,extensions:d.params.extensions}]}if(d.params.context){d.uploader.params["post_data[context]"]=this.params.context}if(b.settings.theme.stylesheet){d.uploader.params["post_data[theme]"]=b.settings.theme.stylesheet}this.uploader=new wp.Uploader(this.uploader);this.remover=this.container.find(".remove");this.remover.on("click keydown",function(e){if(e.type==="keydown"&&13!==e.which){return}d.setting.set(d.params.removed);e.preventDefault()});this.removerVisibility=c.proxy(this.removerVisibility,this);this.setting.bind(this.removerVisibility);this.removerVisibility(this.setting.get())},success:function(d){this.setting.set(d.get("url"))},removerVisibility:function(d){this.remover.toggle(d!=this.params.removed)}});b.ImageControl=b.UploadControl.extend({ready:function(){var e=this,d;this.uploader={init:function(f){var h,g;if(this.supports.dragdrop){return}h=e.container.find(".upload-fallback");g=h.children().detach();this.browser.detach().empty().append(g);h.append(this.browser).show()}};b.UploadControl.prototype.ready.call(this);this.thumbnail=this.container.find(".preview-thumbnail img");this.thumbnailSrc=c.proxy(this.thumbnailSrc,this);this.setting.bind(this.thumbnailSrc);this.library=this.container.find(".library");this.tabs={};d=this.library.find(".library-content");this.library.children("ul").children("li").each(function(){var g=c(this),h=g.data("customizeTab"),f=d.filter('[data-customize-tab="'+h+'"]');e.tabs[h]={both:g.add(f),link:g,panel:f}});this.library.children("ul").on("click keydown","li",function(g){if(g.type==="keydown"&&13!==g.which){return}var h=c(this).data("customizeTab"),f=e.tabs[h];g.preventDefault();if(f.link.hasClass("library-selected")){return}e.selected.both.removeClass("library-selected");e.selected=f;e.selected.both.addClass("library-selected")});this.library.on("click keydown","a",function(f){if(f.type==="keydown"&&13!==f.which){return}var g=c(this).data("customizeImageValue");if(g){e.setting.set(g);f.preventDefault()}});if(this.tabs.uploaded){this.tabs.uploaded.target=this.library.find(".uploaded-target");if(!this.tabs.uploaded.panel.find(".thumbnail").length){this.tabs.uploaded.both.addClass("hidden")}}d.each(function(){var f=e.tabs[c(this).data("customizeTab")];if(!f.link.hasClass("hidden")){e.selected=f;f.both.addClass("library-selected");return false}});this.dropdownInit()},success:function(d){b.UploadControl.prototype.success.call(this,d);if(this.tabs.uploaded&&this.tabs.uploaded.target.length){this.tabs.uploaded.both.removeClass("hidden");d.element=c('<a href="#" class="thumbnail"></a>').data("customizeImageValue",d.get("url")).append('<img src="'+d.get("url")+'" />').appendTo(this.tabs.uploaded.target)}},thumbnailSrc:function(d){if(/^(https?:)?\/\//.test(d)){this.thumbnail.prop("src",d).show()}else{this.thumbnail.hide()}}});b.defaultConstructor=b.Setting;b.control=new b.Values({defaultConstructor:b.Control});b.PreviewFrame=b.Messenger.extend({sensitivity:2000,initialize:function(g,f){var e=c.Deferred(),d=this;e.promise(this);this.container=g.container;this.signature=g.signature;c.extend(g,{channel:b.PreviewFrame.uuid()});b.Messenger.prototype.initialize.call(this,g,f);this.add("previewUrl",g.previewUrl);this.query=c.extend(g.query||{},{customize_messenger_channel:this.channel()});this.run(e)},run:function(e){var d=this,f=false,g=false;if(this._ready){this.unbind("ready",this._ready)}this._ready=function(){g=true;if(f){e.resolveWith(d)}};this.bind("ready",this._ready);this.request=c.ajax(this.previewUrl(),{type:"POST",data:this.query,xhrFields:{withCredentials:true}});this.request.fail(function(){e.rejectWith(d,["request failure"])});this.request.done(function(j){var i=d.request.getResponseHeader("Location"),h=d.signature,k;if(i&&i!=d.previewUrl()){e.rejectWith(d,["redirect",i]);return}if("0"===j){d.login(e);return}if("-1"===j){e.rejectWith(d,["cheatin"]);return}k=j.lastIndexOf(h);if(-1===k||k<j.lastIndexOf("</html>")){e.rejectWith(d,["unsigned"]);return}j=j.slice(0,k)+j.slice(k+h.length);d.iframe=c("<iframe />").appendTo(d.container);d.iframe.one("load",function(){f=true;if(g){e.resolveWith(d)}else{setTimeout(function(){e.rejectWith(d,["ready timeout"])},d.sensitivity)}});d.targetWindow(d.iframe[0].contentWindow);d.targetWindow().document.open();d.targetWindow().document.write(j);d.targetWindow().document.close()})},login:function(e){var d=this,f;f=function(){e.rejectWith(d,["logged out"])};if(this.triedLogin){return f()}c.get(b.settings.url.ajax,{action:"logged-in"}).fail(f).done(function(g){var h;if("1"!==g){f()}h=c('<iframe src="'+d.previewUrl()+'" />').hide();h.appendTo(d.container);h.load(function(){d.triedLogin=true;h.remove();d.run(e)})})},destroy:function(){b.Messenger.prototype.destroy.call(this);this.request.abort();if(this.iframe){this.iframe.remove()}delete this.request;delete this.iframe;delete this.targetWindow}});(function(){var d=0;b.PreviewFrame.uuid=function(){return"preview-"+d++}}());b.Previewer=b.Messenger.extend({refreshBuffer:250,initialize:function(h,f){var d=this,g=/^https?/,e;c.extend(this,f||{});this.refresh=(function(i){var j=i.refresh,l=function(){k=null;j.call(i)},k;return function(){if(typeof k!=="number"){if(i.loading){i.abort()}else{return l()}}clearTimeout(k);k=setTimeout(l,i.refreshBuffer)}})(this);this.container=b.ensure(h.container);this.allowedUrls=h.allowedUrls;this.signature=h.signature;h.url=window.location.href;b.Messenger.prototype.initialize.call(this,h);this.add("scheme",this.origin()).link(this.origin).setter(function(j){var i=j.match(g);return i?i[0]:""});this.add("previewUrl",h.previewUrl).setter(function(j){var i;if(/\/wp-admin(\/|$)/.test(j.replace(/[#?].*$/,""))){return null}c.each([j.replace(g,d.scheme()),j],function(l,k){c.each(d.allowedUrls,function(m,n){if(0===k.indexOf(n)){i=k;return false}});if(i){return false}});return i?i:null});this.previewUrl.bind(this.refresh);this.scroll=0;this.bind("scroll",function(i){this.scroll=i});this.bind("url",this.previewUrl)},query:function(){},abort:function(){if(this.loading){this.loading.destroy();delete this.loading}},refresh:function(){var d=this;this.abort();this.loading=new b.PreviewFrame({url:this.url(),previewUrl:this.previewUrl(),query:this.query()||{},container:this.container,signature:this.signature});this.loading.done(function(){this.bind("synced",function(){if(d.preview){d.preview.destroy()}d.preview=this;delete d.loading;d.targetWindow(this.targetWindow());d.channel(this.channel());d.send("active")});this.send("sync",{scroll:d.scroll,settings:b.get()})});this.loading.fail(function(f,e){if("redirect"===f&&e){d.previewUrl(e)}if("logged out"===f){if(d.preview){d.preview.destroy();delete d.preview}d.login().done(d.refresh)}if("cheatin"===f){d.cheatin()}})},login:function(){var g=this,d,f,e;if(this._login){return this._login}d=c.Deferred();this._login=d.promise();f=new b.Messenger({channel:"login",url:b.settings.url.login});e=c('<iframe src="'+b.settings.url.login+'" />').appendTo(this.container);f.targetWindow(e[0].contentWindow);f.bind("login",function(){e.remove();f.destroy();delete g._login;d.resolve()});return this._login},cheatin:function(){c(document.body).empty().addClass("cheatin").append("<p>"+b.l10n.cheatin+"</p>")}});b.controlConstructor={color:b.ColorControl,upload:b.UploadControl,image:b.ImageControl};c(function(){b.settings=window._wpCustomizeSettings;b.l10n=window._wpCustomizeControlsL10n;if(!b.settings){return}if(!c.support.postMessage||(!c.support.cors&&b.settings.isCrossDomain)){return window.location=b.settings.url.fallback}var d=c(document.body),f=d.children(".wp-full-overlay"),h,i,g;c("#customize-controls").on("keydown",function(j){if(c(j.target).is("textarea")){return}if(13===j.which){j.preventDefault()}});i=new b.Previewer({container:"#customize-preview",form:"#customize-controls",previewUrl:b.settings.url.preview,allowedUrls:b.settings.url.allowed,signature:"WP_CUSTOMIZER_SIGNATURE"},{nonce:b.settings.nonce,query:function(){return{wp_customize:"on",theme:b.settings.theme.stylesheet,customized:JSON.stringify(b.get()),nonce:this.nonce.preview}},save:function(){var j=this,l=c.extend(this.query(),{action:"customize_save",nonce:this.nonce.save}),k=c.post(b.settings.url.ajax,l);b.trigger("save",k);d.addClass("saving");k.always(function(){d.removeClass("saving")});k.done(function(m){if("0"===m){j.preview.iframe.hide();j.login().done(function(){j.save();j.preview.iframe.show()});return}if("-1"===m){j.cheatin();return}b.trigger("saved")})}});i.bind("nonce",function(j){c.extend(this.nonce,j)});c.each(b.settings.settings,function(k,j){b.create(k,k,j.value,{transport:j.transport,previewer:i})});c.each(b.settings.controls,function(m,k){var j=b.controlConstructor[k.type]||b.Control,l;l=b.control.add(m,new j(m,{params:k,previewer:i}))});if(i.previewUrl()){i.refresh()}else{i.previewUrl(b.settings.url.home)}(function(){var l=new b.Values(),k=l.create("saved"),j=l.create("activated");l.bind("change",function(){var n=c("#save"),m=c(".back");if(!j()){n.val(b.l10n.activate).prop("disabled",false);m.text(b.l10n.cancel)}else{if(k()){n.val(b.l10n.saved).prop("disabled",true);m.text(b.l10n.close)}else{n.val(b.l10n.save).prop("disabled",false);m.text(b.l10n.cancel)}}});k(true);j(b.settings.theme.active);b.bind("change",function(){l("saved").set(false)});b.bind("saved",function(){l("saved").set(true);l("activated").set(true)});j.bind(function(m){if(m){b.trigger("activated")}});b.state=l}());c(".customize-section-title").bind("click keydown",function(k){if(k.type==="keydown"&&13!==k.which){return}var j=c(this).parents(".customize-section");if(j.hasClass("cannot-expand")){return}if("customize-section-title_tagline"===j.attr("id")){c(".wp-full-overlay-sidebar-content").scrollTop(0)}c(".customize-section").not(j).removeClass("open");j.toggleClass("open");k.preventDefault()});c("#save").click(function(j){i.save();j.preventDefault()}).keydown(function(j){if(9===j.which){return}if(13===j.which){i.save()}j.preventDefault()});c(".back").keydown(function(j){if(9===j.which){return}if(13===j.which){g.send("close")}j.preventDefault()});c(".collapse-sidebar").on("click keydown",function(j){if(j.type==="keydown"&&13!==j.which){return}f.toggleClass("collapsed").toggleClass("expanded");j.preventDefault()});g=new b.Messenger({url:b.settings.url.parent,channel:"loader"});g.bind("back",function(){c(".back").on("click.back",function(j){j.preventDefault();g.send("close")})});b.bind("saved",function(){g.send("saved")});b.bind("activated",function(){if(g.targetWindow()){g.send("activated",b.settings.url.activated)}else{if(b.settings.url.activated){window.location=b.settings.url.activated}}});g.send("ready");c.each({background_image:{controls:["background_repeat","background_position_x","background_attachment"],callback:function(j){return !!j}},show_on_front:{controls:["page_on_front","page_for_posts"],callback:function(j){return"page"===j}},header_textcolor:{controls:["header_textcolor"],callback:function(j){return"blank"!==j}}},function(j,k){b(j,function(l){c.each(k.controls,function(m,n){b.control(n,function(p){var o=function(q){p.container.toggle(k.callback(q))};o(l.get());l.bind(o)})})})});b.control("display_header_text",function(k){var j="";k.elements[0].unsync(b("header_textcolor"));k.element=new b.Element(k.container.find("input"));k.element.set("blank"!==k.setting());k.element.bind(function(l){if(!l){j=b("header_textcolor").get()}k.setting.set(l?j:"blank")});k.setting.bind(function(l){k.element.set("blank"!==l)})});b.control("header_image",function(j){j.setting.bind(function(k){if(k===j.params.removed){j.settings.data.set(false)}});j.library.on("click","a",function(k){j.settings.data.set(c(this).data("customizeHeaderImageData"))});j.uploader.success=function(l){var k;b.ImageControl.prototype.success.call(j,l);k={attachment_id:l.get("id"),url:l.get("url"),thumbnail_url:l.get("url"),height:l.get("height"),width:l.get("width")};l.element.data("customizeHeaderImageData",k);j.settings.data.set(k)}});b.trigger("ready");var e=c(".back");e.focus();setTimeout(function(){e.focus()},200)})})(wp,jQuery);