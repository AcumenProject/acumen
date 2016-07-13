angular.module('acumen.templates', ['collection/collection.tpl.html', 'collection/explorer/explorer-fullscreen.tpl.html', 'collection/explorer/explorer.tpl.html', 'collection/explorer/item/audio/audio.tpl.html', 'collection/explorer/item/audio/item-audio.tpl.html', 'collection/explorer/item/detail/metadata/metadata-empty.tpl.html', 'collection/explorer/item/detail/metadata/metadata.tpl.html', 'collection/explorer/item/detail/tags/tags.tpl.html', 'collection/explorer/item/detail/transcripts/transcripts.tpl.html', 'collection/explorer/item/document/document.tpl.html', 'collection/explorer/item/image/image.tpl.html', 'collection/explorer/item/item.tpl.html', 'collection/explorer/item/video/video.tpl.html', 'collection/explorer/list/list.tpl.html', 'common/disclaimer/disclaimer.tpl.html', 'common/feedback/feedback.tpl.html', 'error.tpl.html', 'home.tpl.html', 'search/no-results.tpl.html', 'search/search.tpl.html', 'search_box/search-box.tpl.html']);

angular.module("collection/collection.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/collection.tpl.html",
    "<h1 ng-bind-html=title class=\"collection-title col-xs-9\"></h1><div class=\"col-xs-3 collection-menu text-right\"><div class=\"btn-group btn-group-sm\"><a ng-href={{file.file_path}} rol=button class=\"btn btn-default\" target={{file.id}} tooltip=\"View metadata source\">{{file.type | uppercase}} <span class=\"glyphicon glyphicon-eye-open\"></span></a> <button type=button class=\"btn btn-default\" disabled>Updated: {{file.last_modified | date}}</button></div></div><div ui-view id=asset_explorer class=\"explorer col-xs-12\" ng-if=acumen.asset_explorer></div><div compile id=page_metadata class=\"collection-metadata col-xs-9 col-xs-offset-1\"></div><div class=col-xs-2><div fixie-menu fixie-menu-offset=page_metadata ng-if=collapseControls><button type=button class=\"btn btn-default btn-block\" ng-click=collapseAll()><span class=\"fa fa-minus-square-o\"></span> <span class=small>Collapse All</span></button> <button type=button class=\"btn btn-default btn-block\" ng-click=expandAll()><span class=\"fa fa-plus-square-o\"></span> <span class=small>Expand All</span></button></div></div>");
}]);

angular.module("collection/explorer/explorer-fullscreen.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/explorer-fullscreen.tpl.html",
    "<div class=fullscrn><div class=\"toolbar toolbar-static toolbar-fullscreen\"><div class=\"toolset toolset-title text-center\"><h3>{{acumen.collection.title | truncate:95}}</h3></div><div class=\"toolset toolset-fullscreen-nav pull-right\"><div class=btn-group><button type=button class=\"btn btn-primary\" title=\"Back browser history\" history-button=back><span class=\"fa fa-chevron-left\"></span></button> <a ng-href=\"{{ENV_PATH}}{{acumen.collection.parent.link}}?page={{acumen.collection.toPage}}\" rol=button class=\"btn btn-primary\" title=\"Go to parent collection: &quot;{{acumen.collection.parent.title}}&quot;\" ng-if=\"acumen.collection.parent.id > 0\"><i class=\"fa fa-level-up\"></i></a> <button type=button class=\"btn btn-primary\" title=\"Forward browser history\" history-button=forward><span class=\"fa fa-chevron-right\"></span></button></div></div></div><div class=explorer fullscreen-explorer></div></div>");
}]);

angular.module("collection/explorer/explorer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/explorer.tpl.html",
    "<div class=\"toolbar toolbar-static row\"><div class=\"toolset toolset-menu\"><div class=btn-group dropdown is-open=status.isopen><div type=button class=\"tool fa fa-bars dropdown-toggle\" ng-disabled=disabled></div><ul class=dropdown-menu role=menu><li role=presentation class=dropdown-header>Thumbnail List</li><li ng-class=\"{'disabled': printDisabled}\" print-image=acumen.list.items><a href=# title=\"Icon placeholders are not printed\"><i class=\"fa fa-fw fa-print text-muted\"></i> Print List Items {{acumen.list.first}}-{{acumen.list.last}}</a></li><li class=divider></li><li role=presentation class=dropdown-header>Asset</li><li ng-class=\"{'disabled': !$state.includes('collection.explorer.item.**')}\"><a ng-href={{acumen.item.asset_path}} title=\"Download image\" target=_new download><i class=\"fa fa-fw fa-download text-muted\"></i> Download {{acumen.item.type}}</a></li><li ng-class=\"{'disabled': printDisabled || !$state.includes('collection.explorer.item.**')}\" print-image=acumen.item.asset_path><a href=# title=\"Print image\"><i class=\"fa fa-fw fa-print text-muted\"></i> Print Image</a></li></ul></div></div><div class=\"toolset toolset-title\" ng-if=\"$state.includes('collection.explorer.item.**')\"><h3>{{acumen.item.title | truncate:95}}</h3></div><div class=\"toolset pull-right\"><div class=\"tool fa fa-keyboard-o\" tooltip=\"View hot keys menu\" tooltip-popup-delay=500 ng-click=toggleHotKeys()></div><div ng-click=gridToggle() class=\"tool glyphicon glyphicon-th grid-toggle\" ng-class=\"{'selected': $state.is('collection.explorer')}\" tooltip=\"Toggle Grid View\" tooltip-popup-delay=500 title=\"Toggle Grid View\"></div><div ng-click=toggle() class=\"tool glyphicon glyphicon-fullscreen\" ng-class=\"{'selected': selected}\" tooltip=\"Fullscreen (fills browser window)\" tooltip-popup-delay=500 tooltip-placement=left fullscreen-button></div></div></div><div class=\"items-container row\"><div ui-view=list class=items-list id=items_list ng-class=$state.current.data.itemsListCss></div><div ui-view class=item-container ng-class=$state.current.data.itemContainerCss></div></div>");
}]);

angular.module("collection/explorer/item/audio/audio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/audio/audio.tpl.html",
    "<div class=item-detail-container ng-class=$state.current.data.detailContainer><div class=\"toolbar toolbar-vert\"><div class=\"toolset pull-right\"><div ng-click=closeDetail() class=\"tool glyphicon glyphicon-info-sign\" ng-class=\"{'selected': $state.is('collection.explorer.item.audio')}\" tooltip=\"About this item\" tooltip-placement=left tooltip-popup-delay=300 title=\"About this item\" ng-show=itemMetadata></div><div ng-click=\"toggleState('.transcripts')\" class=\"tool glyphicon glyphicon-file\" ng-class=\"{'selected': $state.is('collection.explorer.item.audio.transcripts')}\" tooltip=Transcript tooltip-placement=left tooltip-popup-delay=300 title=Transcript></div><div ng-click=\"toggleState('.tags')\" class=\"tool glyphicon glyphicon-tags\" ng-class=\"{'selected': $state.includes('collection.explorer.item.audio.tags')}\" tooltip=Tags tooltip-placement=left tooltip-popup-delay=300 title=Tags></div></div></div><div ui-view=detail class=detail ng-class=$state.current.data.detailCss></div></div><div class=audio-player-wrapper><div class=audio-metadata><div class=\"compile detail-metadata-container\" ng-class=$state.current.data.itemMetadataCss ng-if=metadata></div></div><audio class=asset-audio ng-src={{item.asset_path}} mediaelement=audio></audio></div>");
}]);

angular.module("collection/explorer/item/audio/item-audio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/audio/item-audio.tpl.html",
    "<div class=item-detail-container ng-class=$state.current.data.detailContainer><div class=\"toolbar toolbar-vert\"><div class=\"toolset pull-right\"><div ng-click=\"toggleState('.metadata')\" class=\"tool glyphicon glyphicon-info-sign\" ng-class=\"{'selected': $state.includes('explorer.collection.item.*.metadata')}\" tooltip=\"About this item\" tooltip-placement=left tooltip-popup-delay=300 title=\"About this item\" ng-show=metadata></div><div ng-click=\"toggleState('.transcripts')\" class=\"tool glyphicon glyphicon-file\" ng-class=\"{'selected': $state.includes('explorer.collection.item.*.transcript')}\" tooltip=Transcript tooltip-placement=left tooltip-popup-delay=300 title=Transcript></div><div ng-click=\"toggleState('.tags')\" class=\"tool glyphicon glyphicon-tags\" ng-class=\"{'selected': $state.includes('explorer.collection.item.*.tags')}\" tooltip=Tags tooltip-placement=left tooltip-popup-delay=300 title=Tags></div></div></div><div ui-view=detail class=detail ng-class=$state.current.data.detailCss></div></div><div ui-view class=\"item item-audio\" ng-class=$state.current.data.itemCss></div>");
}]);

angular.module("collection/explorer/item/detail/metadata/metadata-empty.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/detail/metadata/metadata-empty.tpl.html",
    "<div class=empty-metadata-container><div class=empty-item-icon ng-class=emptyIcon></div><h3 class=text-center>No item metadata available.</h3></div>");
}]);

angular.module("collection/explorer/item/detail/metadata/metadata.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/detail/metadata/metadata.tpl.html",
    "<div class=\"item-metadata-menu btn-group btn-group-sm\"><a ng-href={{metadata.file_path}} rol=button class=\"btn btn-default\" target={{metadata.file_name}} tooltip=\"View metadata source\">{{metadata.type | uppercase}} <span class=\"glyphicon glyphicon-eye-open\"></span></a> <button type=button class=\"btn btn-default\" disabled>Updated: {{metadata.last_modified | date}}</button></div><div class=\"compile item-metadata\"></div>");
}]);

angular.module("collection/explorer/item/detail/tags/tags.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/detail/tags/tags.tpl.html",
    "<div class=tags-container><button class=\"tag-btn btn btn-primary\" ng-click=tagSearch(tag) ng-class=tag.status ng-repeat=\"tag in tags\" ng-mouseenter=\"tagsearch = {color: '#ccc'}\" ng-mouseleave=\"tagsearch = {}\">{{tag.value}} <span class=\"glyphicon glyphicon-chevron-right\" ng-style=tagsearch></span></button></div><form rol=form class=tags-form name=tagsForm ngvalidate><input class=dis-email ng-model=input.email name=email placeholder=\"Email\"><textarea class=tags-textarea ng-model=input.tags required placeholder=\"Add tags separated by commas.\"></textarea><button class=\"btn btn-primary btn-lg btn-block\" ng-click=addTags(input) ng-disabled=tagsForm.$invalid>Add Tags</button></form>");
}]);

angular.module("collection/explorer/item/detail/transcripts/transcripts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/detail/transcripts/transcripts.tpl.html",
    "<form rol=form class=transcript-form name=transcriptForm ngvalidate><span class=\"label label-warning help-cursor\" ng-show=transcript.isOCR tooltip=\"This transcript was generated via OCR\" tooltip-placement=left>OCR</span> <input class=dis-email ng-model=transcript.email name=email placeholder=\"Email\"><textarea class=transcript-textarea placeholder=\"Type a transcription.\" ng-model=transcript.value required></textarea><button class=\"btn btn-primary btn-lg btn-block\" ng-click=addTranscript(transcript) ng-disabled=\"transcriptForm.$invalid || isUnchanged(transcript)\">Add Transcript</button></form>");
}]);

angular.module("collection/explorer/item/document/document.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/document/document.tpl.html",
    "<div class=\"row video-row\"><div class=item ng-class=$state.current.data.itemCss><iframe ng-src={{item.asset_path}} class=asset-document></iframe></div><div class=item-detail-container ng-class=$state.current.data.detailContainer><div class=\"toolbar toolbar-vert\"><div class=\"toolset pull-right\"><div ng-click=\"toggleState('.metadata')\" class=\"tool glyphicon glyphicon-info-sign\" ng-class=\"{'selected': $state.includes('collection.explorer.item.*.metadata')}\" tooltip=\"About this item\" tooltip-placement=left tooltip-popup-delay=300 title=\"About this item\" ng-if=metadata></div><div ng-click=\"toggleState('.transcripts')\" class=\"tool glyphicon glyphicon-file\" ng-class=\"{'selected': $state.includes('collection.explorer.item.*.transcript')}\" tooltip=Transcript tooltip-placement=left tooltip-popup-delay=300 title=Transcript></div><div ng-click=\"toggleState('.tags')\" class=\"tool glyphicon glyphicon-tags\" ng-class=\"{'selected': $state.includes('collection.explorer.item.*.tags')}\" tooltip=Tags tooltip-placement=left tooltip-popup-delay=300 title=Tags></div></div></div><div ui-view=detail class=detail ng-class=$state.current.data.detailCss></div></div></div>");
}]);

angular.module("collection/explorer/item/image/image.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/image/image.tpl.html",
    "<canvas id=asset_image class=asset-image ng-class=imageTools.current msd-wheel=\"mouseZoom($event, $delta)\"></canvas><div id=image_toolbar class=\"toolbar toolbar-vert\"><div class=\"toolset toolset-top\"><span class=\"tool glyphicon glyphicon-move\" ng-click=\"imageTools.select('move')\" ng-class=\"{selected: imageTools.current == 'move'}\" tooltip=\"Drag Image\" tooltip-placement=right></span> <span class=\"tool glyphicon glyphicon-repeat\" ng-click=\"imageTools.select('rotate')\" ng-class=\"{selected: imageTools.current == 'rotate'}\" tooltip=\"Drag to Rotate Image\" tooltip-placement=right></span></div><div class=\"toolset toolset-middle\"><div class=zoom-slider-wrapper zoom-tool><div class=zoom-slider></div><div class=zoom-slide-bar ng-style=\"{'top': imageTools.zoomSlider.pos}\"></div></div></div><div class=\"toolset toolset-bottom\"><span class=\"tool glyphicon glyphicon-refresh\" ng-click=reset() tooltip=\"Reset Image\" tooltip-placement=right></span></div></div><div class=item-detail-container ng-class=$state.current.data.detailContainer><div class=\"toolbar toolbar-vert\"><div class=\"toolset pull-right\"><div ng-click=\"toggleState('.metadata')\" class=\"tool glyphicon glyphicon-info-sign\" ng-class=\"{'selected': $state.includes('collection.explorer.item.*.metadata')}\" tooltip=\"About this item\" tooltip-placement=left tooltip-popup-delay=300 title=\"About this item\" ng-if=metadata></div><div ng-click=\"toggleState('.transcripts')\" class=\"tool glyphicon glyphicon-file\" ng-class=\"{'selected': $state.includes('collection.explorer.item.*.transcripts')}\" tooltip=Transcript tooltip-placement=left tooltip-popup-delay=300 title=Transcript></div><div ng-click=\"toggleState('.tags')\" class=\"tool glyphicon glyphicon-tags\" ng-class=\"{'selected': $state.includes('collection.explorer.item.*.tags')}\" tooltip=Tags tooltip-placement=left tooltip-popup-delay=300 title=Tags></div></div></div><div ui-view=detail class=detail ng-class=$state.current.data.detailCss></div></div>");
}]);

angular.module("collection/explorer/item/item.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/item.tpl.html",
    "<div class=row><div ui-view class=\"item item-{{item.type}}\" ng-class=$state.current.data.itemCss></div><div class=item-detail-container ng-class=$state.current.data.detailContainer><div class=\"toolbar toolbar-vert\"><div class=\"toolset pull-right\"><div ng-click=\"toggleState('.metadata')\" class=\"tool glyphicon glyphicon-info-sign\" ng-class=\"{'selected': $state.includes('explorer.collection.item.*.metadata')}\" tooltip=\"About this item\" tooltip-placement=left tooltip-popup-delay=300 title=\"About this item\" ng-show=metadata></div><div ng-click=\"toggleState('.transcripts')\" class=\"tool glyphicon glyphicon-file\" ng-class=\"{'selected': $state.includes('explorer.collection.item.*.transcript')}\" tooltip=Transcript tooltip-placement=left tooltip-popup-delay=300 title=Transcript></div><div ng-click=\"toggleState('.tags')\" class=\"tool glyphicon glyphicon-tags\" ng-class=\"{'selected': $state.includes('explorer.collection.item.*.tags')}\" tooltip=Tags tooltip-placement=left tooltip-popup-delay=300 title=Tags></div></div></div><div ui-view=detail class=detail ng-class=$state.current.data.detailCss></div></div></div>");
}]);

angular.module("collection/explorer/item/video/video.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/item/video/video.tpl.html",
    "<div class=\"row video-row\"><div class=item ng-class=$state.current.data.itemCss><div class=video-player-wrapper><video ng-src={{item.asset_path}} preload=auto controls mediaelement=video><source type=video/mp4 ng-src=\"{{item.asset_path}}\"></video></div></div><div class=item-detail-container ng-class=$state.current.data.detailContainer><div class=\"toolbar toolbar-vert\"><div class=\"toolset pull-right\"><div ng-click=\"toggleState('.metadata')\" class=\"tool glyphicon glyphicon-info-sign\" ng-class=\"{'selected': $state.is('colleciton.explorer.item.video.metadata')}\" tooltip=\"About this item\" tooltip-placement=left tooltip-popup-delay=300 title=\"About this item\" ng-show=metadata.value></div><div ng-click=\"toggleState('.transcripts')\" class=\"tool glyphicon glyphicon-file\" ng-class=\"{'selected': $state.is('colleciton.explorer.item.video.transcript')}\" tooltip=Transcript tooltip-placement=left tooltip-popup-delay=300 title=Transcript></div><div ng-click=\"toggleState('.tags')\" class=\"tool glyphicon glyphicon-tags\" ng-class=\"{'selected': $state.is('colleciton.explorer.item.video.tags')}\" tooltip=Tags tooltip-placement=left tooltip-popup-delay=300 title=Tags></div></div></div><div ui-view=detail class=detail ng-class=$state.current.data.detailCss></div></div></div>");
}]);

angular.module("collection/explorer/list/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("collection/explorer/list/list.tpl.html",
    "<div class=row><div class=col-xs-12><div class=list-info><span ng-if=pager.show>{{acumen.list.first}} - {{acumen.list.last}} <span class=list-info-muted>of</span></span> <span class=list-info-muted>{{acumen.list.total | listTotals}}</span></div></div><div id={{item.repo_loc}} class=list-item ng-class=$state.current.data.listItemCss ng-repeat=\"item in list track by item.repo_loc\" index={{$index}}><a ng-href={{ENV_PATH}}{{item.link}} class=thumbnail ng-class=\"{'selected': $stateParams.repoLoc[0] == item.repo_loc}\"><p class=\"small page-num\">{{pageNum}}</p><img ng-src=\"{{item.thumb_url}}\"><h5 class=item-title>{{title}}</h5></a></div><div class=\"col-xs-12 text-center\" ng-if=pager.show><div pagination class=\"grid-pagination pagination-sm\" ng-change=pageList() total-items=pager.total items-per-page=pager.perPage ng-model=pager.current max-size=pager.max boundary-links=true rotate=false num-pages=pager.numPages></div></div></div>");
}]);

angular.module("common/disclaimer/disclaimer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/disclaimer/disclaimer.tpl.html",
    "<div class=disclaimer-modal-container><button type=button class=close ng-click=\"$dismiss('cancel')\"><span aria-hidden=true>&times;</span><span class=sr-only>Close</span></button><div class=modal-header><h3 class=modal-title>Disclaimer</h3></div><div class=\"modal-body bg-warning text-warning\">Although the authors of this Web site have made every reasonable effort to be factually accurate, no responsibility is assumed for editorial or clerical errors or error occasioned by honest mistake. All information contained on this Web site is subject to change by the appropriate officials of The University of Alabama without prior notice. Material on this Web site does not serve as a contract between The University of Alabama and any other party.</div><div class=modal-footer><button class=\"btn btn-warning btn-lg btn-block\" ng-click=\"$dismiss('cancel')\">OK</button></div></div>");
}]);

angular.module("common/feedback/feedback.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/feedback/feedback.tpl.html",
    "<div class=feedback-modal-container><div class=modal-header><h3 class=modal-title>Give us feedback!</h3></div><button type=button class=close ng-click=cancel()><span aria-hidden=true>&times;</span><span class=sr-only>Close</span></button><form rol=form name=feedback_form ng-submit=\"feedback_form.$valid && send()\" novalidate><div class=modal-body><div class=form-group><label for=name>Name</label><input ng-model=feedback.name class=form-control id=name name=name placeholder=\"Enter your name\" required></div><div class=form-group><label for=email>Email</label><input type=email ng-model=feedback.email class=form-control id=email name=email placeholder=\"Enter email\" required></div><input class=dis-email ng-model=feedback.confirm_email id=confirm_email name=confirm_email placeholder=\"Confirm email\"><div class=form-group><label for=category>What would you like to tell us?</label><select ng-model=feedback.category class=form-control id=category name=category><option>General feedback or suggestions for improvement</option><option>Trouble with search functionality</option><option>Trouble with the asset explorer</option><option>Trouble viewing metadata</option><option>Bug report</option><option>Other</option></select></div><div class=form-group><label for=details>Details</label><textarea ng-model=feedback.details class=form-control id=details name=details rows=4 required></textarea><span class=\"small text-muted\">When reporting a problem, please be as specific as possible. Be sure to include all relevant information such as links to problem pages, your browser information (e.g., Firefox 30, Internet Explorer 11), and what navigation steps caused the issue.</span></div></div><div class=modal-footer><button type=submit class=\"btn btn-primary btn-lg btn-block\" ng-disabled=feedback_form.$invalid>Send Feedback</button></div></form></div>");
}]);

angular.module("error.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("error.tpl.html",
    "<div ng-if=\"error.status == 301\"><div class=\"alert alert-warning\"><p class=lead style=\"padding-left: 60px\"><span class=\"glyphicon glyphicon-exclamation-sign\"></span> Error code: {{error.status}} - {{error.data.msg.warning}}</p></div><div class=jumbotron style=\"padding-top: 15px\"><div class=container><div class=row><div class=\"hidden-sm hidden-xs col-md-3\"><div style=\"font-size: 14em\"><span class=\"glyphicon glyphicon-transfer\" style=\"color: #CC4A14\"></span></div></div><div class=col-md-9><h1>Looking for<br><strong>{{error.data.msg.found.title}}</strong>?</h1><blockquote style=\"border-left-color: #ccc\"><p>Replace your link or bookmark with this PURL and never see this page again: <strong>{{error.data.msg.found.purl}}</strong></p></blockquote><a class=\"btn btn-primary btn-lg\" ng-href={{ENV_PATH}}{{error.data.msg.found.link}}>Go there now <span class=\"glyphicon glyphicon-chevron-right\"></span></a></div></div></div></div></div><div ng-if=\"error.status == 404\"><div class=\"alert alert-danger\"><p class=lead style=\"padding-left: 60px\"><span class=\"glyphicon glyphicon-exclamation-sign\"></span> Error code: {{error.status}} - {{error.data.msg.error}}</p></div><div class=jumbotron style=\"padding-top: 15px\"><div class=container><div class=row><div class=\"hidden-sm hidden-xs col-md-3\"><div style=\"font-size: 14em\"><span class=\"glyphicon glyphicon-remove-circle\" style=\"color: #990000\"></span></div></div><div class=col-md-9><h1>Oops!</h1><p class=lead>It looks like there is nothing here.</p></div></div></div></div></div>");
}]);

angular.module("home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home.tpl.html",
    "<div class=\"home-slice home-slice-dark\"><div class=container-fluid><div class=lead>Acumen contains over 1600 finding aids and 100,000 digitized items, ranging from manuscripts and photographs to audio, sheet music, and student dissertations. Here you will find a wealth of information about the history of Alabama and the Deep South, as well as the United States more generally.</div></div></div><div class=\"jumbotron home-slice home-slice-load-bg\"><div class=container><div><h2>Spanning two centuries <small>digitized collections covering a range of topics</small></h2></div><div><iframe src=\"http://libcontent.lib.ua.edu/~willjones-local/decade_chart/\" height=410 style=\"width: 100%\" scrolling=no frameborder=0></iframe></div></div></div><div class=\"jumbotron home-slice home-slice-light-orange\"><div class=container-fluid><div class=row><div class=col-xs-12><h1>Hot keys!</h1><p>The hot keys change depending on what page you're viewing. Press \"?\" (or 'shift + /') will show you which hot keys are available.</p></div><div class=col-xs-4><h4>Global hot keys</h4><table><tbody><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>?</span></td><td class=cfp-hotkeys-text>Toggle hot keys menu</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>s</span></td><td class=cfp-hotkeys-text>Focus on search box</td></tr></tbody></table><h4>Search Results Page</h4><table><tbody><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>ctrl + →</span></td><td class=cfp-hotkeys-text>Next results page</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>ctrl + ←</span></td><td class=cfp-hotkeys-text>Previous results page</td></tr></tbody></table></div><div class=col-xs-4><h4>When focused on search box</h4><table><tbody><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 0</span></td><td class=cfp-hotkeys-text>Choose 'All'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 1</span></td><td class=cfp-hotkeys-text>Choose 'Audio'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 2</span></td><td class=cfp-hotkeys-text>Choose 'Books'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 3</span></td><td class=cfp-hotkeys-text>Choose 'Finding Aids'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 4</span></td><td class=cfp-hotkeys-text>Choose 'Images'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 5</span></td><td class=cfp-hotkeys-text>Choose 'Manuscript Materials'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 6</span></td><td class=cfp-hotkeys-text>Choose 'Maps'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 7</span></td><td class=cfp-hotkeys-text>Choose 'Research'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 8</span></td><td class=cfp-hotkeys-text>Choose 'Sheet Music'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt + 9</span></td><td class=cfp-hotkeys-text>Choose 'University Archives'</td></tr></tbody></table></div><div class=col-xs-4><h4>Viewing metadata</h4><table><tbody><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>shift + ↑</span></td><td class=cfp-hotkeys-text>Go to parent collection</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>shift + ←</span></td><td class=cfp-hotkeys-text>Back to search results</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>shift + v</span></td><td class=cfp-hotkeys-text>View metadata source</td></tr></tbody></table><h4>Asset explorer</h4><table><tbody><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>ctrl + →</span></td><td class=cfp-hotkeys-text>Next list page</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>ctrl + ←</span></td><td class=cfp-hotkeys-text>Previous list page</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>i</span></td><td class=cfp-hotkeys-text>Toggle 'About this item'</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>g</span></td><td class=cfp-hotkeys-text>Toggle tags panel</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>t</span></td><td class=cfp-hotkeys-text>Toggle transcript panel</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>alt</span></td><td class=cfp-hotkeys-text>Toggle image rotate</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>z</span></td><td class=cfp-hotkeys-text>Toggle image zoom</td></tr><tr><td class=cfp-hotkeys-keys><span class=cfp-hotkeys-key>f</span></td><td class=cfp-hotkeys-text>Toggle full screen</td></tr></tbody></table></div></div></div></div>");
}]);

angular.module("search/no-results.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/no-results.tpl.html",
    "<div class=\"col-xs-12 col-md-8 col-md-offset-2\"></div>");
}]);

angular.module("search/search.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/search.tpl.html",
    "<div class=\"col-xs-12 col-md-8 col-md-offset-2\" ng-if=numFound><p class=text-right>{{numFound}} item(s) found in {{queryTime}}s</p></div><div class=\"col-xs-12 text-center\" ng-show=\"numFound > limit\"><div pagination class=pagination ng-change=pageChanged() total-items=numFound items-per-page=limit ng-model=page max-size=16 boundary-links=true rotate=false></div></div><div class=\"col-xs-12 col-md-8 col-md-offset-2\"><div class=\"text-center alert alert-danger\" ng-if=!numFound><h1>No results found for <em>{{$stateParams.q}}</em></h1></div><div ng-if=numFound><div class=media ng-repeat=\"doc in results\"><div class=\"thumbnail-results pull-left\"><div class=pull-right><a href={{ENV_PATH}}{{doc.link}} class=search-thumbnail-wrapper><img ng-src={{doc.thumb_path}} class=\"media-object search-thumbnail\"></a><div class=clearfix></div><div class=text-muted>{{doc.date}}</div></div></div><div class=media-body><h4 class=media-heading><a ng-href={{ENV_PATH}}{{doc.link}} class=title title={{doc.title}}>{{doc.title}}</a> <small class=clearfix>{{doc.subtitle}}</small></h4><p ng-show=doc.description>{{doc.description | truncate:300}}</p><div class=row ng-show=doc.details><div class=\"details hidden-xs col-sm-4\" ng-repeat=\"(title, detail) in doc.details\"><div class=\"detail-title text-muted\"><small>{{title}}(s)</small></div><div class=detail ng-repeat=\"det in detail | limitTo:4 track by $index\">{{det}}</div></div></div></div></div></div></div><div class=\"col-xs-12 text-center\" ng-show=\"numFound > limit\"><div pagination class=pagination ng-change=pageChanged() total-items=numFound items-per-page=limit ng-model=page max-size=16 boundary-links=true num-pages=numPages rotate=false></div></div>");
}]);

angular.module("search_box/search-box.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search_box/search-box.tpl.html",
    "<div class=\"searchbox-header jumbotron\"><div class=container><div class=row><div class=\"col-xs-2 text-center\"><a href=\"\" ui-sref=search(acumen.prevSearchParams) class=\"page-nav page-nav-left back-to-search fa fa-arrow-circle-left\" tooltip=\"Back to search results\" tooltip-placement=right tooltip-append-to-body=true ng-if=acumen.prevSearch></a></div><div class=col-xs-8><form role=form-control ng-submit=search()><div class=\"input-group input-group-lg\"><div class=input-group-btn dropdown is-open=status.isopen><button type=button class=\"btn btn-default dropdown-toggle\" ng-disabled=disabled>{{selected.title}} <span class=caret></span></button><ul class=\"dropdown-menu dropdown-menu-left\"><li class=dropdown-header>Search categories:</li><li ng-repeat=\"(key, cat) in categories\"><a href=# ng-click=\"select(key, $event)\">{{cat.title}}</a></li></ul></div><input name=q class=form-control id=q placeholder={{selected.placeHolder}} ng-model=acumen.query><div class=input-group-btn><button class=\"btn btn-primary\"><span class=\"fa fa-search\"></span></button></div></div></form></div><div class=\"col-xs-2 text-center\"><a ng-href=\"{{ENV_PATH}}{{acumen.collection.parent.link}}?page={{acumen.collection.toPage}}\" class=\"page-nav page-nav-right fa fa-arrow-circle-up\" tooltip=\"Go to parent collection: &quot;{{acumen.collection.parent.title}}&quot;\" tooltip-placement=bottom title=\"Go to parent collection: {{acumen.collection.parent.title}}\" ng-if=\"acumen.collection.parent.id > 0\" to-parent></a></div></div></div></div>");
}]);
;angular.module('acumen', [
        'ngAnimate',
        'ngCookies',
        'restangular',
        'acumen.templates',
        'chieffancypants.loadingBar',
        'cfp.hotkeys',
        'ui.router',
        'ui.bootstrap',
        'acumen.search',
        'acumen.searchBox',
        'acumen.collection',
        'directive.feedback',
        'directive.disclaimer'
])

    .value('acumen', {
        fullscreen: false
    })

    // Adopted from: https://github.com/angular-ui/ui-router/blob/master/sample/app/app.js
    .run(['$rootScope', '$log', '$state', '$stateParams', '$cookieStore', '$window', '$location', function ($rootScope, $log, $state, $stateParams, $cookieStore, $window, $location){
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ui-sref-active="active }"> will set the <li> // to active whenever
        // 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.acumen = {};
        $rootScope.ENV_PATH = '/';

        document.documentElement.setAttribute('data-useragent', navigator.userAgent);
        /*$rootScope.$on("$stateNotFound", function(e, ts, fs) {
         $log.error("$stateNotFound", ts, "from", fs);
         });
         $rootScope.$on("$stateChangeError", function(e, ts, tp, fs, fp, err) {
            $log.error("$stateChangeError", ts, "params", tp, "from", fs, err, "params", fp);
         });
        $rootScope.$on("$stateChangeSuccess", function(e, state, params, fs, fp) {
            $log.log("$stateChangeSuccess", state, "params", params, "from", fs, "params", fp);
         });*/

        $rootScope.$on("$stateChangeStart", function(e, state, params, fs, fp) {
            //$log.log("$stateChangeStart", state, "params", params, "from", fs, "params", fp, "event", e);

            if (state.name.indexOf('collection.explorer') > -1 && fs.name === 'search'){
                $window.scrollTo(0,0);
            }
        });

        $rootScope.$on("$stateChangeError", function(e, ts, tp, fs, fp, err) {
            $log.error("$stateChangeError", ts, "params", tp, "from", fs, err, "params", fp, "event", e);
            $rootScope.error = angular.copy(err);

            $state.go('error', {}, {location: false});
        });


        if ($window.hasOwnProperty('ga')){
            $rootScope.$on("$stateChangeSuccess", function(e, state, params) {
                ga('send', 'pageview', $location.url());
            });
        }



        $rootScope.token = makeToken();

        function makeToken()
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return $cookieStore.get('prevSearchParams'+text) ? makeToken() : text;
        }
    }])

    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'RestangularProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, RestangularProvider){

        $locationProvider.html5Mode(true).hashPrefix('!');
        RestangularProvider.setDefaultHttpFields({cache: true});
        RestangularProvider.setBaseUrl('https://acumen.lib.ua.edu/dev/api');

        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;
            /*console.log({
             'data': data,
             'operation': operation,
             'what': what,
             'url': url,
             'response': response,
             'deferred': deferred
             });*/
            if (operation === "getList"){
                extractedData = data.data;
                if (data.metadata){
                    extractedData.metadata = data.metadata;
                }
                if (data.msg){
                    extractedData.msg = data.msg;
                }
            }
            return extractedData;
        });

        /*$urlRouterProvider.rule(function($injector, $location){
            var path = $location.path();
            var re = /[a-zA-Z][0-9]+[_0-9]*!/;

            if (path === '/'){
                path = $location.hash();
            }

            var match = re.exec(path);
            if (match !== null){
                return match[0].replace(/_/, '/');
            }
        });*/

        $urlRouterProvider.when("/home", "/");
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                onEnter: ['$window', function($window){
                    $window.scrollTo(0,0);
                }],
                templateUrl: 'home.tpl.html'
            })
            .state('error', {
                templateUrl: 'error.tpl.html'
            });
    }])

    .controller('AlertCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
        $scope.showAlerts = false;
        $rootScope.alerts = [];

        $rootScope.addAlert = function(alert) {
            $rootScope.alerts.push(alert);
            if (!$scope.showAlerts) $scope.showAlerts = true;
            $timeout(function(){
                var i = $rootScope.alerts.length-1;
                $rootScope.closeAlert(i);
            }, 4000);
        };

        $rootScope.closeAlert = function(index) {
            $rootScope.alerts.splice(index, 1);
            if ($rootScope.alerts.length > 0){
                $timeout(function(){
                    $scope.showAlerts = false;
                }, 5000);
            }
        };
    }])

    .directive('loadingWrapper', ['$window', '$rootScope', function($window, $rootScope){
        return {
            restrict: 'AC',
            link: function(scope, elm, attrs){
                $rootScope.$on('cfpLoadingBar:started', function(){
                    elm.css('display', 'block');
                });
                $rootScope.$on('cfpLoadingBar:completed', function(){
                    setTimeout(function(){
                        elm.css('display', 'none');
                    }, 1000);
                });
                angular.element($window).bind('scroll', function(ev){
                    if (this.pageYOffset > 51){
                        scope.fixie = true;
                    }
                    else{
                        scope.fixie = false;
                    }
                    scope.$apply();
                });
            }
        }
    }])

    .directive('fixieMenu', ['$window', function($window){
        return {
            restrict: 'AC',
            link: function(scope, elm, attrs){
                var fixieClass = angular.isDefined(attrs.fixieMenuClass) ? attrs.fixieMenuClass : 'fixie';
                var offset = angular.isNumber(attrs.fixieMenuOffset) ? attrs.fixieMenuOffset : (document.getElementById(attrs.fixieMenuOffset).getBoundingClientRect().top + $window.pageYOffset);
                offset -= 20;
                angular.element($window).bind('scroll', fixieScroll);

                function fixieScroll(){
                    if (this.pageYOffset > offset) {
                        var width = elm.css('width');
                        elm.addClass(fixieClass);
                        elm.css('width', width);
                    }
                    else {
                        elm.removeClass(fixieClass);
                        elm.css('width', 'auto');
                    }
                }

                scope.$on('$destroy', function(){
                    angular.element($window).unbind('scroll', fixieScroll);
                });
            }
        }
    }])

    .filter('filesize', function(){
        return function(bytes){
            bytes = angular.isUndefined(bytes) ? 0 : bytes;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round((bytes / Math.pow(1024, i))) + ' ' + sizes[i];
        }
    })

    .filter('columnSize', function(){
        return function(numCols){
            return Math.floor(12/Object.keys(numCols).length);
        }
    })


    .filter('truncate', function () {
        return function (text, length, end) {
            if (angular.isDefined(text)){
                if (isNaN(length))
                    length = 10;

                if (end === undefined)
                    end = "...";

                if (text.length <= length || text.length - end.length <= length) {
                    return text;
                }
                else {
                    return String(text).substring(0, length-end.length) + end;
                }
            }
        };
    });;angular.module('acumen.collection', [
        'acumen.collection.explorer',
        'acumen.service.items',
        'ngSanitize'
    ])

    .config(['$stateProvider', '$urlMatcherFactoryProvider',function ($stateProvider, $urlMatcherFactoryProvider) {

        $urlMatcherFactoryProvider.type('collection', {
            encode: function(item) {
                // Represent the list item in the URL using its corresponding index
                item = angular.isArray(item) ? item.join('/') : item;
                return item.replace('/_/', '/');
            },
            decode: function(item) {
                // Look up the list item by index
                item = item.substr(-1) === '/' ? item.substr(0, item.length - 1) : item;
                item = item.split('/');

                //return item.match(/([a-zA-Z][0-9]+_?[0-9]*)([_0-9]+)?/);
                var loc = [];
                loc.push(item.join('_'));

                if (item.length > 3){
                    item = item.slice(0, 3);
                }
                loc.push(item.join('_'));

                return loc;
            },
            pattern: /[a-zA-Z][0-9]+(?:\/?[0-9]*)?/
        });

        $stateProvider
            .state('collection', {
                url: '/{repoLoc:collection}?page&limit',
                abstract: true,
                data: {
                    //default classes for common state views
                    itemsListCss: 'col-xs-12 col-md-10 col-md-offset-1',
                    listItemCss: 'col-xs-12 col-sm-4 col-md-3 col-lg-2',
                    itemContainerCss: 'hidden',
                    detailContainerCss: 'hidden'
                },
                resolve: {
                    metadata: ['$stateParams', 'items', function($stateParams, items){
                        return items.metadata($stateParams.repoLoc[1]);
                    }]
                },
                onEnter: ['$rootScope', 'metadata', function($rootScope, metadata){
                    if (metadata.metadata.children.assets == 0 && metadata.metadata.children.metadata == 0){
                        $rootScope.acumen.asset_explorer = false;
                    }
                    else $rootScope.acumen.asset_explorer = true;

                    $rootScope.acumen.collection = metadata.metadata;
                    $rootScope.acumen.collection.toPage = Math.floor(((metadata.metadata.rank-1)/($rootScope.$stateParams.limit || 40)) + 1);


                }],
                onExit: ['$rootScope', function($rootScope){
                    $rootScope.acumen.collection = false;
                }],
                templateUrl: 'collection/collection.tpl.html',
                controller: ['$scope', 'metadata', '$rootScope', '$sce', 'hotkeys', '$window', function($scope, metadata, $rootScope, $sce, hotkeys, $window){
                    $scope.title = $sce.trustAsHtml(metadata.metadata.title);
                    $scope.metadata = metadata[0];
                    $scope.file = metadata.metadata;
                    $scope.file.file_path = $scope.file.file_path.replace('/content/', $rootScope.ENV_PATH);
                    $scope.total = parseInt(metadata.metadata.children.assets) + parseInt(metadata.metadata.children.metadata);



                    $scope.collapseControls = false;
                    $scope.collapseAll = function(){
                        angular.element(document.getElementsByClassName('initiallyVisible')).addClass('hidden');
                        angular.element(document.getElementsByClassName('initiallyHidden')).addClass('hidden');
                        angular.element(document.getElementsByClassName('title-btn')).addClass('collapsed');
                    };

                    $scope.expandAll = function(){
                        angular.element(document.getElementsByClassName('initiallyVisible')).removeClass('hidden');
                        angular.element(document.getElementsByClassName('initiallyHidden')).removeClass('hidden');
                        angular.element(document.getElementsByClassName('title-btn')).removeClass('collapsed');
                    };

                    hotkeys.add({
                        combo: 'shift+v',
                        description: 'View metadata source',
                        callback: function($event){
                            $event.preventDefault();
                            $window.open($scope.file.file_path);
                        }
                    });

                    $scope.$on('$destroy', function(){
                        hotkeys.del('shift+v');
                    });
                }]
            })
    }])

    .directive('toParent', ['hotkeys', function(hotkeys){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                hotkeys.bindTo(scope).add({
                    combo: 'shift+up',
                    description: 'Go to parent collection/item',
                    callback: function($event){
                        elm.triggerHandler('click');
                    }
                });

                scope.$on('$destroy', function(){
                    hotkeys.del('shift+up');
                })
            }
        }
    }])

    .directive('titleBtn', [function(){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                if (elm.next().hasClass('initiallyHidden')){
                    if (!scope.collapseControls) scope.collapseControls = true;
                    elm.next().addClass('hidden');
                    elm.addClass('collapse-title-btn bg-primary collapsed');
                    elm.bind('click', toggle);
                }
                else if(elm.next().hasClass('initiallyVisible')){
                    if (!scope.collapseControls) scope.collapseControls = true;
                    elm.addClass('collapse-title-btn bg-primary');
                    elm.bind('click', toggle);
                }

                function toggle(){
                    elm.toggleClass('collapsed');
                    elm.next().toggleClass('hidden');
                }
            }
        }
    }])

    .directive('compile', ['$compile', function($compile){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                var element = angular.isObject(scope.metadata) ? angular.element(scope.metadata.value) : angular.element(scope.metadata);
                var metadata = $compile(element)(scope);
                elm.append(metadata);
            }
        }
    }]);;angular.module('acumen.collection.explorer', [
        'acumen.collection.explorer.item',
        'acumen.service.items',
        '8bitsquid.printButton'
    ])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('collection.explorer', {
                url: '',
                data: {
                    //default classes for common state views
                    listMenuCss: 'col-xs-12',
                    itemsListCss: 'col-xs-12 col-md-10 col-md-offset-1',
                    listItemCss: 'col-xs-12 col-sm-4 col-md-3 col-lg-2',
                    itemContainerCss: 'hidden',
                    detailContainerCss: 'hidden'
                },
                resolve: {
                    list: ['$stateParams', 'items', function($stateParams, items){
                        return items.collection($stateParams.repoLoc[1], $stateParams.page, $stateParams.limit);
                    }]
                },
                views: {
                    '': {
                        templateProvider: ['$templateFactory', 'acumen', function($templateFactory, acumen){
                            var tpl = acumen.fullscreen ? 'explorer-fullscreen' : 'explorer';
                            return $templateFactory.fromUrl('collection/explorer/' + tpl + '.tpl.html');
                        }],
                        controller: ['$scope', '$state', '$rootScope', '$stateParams', 'hotkeys', function($scope, $state, $rootScope, $stateParams, hotkeys){
                            var prevState;
                            $scope.gridToggle = function(){
                                if (!$state.is('collection.explorer')){
                                    prevState = $state.$current.name;
                                    $state.go('collection.explorer', $stateParams, {location: false, reload: false});
                                }
                                else if (prevState){
                                    $state.go(prevState, {item: $rootScope.prevItem}, {location: false, reload: false}).then(function(){
                                        prevState = null;
                                    });
                                }
                            };

                            $scope.toggleHotKeys = function(){
                                hotkeys.toggleCheatSheet();
                            };
                        }]
                    },
                    'list@collection.explorer': {
                        templateUrl: 'collection/explorer/list/list.tpl.html',
                        controller: ['$scope', '$rootScope', 'list', '$location', '$state', 'hotkeys', function($scope, $rootScope, list, $location, $state, hotkeys){
                            $scope.list = list;

                            $scope.pager = {
                                show: list.metadata.total > list.metadata.limit,
                                total: list.metadata.total,
                                perPage: list.metadata.limit,
                                current: list.metadata.page,
                                max: 16
                            };


                            $rootScope.acumen.list = {
                                items: list,
                                first: ((list.metadata.page-1)*list.metadata.limit)+1,
                                last: list.metadata.page*list.length,
                                total: list.metadata.totals
                            };

                            $scope.pageList = function(){
                                $location.search('page', $scope.pager.current);
                            };

                            if ($scope.pager.show){
                                hotkeys.add({
                                    combo: 'ctrl+right',
                                    description: 'Go to next page in results list',
                                    callback: function(){
                                        if ($scope.pager.current < $scope.pager.numPages){
                                            $scope.pager.current++;
                                            $scope.pageList();
                                        }
                                    }
                                });
                                hotkeys.add({
                                    combo: 'ctrl+left',
                                    description: 'Go to previous page in results list',
                                    callback: function(){
                                        if ($scope.pager.current > 1){
                                            $scope.pager.current--;
                                            $scope.pageList();
                                        }
                                    }
                                });
                            }

                            $scope.$on('$destroy', function(){
                                hotkeys.del('ctrl+left');
                                hotkeys.del('ctrl+right');
                            });

                        }]
                    }
                }
            })
    }])

    .directive('fullscreenExplorer', [function(){
        return {
            restrict: 'AC',
            templateUrl: 'collection/explorer/explorer.tpl.html'
        };
    }])

    .directive('fullscreenButton', ['$rootScope', '$state', '$stateParams', 'hotkeys', 'acumen', function($rootScope, $state, $stateParams, hotkeys, acumen){
        return {
            restrict: 'AC',
            controller: function($scope){
                $scope.selected = acumen.fullscreen;

                $scope.toggle = function(){
                    toggleFullscreen();
                };

                hotkeys.bindTo($scope).add({
                    combo: 'f',
                    description: 'Fullscreen toggle',
                    callback: function(){
                        toggleFullscreen();
                    }
                });

                function toggleFullscreen(){
                    acumen.fullscreen = !acumen.fullscreen;
                    angular.element('body').toggleClass('body-fullscreen');
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true, inherit: true, notify: true, location: false
                    });
                }
            }
        }
    }])

    .directive('listItem', ['$rootScope', '$filter', function($rootScope, $filter){
        return {
            restrict: 'AC',
            link: function(scope){
                scope.pageNum = (scope.$parent.pager.current-1) * scope.$parent.pager.perPage + scope.$index + 1;
                scope.title = $filter('truncate')(scope.item.title, 50);
            }
        }
    }])

    .directive('historyButton', ['$window', function($window){
        return function(scope, elm, attrs){
            var to = attrs.historyButton;
            elm.on('click', function(){
                $window.history[to]();
            })
        }
    }])

    .filter('listTotals', function(){
        return function(totals){
            var t = [];
            angular.forEach(totals, function(val, key){
                t.push(val + ' ' + key);
            });
            return t.join(', ');
        }
    });;angular.module('acumen.collection.explorer.item.audio', [
        'mediaElement',
        'acumen.collection.explorer.item.tags',
        'acumen.collection.explorer.item.transcripts',
        'acumen.collection.explorer.item.metadata',
        'ngSanitize'
    ])

    .config(['$templateStateProvider', '$stateProvider', function ($templateState, $stateProvider) {

        $stateProvider
            .state('collection.explorer.item.audio', {
                data: {
                    //default classes for common state views
                    itemsListCss: 'col-xs-6',
                    listItemCss: 'col-xs-12 col-md-4 col-lg-3',
                    itemContainerCss: 'col-xs-6',
                    detailContainer: 'audio-detail-container',
                    detailCss: 'hidden'
                },
                templateUrl: 'collection/explorer/item/audio/audio.tpl.html'
            })
            .state('collection.explorer.item.audio.tags', {
                params: {
                    detail: {value: 'transcript'}
                },
                data:{
                    detailCss: 'audio-detail',
                    detailContainer: 'audio-detail-container full-width',
                    itemMetadataCss: 'hidden'
                },
                resolve: {
                    tags: ['item', function(item){
                        return item[0].tags;
                    }]
                },
                views: {
                    'detail@collection.explorer.item.audio': {
                        templateUrl: 'collection/explorer/item/detail/tags/tags.tpl.html',
                        controller: 'TagsCtrl'
                    }
                }
            })
            .state('collection.explorer.item.audio.transcripts', {
                params: {
                    item: {},
                    repoLoc: {},
                    page: {value: 1},
                    limit: {value: 40}
                },
                data:{
                    detailCss: 'audio-detail',
                    detailContainer: 'audio-detail-container full-width',
                    itemMetadataCss: 'hidden'
                },
                resolve: {
                    transcripts: ['item', function(item){
                        return item[0].transcripts;
                    }]
                },
                views: {
                    'detail@collection.explorer.item.audio': {
                        templateUrl: 'collection/explorer/item/detail/transcripts/transcripts.tpl.html',
                        controller: 'TranscriptsCtrl'
                    }
                }
            })
    }]);;angular.module('acumen.collection.explorer.item.metadata', [
        'templateState'
    ])

    .config(['$templateStateProvider', function($templateStateProvider){
        $templateStateProvider.template('metadata', {
            data:{
                itemCss: 'col-xs-7 col-md-6 col-lg-8',
                detailContainer: 'col-xs-5 col-md-6 col-lg-4',
                detailCss: 'detail-metadata-container'
            },
            views: {
                'detail': {
                    templateUrl: 'collection/explorer/item/detail/metadata/metadata.tpl.html'
                }
            }
        })
    }])

    .directive('metadataEmpty', [function(){
        return {
            restrict: 'AC',
            templateUrl: 'collection/explorer/item/detail/metadata/metadata-empty.tpl.html',
            link: function(scope, elm, attrs){
                switch (attrs.metadataEmpty){
                    case 'audio':
                        scope.emptyIcon = 'glyphicon glyphicon-volume-up';
                        break;
                    case 'image':
                        scope.emptyIcon = 'glyphicon glyphicon-picture';
                    case 'video':
                        scope.emptyIcon = 'glyphicon glyphicon-film';
                    default:
                        scope.emptyIcon = 'glyphicon glyphicon-exclamation-sign';
                }
            }
        }
    }]);;angular.module('acumen.collection.explorer.item.tags', [
        'templateState'
    ])

    .config(['$templateStateProvider', function($templateStateProvider){
        $templateStateProvider.template('tags', {
            data:{
                itemCss: 'col-xs-7 col-md-6 col-lg-8',
                detailContainer: 'col-xs-5 col-md-6 col-lg-4',
                detailCss: 'detail-tags-container'
            },
            resolve: {
                item: ['item', function(item){
                    return item;
                }],
                tags: ['item', function(item){
                    return item[0].tags;
                }]
            },
            views: {
                'detail': {
                    templateUrl: 'collection/explorer/item/detail/tags/tags.tpl.html',
                    controller: 'TagsCtrl'
                }
            }
        })
    }])
    .controller('TagsCtrl', ['$scope', '$rootScope', '$cacheFactory', '$stateParams', 'tags', 'item', 'items', '$location', function($scope, $rootScope, $cacheFactory, $stateParams, tags, item, items, $location){
        angular.copy($scope.tags);
        $scope.tags = tags || [];
        $scope.addTags = function(input){
            input.tags = input.tags.replace(/(\r\n|\n|\r)/gm, ",").split(/,/gm);
            var tags = {tags: input.tags.join()};
            if (input.email) tags['email'] = input.email;

            items.addTags($stateParams.repoLoc[0], tags).then(function(){

                for (var i = 0; i < input.tags.length; i++){
                    var nodupe = input.tags[i];
                    for (var x = 0; x < $scope.tags.length; x++){
                        if (nodupe === $scope.tags[x].value){
                            nodupe = null;
                        }
                    }
                    if (nodupe) $scope.tags.push({value: nodupe, status: "unverified"});
                }
                input.tags = null;
                var $httpDefaultCache = $cacheFactory.get('$http');

                item[0].tags = angular.copy($scope.tags);

                $httpDefaultCache.remove($rootScope.ENV_PATH + 'api/items/'+ $stateParams.repoLoc[0] +'/details');

                $rootScope.addAlert({type: 'success', msg: 'Tags added!'});
                //console.log('Tags Added!');
            }, function(response){
                $rootScope.addAlert({type: 'danger', msg: 'Something went wrong! Please try resubmitting tags.'});
            });
        };

        $scope.tagSearch = function(tag){
            $location.path('search/all/tag:"'+tag.value+'"');

        };
    }]);angular.module('acumen.collection.explorer.item.transcripts', [
        'templateState'
    ])

    .config(['$templateStateProvider', function($templateStateProvider){
        $templateStateProvider.template('transcripts', {
            data:{
                itemCss: 'col-xs-6 col-lg-7',
                detailContainer: 'col-xs-6 col-lg-5',
                detailCss: 'detail-transcript-container'
            },
            resolve: {
                item: ['item', function(item){
                    return item;
                }],
                transcripts: ['item', function(item){
                    return item[0].transcripts;
                }]
            },
            views: {
                'detail': {
                    templateUrl: 'collection/explorer/item/detail/transcripts/transcripts.tpl.html',
                    controller: ['$scope', '$rootScope', '$stateParams', 'transcripts', 'items', 'item', '$cacheFactory', function($scope, $rootScope, $stateParams, transcripts, items, item, $cacheFactory){
                        $scope.master = {};
                        if (transcripts){
                            $scope.transcript = transcripts[0];
                            $scope.master = angular.copy(transcripts[0]);
                        }

                        $scope.isUnchanged = function(transcript){
                            return angular.equals(transcript, $scope.master);
                        };

                        $scope.addTranscript = function(transcript){
                            var t = {transcript: transcript.value};
                            if (transcript.email) t['email'] = transcript.email;
                            items.addTranscript($stateParams.repoLoc[0], t).then(function(){
                                //console.log('Transcript Added!');
                                var $httpDefaultCache = $cacheFactory.get('$http');

                                item[0].transcripts = [transcript];

                                $httpDefaultCache.remove($rootScope.ENV_PATH + 'api/items/'+ $stateParams.repoLoc[0] +'/details');

                                $scope.master = angular.copy(transcript);
                                $rootScope.addAlert({type: 'success', msg: 'Transcript added'});
                            }, function(response){
                                $rootScope.addAlert({type: 'danger', msg: 'Something went wrong! Please try resubmitting transcript.'});
                            })
                        }

                    }]
                }
            }
        })
    }])
    .controller('TranscriptsCtrl', ['$scope', '$stateParams', 'transcripts', 'items', function($scope, $stateParams, transcripts, items){
        $scope.master = $scope.transcript = angular.isDefined(transcripts) ? transcripts[0] : {};
        //console.log($scope.transcript);

        $scope.isUnchanged = function(transcript){
            return angular.equals($scope.master, transcript.value)
        }

        $scope.addTranscript = function(transcript){
            var t = {transcript: transcript.value};
            if (transcript.email) t['email'] = transcript.email;
            items.addTranscript($stateParams.repoLoc[0], t).then(function(){
                //console.log('Transcript Added!');
                $scope.master = transcript.value
            }, function(response){
                //console.log('Error adding transcript:');
                //console.log(response);
            })
        }
    }]);

;angular.module('acumen.collection.explorer.item.document', [
        'acumen.collection.explorer.item.tags',
        'acumen.collection.explorer.item.transcripts',
        'acumen.collection.explorer.item.metadata'
    ])

    .config(['$templateStateProvider', function ($templateState) {

        $templateState
            .state('collection.explorer.item.document', {
                extend: ['tags', 'transcripts', 'metadata'],
                data: {
                    itemCss: 'video-default',
                    itemsListCss: 'col-xs-4 col-md-3 col-lg-2',
                    listItemCss: 'col-xs-12',
                    itemContainerCss: 'col-xs-8 col-md-9 col-lg-10',
                    detailContainer: 'closed',
                    detailCss: 'hidden'
                },
                templateUrl: 'collection/explorer/item/document/document.tpl.html'
            });
    }]);;angular.module('acumen.service.image', [])

    .factory('loadImage', ['$q', function($q){
        return function(src){
            var deferred = $q.defer();
            var img = new Image();

            img.onload = function(){
                deferred.resolve(img);
            };
            img.src = src;

            return deferred.promise;
        }
    }])

    .service('$image', ['$q', function($q){
        var self = this;
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.changed = false;
        this.prev = {};

        this.margin = {
            width: 60,
            height: 20
        };
        this.offset = {
            width: 0,
            height: 0
        };

        this.x = 0;
        this.y = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.width = 0;
        this.height = 0;
        this.scalar = 1;
        this.minScale = .2;
        this.maxScale = 1.4;
        this.angle = 0;

        this.setDefaults = function(){
            self.resizeCanvas();
            self.changed = false;
            self.x = 0;
            self.y = 0;
            self.angle = 0;
            self.setScale();
            self.resizeImage();
            self.center();
            //console.log({changed: self.changed});
        };

        this.refactor = function(offset){
            if (offset.width !== self.width){
                self.setOffset(offset);
                if (!self.changed){
                    self.setDefaults();
                }
                else{
                    var x = self.x + (self.prev.canvas_width - self.canvas.width)/2;
                    var y = self.y + (self.prev.canvas_height - self.canvas.height)/2
                    if (x > 0 && (self.x+self.width) < (self.canvas.width - self.margin.width - self.offset.width)) self.x = x;
                    if (y > 0 && (self.y+self.height) < (self.canvas.height - self.margin.height - self.offset.height)) self.y = y;
                    //if ((self.x - dx) > 0 && dx < (self.x+self.width)) self.x -= dx;
                    //if ((self.y - dy) > 0 && dy < (self.y+self.height)) self.y -= dy;

                }
                self.draw();
            }
        };

        this.init = function(params){
            var deferred = $q.defer();
            if (params.src){
                if (params.offset) {
                    self.setOffset(params.offset);
                }
                self.canvas = params.canvas;
                self.ctx = self.canvas.getContext('2d');
                self.loadImage(params.src).then(function(){
                    self.resizeCanvas();
                    self.setDefaults();
                    self.draw();
                    deferred.resolve();
                });
            }
            else{
                deferred.reject('No image src given.');
            }
            return deferred.promise;
        }
        
        this.setOffset = function(offset){
            if (self.offset.width !== offset.width) self.offset.width = offset.width;
        }
        
        this.loadImage = function(src){
            var deferred = $q.defer();
            self.image = new Image();

            self.image.onload = function(){
                deferred.resolve();
            };
            self.image.src = src;
            return deferred.promise;
        };

        this.draw = function(){
            // Clear the canvas
            self.clear();
            // Save matrix state
            self.ctx.save();

            // Translate matrix to (x, y) then scale matrix
            self.ctx.translate(self.x, self.y);
            self.ctx.scale(self.scalar, self.scalar);

            // Translate matrix to (x, y) values representing the distance to the image's center
            self.ctx.translate(self.image.width/2, self.image.height/2);
            // Rotate matrix
            self.ctx.rotate(self.angle);
            // Translate matrix back to state before it was translated to the (x, y) matching the image's center
            self.ctx.translate(-self.image.width/2, -self.image.height/2);

            // Draw image to canvas
            self.ctx.drawImage(self.image, 0, 0);
            // Restore matrix to it's saved state.
            // If the matrix was not saved, then altered, then restored
            // 	for every draw, then the transforms would stack (i.e., without save/restore
            //	and image at scale 1, scaled to 1.2, then scale to 1 would result in a final scale
            // 	of 1.2 - because (1 * 1.2) * 1 = 1.2
            self.ctx.restore();

            self.x2 = self.x + self.width;
            self.y2 = self.y + self.height;
        };

        this.setScale = function(){
            var width_ratio = (self.canvas.width - self.margin.width - self.offset.width) / self.image.width;
            var height_ratio = (self.canvas.height - self.margin.height - self.offset.height) / self.image.height;
            self.scalar = Math.min(width_ratio, height_ratio);
            /*console.log({w_ratio: width_ratio, h_ratio: height_ratio});
            console.log('width_ratio = ('+self.canvas.width+' - ('+self.margin.width+' + '+self.offset.width+')) / '+self.image.width);
            console.log('height_ratio = ('+self.canvas.height+' - ('+self.margin.height+' + '+self.offset.height+')) / '+self.image.height);*/
        };

        this.clear = function(){
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        };

        this.resizeCanvas = function(){
                self.prev.canvas_width = self.canvas.width;
                self.prev.canvas_height = self.canvas.height;

                self.canvas.style.width = '100%';
                self.canvas.style.height = '100%';

                self.canvas.width = self.canvas.offsetWidth;
                self.canvas.height = self.canvas.offsetHeight;
        };

        this.resizeImage = function(){
            self.width = self.image.width*self.scalar;
            self.height = self.image.height*self.scalar;
        };

        this.center = function(){
            self.x = ((self.canvas.width - self.offset.width) - self.width)/2;
            self.y = ((self.canvas.height) - self.height)/2;
        };

        this.scaleXY = function(newWidth, newHeight){
            self.x = newWidth/self.canvas.width;
            self.y = newHeight/self.canvas.height;
        };

        this.posImage = function(){
            if (!self.changed){
                self.center();
            }
            else{
                self.x *= self.canvas.width/self.prev.canvas_width;
                self.y *= self.canvas.height/self.prev.canvas_height;
            }

            //console.log(self);
        };
    }]);
;angular.module('acumen.image.tools', [])
    .service('$imageTools', ['$image', '$document', '$window', '$location', function ImageTools($image, $document, $window, $location){
        var self = this;
        var offset;
        var tool;
        var canvas;
        this.canvasEventPause = false;

        this.current;
        this.prev;

        this.init = function(){
            //var defaultTool = $location.search().tool || 'move';
            var defaultTool = 'move';
            canvas = angular.element($image.canvas);
            offset = getOffset($image.canvas);
            self.select(defaultTool);
            self.zoomSlider.init();
            readyCanvas();
        }

        this.destroy = function(){
            canvas.unbind();
            $document.unbind();
        }

        this.select = function(newTool){
            if (newTool !== self.current){
                self.prev = self.current;
                tool = new Tools[newTool]();
                self.current = newTool;
                /*$location.search('tool', self.current);
                $location.replace();*/
            }
        }

        this.prevTool = function(){
            if (angular.isDefined(self.prev)) self.select(self.prev);
        }

        function readyCanvas(){
            canvas.bind('mousedown', function(ev){
                canvasEvent(ev);
                $document.bind('mousedown', toolCursor);
                $document.bind('mouseup', toolCursor);
                $document.bind('mouseup', toolChangedImage);
            });
            /*canvas.bind('mousemove', function(ev){
             ev = self.mouseLoc(ev);
             if (mouseInBounds($image.x, $image.y, $image.x2, $image.y2, ev.mx, ev.my)){
             if (!hover) hover = true;
             angular.element('body').addClass(self.current);
             canvas.bind('mousedown', canvasEvent);
             }
             else if (hover){
             hover = false;
             angular.element('body').removeClass(self.current);
             }
             });
             canvas.bind('mouseup', toolChangedImage);*/
        }

        function toolCursor(ev){
            if (ev.type == 'mousedown')
                angular.element('body').addClass(self.current);
            else if (ev.type == 'mouseup'){
                angular.element('body').removeClass(self.current);
                $document.unbind('mousedown', toolCursor);
            }
        }

        function canvasEvent(ev){
            if (!self.canvasEventPause){
                ev = self.mouseLoc(ev); //set current mouse (mx, my)
                var func = tool[ev.type];
                if (func){
                    func(ev);
                }
            }
            return ev.preventDefault() && false;
        }

        function toolChangedImage(){
            $image.changed = true;
            canvas.unbind('mouseup', toolChangedImage);
        }

        this.mouseLoc = function(ev){
            ev.mx = ev.pageX - offset.left;
            ev.my = ev.pageY - offset.top;
            return ev;
        }

        function mouseInBounds(x1, y1, x2, y2, mx, my){
            //console.log(mx +' > '+ x1 +' && '+ my +' > '+ y1 +' && '+ mx +' < '+ x2 +' && '+ my +' < '+ y2);
            return (mx > x1 && my > y1 && mx < x2 && my < y2);
        };

        function getOffset(elm){
            var rect = elm.getBoundingClientRect();
            //return {top: rect.top, left: rect.left};
            var doc = elm.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + $window.pageYOffset - docElem.clientTop,
                left: rect.left + $window.pageXOffset - docElem.clientLeft
            };
        }

        this.map = function(val, xMin, xMax, yMin, yMax) {
            return (val - xMax) / (xMin - xMax) * (yMax - yMin) + yMin;
        };

        //Buttons - these are not selectable tools, but perform a single redefined function
        this.zoomSlider = {
            height: 0,
            pos: 0,
            elm: null,
            init: function(){
                self.zoomSlider.height = self.zoomSlider.elm.offsetHeight-2;
                self.zoomSlider.defaultPos();
            },
            defaultPos: function(){ self.zoomSlider.pos = self.map($image.scalar, $image.maxScale, $image.minScale, self.zoomSlider.height, 0); }
        };

        this.zoom = function(ev, delta, deltaX, deltaY){
            // extend event variable with mouse location
            ev = self.mouseLoc(ev);
            var slideBarY;
            var dScale;
            var zoomCenter = true;

            if (!delta){
                var pos = ev.my - self.zoomSlider.height;
                dScale = self.map(pos, 0, self.zoomSlider.height, $image.minScale, $image.maxScale);
                delta = dScale - $image.scalar;
            }
            else{
                delta = delta/10;
                dScale = Math.round(($image.scalar + delta) * 1e1) / 1e1;

                zoomCenter = mouseInBounds($image.x, $image.y, $image.x2, $image.y2, ev.mx, ev.my) ? false : true;
            }

            // If mouse is not over the image, zoom from the center of the image instead of mouse location (ev.mx, ev.my)
            if (zoomCenter){
                ev.mx = ($image.x + $image.x2)/2;
                ev.my = ($image.y + $image.y2)/2;
            }
            //var clipScale = Math.min(Math.max($image.minScale, dScale), $image.maxScale);
            //If dScale is within scale limits
            if (!(dScale < $image.minScale || dScale > $image.maxScale)){

                $image.x = ev.mx - ($image.scalar + delta) * ((ev.mx-$image.x) / $image.scalar);
                $image.y = ev.my - ($image.scalar + delta) * ((ev.my-$image.y) / $image.scalar);

                $image.scalar = dScale;
                $image.width = $image.image.width*$image.scalar;
                $image.height = $image.image.height*$image.scalar;

                $image.draw();
            }
            //set slideBarY position
            slideBarY = self.map(dScale, $image.maxScale, $image.minScale, self.zoomSlider.height, 0);

            //zoom slider bar position - always changes, but differently depending on mousewheel or slider zoom
            self.zoomSlider.pos = Math.min(Math.max(slideBarY, 0), self.zoomSlider.height);
            return ev.preventDefault() && false;
        }

        //Tools - only one can be selected at a time
        var Tools = {
            move: function(){
                var mox = 0;
                var moy = 0;
                var ox = 0;
                var oy = 0;

                this.mousedown = function(ev){
                    mox = ev.mx;
                    moy = ev.my;

                    ox = ev.mx - $image.x;
                    oy = ev.my - $image.y;

                    $document.bind('mousemove', canvasEvent);
                    $document.bind('mouseup', canvasEvent);
                };

                this.mousemove = function(ev){
                    var dx = ev.mx - mox;
                    var dy = ev.my - moy;

                    $image.x = mox + dx - ox;
                    $image.y = moy + dy - oy;

                    x2 = $image.x+$image.width;
                    y2 = $image.y+$image.height;

                    $image.draw();
                }

                this.mouseup = function(){
                    $document.unbind('mousemove', canvasEvent);
                    $document.unbind('mousemove', canvasEvent);
                }
            },
            rotate: function(){
                var cX;
                var cY;
                var clickAngle;

                this.mousedown = function(ev){
                    cX = $image.x + ($image.width/2);
                    cY = $image.y + ($image.height/2);
                    clickAngle = getAngle ( cX , cY , ev.mx, ev.my) - $image.angle;

                    $document.bind('mousemove', canvasEvent);
                    $document.bind('mouseup', canvasEvent);
                }

                this.mousemove = function(ev){
                    $image.angle = getAngle ( cX , cY , ev.mx, ev.my) - clickAngle;
                    $image.draw();
                };

                this.mouseup = function(ev){
                    $document.unbind('mousemove', canvasEvent);
                    $document.unbind('mouseup', canvasEvent);
                }

                /**
                 * angle helper function
                 */
                function getAngle( cX, cY, mx, my ){
                    var angle = Math.atan2(my - cY, mx - cX);
                    return angle;
                }
            }
        }
    }]);;angular.module('acumen.collection.explorer.item.image', [
        'acumen.service.image',
        'acumen.image.tools',
        'acumen.collection.explorer.item.tags',
        'acumen.collection.explorer.item.transcripts',
        'acumen.collection.explorer.item.metadata',
        'ngSanitize',
        'monospaced.mousewheel'
    ])

    .config(['$templateStateProvider', function ($templateState) {

        $templateState
            .state('collection.explorer.item.image', {
                extend: {
                    'tags': {
                        data: {
                            detailContainer: 'col-xs-5 col-md-6 col-lg-4 image-detail',
                            detailCss: 'detail-tags-container'
                        }
                    },
                    'transcripts': {
                        data: {
                            detailContainer: 'col-xs-6 col-lg-5 image-detail',
                            detailCss: 'detail-transcript-container'
                        }
                    },
                    'metadata': {
                        data:{
                            detailContainer: 'col-xs-5 col-md-6 col-lg-4 image-detail',
                            detailCss: 'detail-metadata-container'
                        }
                    }
                },
                data: {
                    //default classes for common state views
                    itemsListCss: 'col-xs-4 col-md-3 col-lg-2',
                    listItemCss: 'col-xs-12',
                    itemContainerCss: 'col-xs-8 col-md-9 col-lg-10',
                    detailContainer: 'closed',
                    detailCss: 'hidden'
                },
                templateUrl: 'collection/explorer/item/image/image.tpl.html'
            });
    }])

    .directive('assetImage', ['$image', '$imageTools', '$timeout', '$window', 'hotkeys', function($image, $imageTools, $timeout, $window, hotkeys){
        return{
            restrict: 'AC',
            link: function(scope, elm){

                var zooming = false;

                scope.imageTools = $imageTools;
                var detailElm = document.getElementsByClassName('item-detail-container')[0];
                $image.init({src: scope.item.asset_path, canvas: elm[0], offset: {width: 40}}).then(function(){
                    scope.imageTools.init();
                });

                scope.$on('detail-toggle', function(){
                    $timeout(function(){
                        $image.refactor({width: detailElm.offsetWidth});
                    }, 100);
                });

                scope.reset = function(){
                    $image.setDefaults();
                    $image.draw();
                    $imageTools.zoomSlider.init();
                };

                scope.mouseZoom = function(event, delta){
                    if (zooming){
                        scope.imageTools.current = delta > 0 ? 'zoom-in' : 'zoom-out';
                        scope.imageTools.zoom(event, delta);
                    }
                };



                hotkeys.add({
                    combo: 'alt',
                    description: 'Toggle image rotate',
                    action: 'keydown',
                    callback: function(){
                        $imageTools.select('rotate');
                    }
                });
                hotkeys.add({
                    combo: 'alt',
                    action: 'keyup',
                    callback: function(){
                        $imageTools.prevTool();
                    }
                });

                hotkeys.add({
                    combo: 'z',
                    description: 'Toggle image mouse wheel zoom',
                    action: 'keypress',
                    callback: function(event){
                        event.preventDefault();
                        if (!zooming){
                            scope.imageTools.prev = scope.imageTools.current;
                            scope.imageTools.current = 'zoom-in';
                            zooming = true;
                        }
                    }
                });

                hotkeys.add({
                    combo: 'z',
                    action: 'keyup',
                    callback: function(){
                        zooming = false;
                        scope.imageTools.current = scope.imageTools.prev;
                    }
                });


                angular.element($window).bind('resize', function(){
                    $image.resizeCanvas();
                    $image.resizeImage();
                    $image.posImage();
                    $image.draw();
                });

                scope.$on('$destroy', function(){
                    hotkeys.del('alt');
                    hotkeys.del('alt');
                    hotkeys.del('z');
                    hotkeys.del('z');
                    $imageTools.destroy();
                });
            }
        }
    }])
    .directive('zoomTool', ['$imageTools', '$document', '$image', function($imageTools, $document, $image){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                scope.imageTools.zoomSlider.elm = elm[0];
                scope.pos = scope.imageTools.zoomSlider.pos;

                elm.bind('mousedown', function(ev){
                    scope.imageTools.canvasEventPause = true;
                    mousemove(ev);
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                });


                function mousemove(ev){
                    scope.imageTools.zoom(ev);
                    scope.$digest();
                    return ev.preventDefault() && false;
                }

                function mouseup(){
                    $image.changed = true;
                    scope.imageTools.canvasEventPause = false;
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        }
    }]);;angular.module('acumen.collection.explorer.item', [
        'acumen.collection.explorer.item.image',
        'acumen.collection.explorer.item.audio',
        'acumen.collection.explorer.item.video',
        'acumen.collection.explorer.item.document',
        'acumen.service.items',
        'ui.router'
    ])

    .config(['$stateProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlMatcherFactoryProvider) {

        $urlMatcherFactoryProvider.type('asset', {
            encode: function(item) {
                // Represent the list item in the URL using its corresponding index
                return item.join('/').replace('/_/', '/');
            },
            decode: function(item) {
                // Look up the list item by index
                item = item.substr(-1) === '/' ? item.substr(0, item.length - 1) : item;
                item = item.split('/');

                var loc = [];
                loc.push(item.join('_'));

                if (item.length > 3){
                    item = item.slice(0, 3);
                }

                loc.push(item.join('_'));

                return loc;
            },
            pattern: /[a-zA-Z][0-9]+(?:\/?[0-9]*){2,}/
        });

        $stateProvider
            .state('collection.explorer.item', {
                url: '^/{repoLoc:asset}?page&limit',
                resolve: {
                    item: ['$stateParams', 'items', 'list',  function($stateParams, items, list){
                        return items.details($stateParams.repoLoc[0]).then(function(data){
                            return data;
                        }, function(response){
                            return true;
                        });

                    }]
                },
                onEnter: function($state, $stateParams, item, list, $location){
                    if (item === true && list.length <= 6 && list[0].type){
                        $location.url(list[0].link);
                        $location.replace();
                    }
                    else if (item !== true && item.metadata.has_children && $stateParams.repoLoc[1] != $stateParams.repoLoc[0]){
                        $stateParams.repoLoc[1] = $stateParams.repoLoc[0];
                        $state.go('collection.explorer.item', $stateParams, {location: false});
                    }
                },
                onExit: ['$rootScope', '$stateParams', function($rootScope, $stateParams){
                    $rootScope.prevItem = $stateParams.repoLoc[0];
                }],
                views: {
                    '': {
                        template: '<div ui-view></div>',
                        controller: ['$scope', '$rootScope', 'item', '$state', '$stateParams', '$timeout', 'hotkeys', '$sce', function($scope, $rootScope, item, $state, $stateParams, $timeout, hotkeys, $sce){

                            if (item !== true){

                                var state = item.metadata.type;
                                if (state === 'audio'){
                                    state += '.transcripts';
                                }

                                $state.go('collection.explorer.item.'+state, $stateParams, {location: false, reload: false, inherit: false});

                            $scope.item = item.metadata;
                            $rootScope.acumen.item = item.metadata;

                            $scope.metadata = false;
                                if (angular.isDefined(item[0].metadata)){
                                    if ($stateParams.repoLoc[0] !== $stateParams.repoLoc[1]){
                                $scope.metadata = item[0].metadata;
                                $rootScope.acumen.item['title'] = item[0].metadata.title;

                                hotkeys.add({
                                    combo: 'i',
                                    description: 'Toggle \'About this item\' panel',
                                    callback: function(){
                                        $scope.toggleState('.metadata')
                                    }
                                });
                            }


                                    if (item[0].metadata.hasOwnProperty('meta_tags')){
                                        $rootScope.acumen.metaTags = item[0].metadata.meta_tags;
                                    }


                            }

                            var prevState = null;

                            $scope.closeDetail = function(){
                                prevState = null;
                                    if ($state.includes('collection.explorer.item.**.**')){
                                        $state.go('^', {location: false, reload: false}, $stateParams).then(function(){
                                        $scope.$broadcast('detail-toggle');
                                    });
                                }
                                };

                                $scope.toggleState = function(toState){
                                    toState = angular.isUndefined(toState) ? false : toState;
                                var rel = '';

                                    if (toState === prevState){
                                        toState = '^';
                                }
                                    else if(!$state.is('collection.explorer.item.'+item.metadata.type)){
                                    rel = '^';
                                }
                                    prevState = toState;

                                    $state.go(rel+toState, $stateParams, {location: false, reload: false}).then(function(){
                                    $scope.$broadcast('detail-toggle');
                                });
                            };

                                if ($state.includes('collection.explorer.item.*')){
                            $timeout(function(){
                                        var elm = document.getElementById($stateParams.repoLoc[0]);
                                var pos = (elm.getAttribute('index') * 230) - (230/2);
                                document.getElementById('items_list').scrollTop = pos;
                            }, 150);
                                }


                            hotkeys.add({
                                combo: 't',
                                description: 'Toggle transcript panel',
                                callback: function(){
                                    $scope.toggleState('.transcripts')
                                }
                            });
                            hotkeys.add({
                                combo: 'g',
                                description: 'Toggle tags panel',
                                callback: function(){
                                    $scope.toggleState('.tags')
                                }
                                });

                            $scope.$on('$destroy', function(){
                                hotkeys.del('i');
                                hotkeys.del('t');
                                hotkeys.del('g');
                            })
                            }

                        }]
                    }
                }
            })
    }]);;angular.module('acumen.collection.explorer.item.video', [
        'mediaElement',
        'acumen.collection.explorer.item.tags',
        'acumen.collection.explorer.item.transcripts',
        'acumen.collection.explorer.item.metadata',
        'ngSanitize'
    ])

    .config(['$templateStateProvider', function ($templateState) {

        $templateState
            .state('collection.explorer.item.video', {
                extend: ['tags', 'transcripts', 'metadata'],
                data: {
                    //default classes for common state views
                    itemCss: 'video-default',
                    itemsListCss: 'col-xs-4 col-md-3 col-lg-2',
                    listItemCss: 'col-xs-12',
                    itemContainerCss: 'col-xs-8 col-md-9 col-lg-10',
                    detailContainer: 'closed',
                    detailCss: 'hidden'
                },
                templateUrl: 'collection/explorer/item/video/video.tpl.html'
            });
    }]);;angular.module('acumen.service.items', ['restangular'])

    .factory('items', ['Restangular', function(Restangular){
        return {
            exists: function(repoLoc){
                //console.log(repoLoc);
                return Restangular.one('items', repoLoc).all('exists').getList().then(function(data){
                    //console.log(data);
                    return data[0];
                });
            },
            collection: function(repoLoc, page, limit){
                //console.log({repo: repoLoc, page: page, limit: limit});
                return Restangular.one('items', repoLoc).one('page', page).one('limit', limit).getList();
            },
            metadata: function(repoLoc){
                return Restangular.one('items', repoLoc).all('metadata').getList();
            },
            details: function(item){
                return Restangular.one('items', item).all('details').getList();
            },
            tags: function(item){
                return Restangular.one('items', item).all('tags').getList();
            },
            addTags: function(item, tags){
                //console.log(tags);
                    return Restangular.one('tags', item).all('tags').post(tags);

            },
            transcripts: function(item){
                return Restangular.one('items', item).all('transcripts').getList();
            },
            addTranscript: function(item, transcript){
                return Restangular.one('transcripts', item).all('transcript').post(transcript);
            }
        }
    }]);;angular.module('directive.disclaimer', [])

    .directive('disclaimerModalButton', ['$modal', function($modal){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                elm.on('click', function(ev){
                    ev.preventDefault();
                    $modal.open({
                        templateUrl: 'common/disclaimer/disclaimer.tpl.html'
                    });
                })
            }
        }
    }]);;angular.module('directive.feedback', [])

    .controller('FeedbackModalCtrl', ['$scope', '$rootScope', '$http', '$modalInstance', function($scope, $rootScope, $http, $modalInstance){
        $scope.feedback = {
            category: 'General feedback or suggestions for improvement'
        };
        $scope.send = function(){
            var url = $rootScope.ENV_PATH + 'api/feedback_email';
            angular.forEach($scope.feedback, function(val, key){
                url += '/' + key + '/' +  encodeURIComponent(val);
            })
            $http.post(url).success(function(){
                $scope.ok();
            })
        }

        $scope.ok = function(){
            $modalInstance.close();
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }
    }])

    .controller('FeedbackCtrl', ['$scope', '$modal', function($scope, $modal){
        $scope.open = function(){
            var modalInstance = $modal.open({
                templateUrl: 'common/feedback/feedback.tpl.html',
                controller: 'FeedbackModalCtrl'
            })
        }
    }])

    .directive('feedbackModalButton', [function(){
        return {
            restrict: 'AC',
            controller: 'FeedbackCtrl',
            link: function(scope, elm){
                elm.on('click', function(ev){
                    ev.preventDefault();
                    scope.open();
                })
            }
        }
    }]);;angular.module('mediaElement', [])

    .factory('MediaelementFactory', [function(){
        return {
            video: {
                // initial volume when the player starts
                startVolume: 0.5,
                // useful for <audio> player loops
                loop: false,
                // enables Flash and Silverlight to resize to content size
                enableAutosize: true,
                // the order of controls you want on the control bar (and other plugins below)
                features: ['playpause','progress','current','duration','tracks','volume','fullscreen'],
                // Hide controls when playing and mouse is not over the video
                alwaysShowControls: false,
                // force iPad's native controls
                iPadUseNativeControls: false,
                // force iPhone's native controls
                iPhoneUseNativeControls: false,
                // force Android's native controls
                AndroidUseNativeControls: false,
                // forces the hour marker (##:00:00)
                alwaysShowHours: false,
                // show framecount in timecode (##:00:00:00)
                showTimecodeFrameCount: false,
                // used when showTimecodeFrameCount is set to true
                framesPerSecond: 25,
                // turns keyboard support on and off for this instance
                enableKeyboard: true,
                // when this player starts, it will pause other players
                pauseOtherPlayers: true
            },
            audio: {
                // initial volume when the player starts
                startVolume: 0.5,
                // useful for <audio> player loops
                loop: false,
                // the order of controls you want on the control bar (and other plugins below)
                features: ['playpause','progress','current','duration','tracks','volume'],
                // Hide controls when playing and mouse is not over the video
                alwaysShowControls: true,
                // force iPad's native controls
                iPadUseNativeControls: false,
                // force iPhone's native controls
                iPhoneUseNativeControls: false,
                // force Android's native controls
                AndroidUseNativeControls: false,
                // forces the hour marker (##:00:00)
                alwaysShowHours: false,
                // show framecount in timecode (##:00:00:00)
                showTimecodeFrameCount: false,
                // turns keyboard support on and off for this instance
                enableKeyboard: true,
                // when this player starts, it will pause other players
                pauseOtherPlayers: true
            }
        };
    }])

.directive('mediaelement', ['$timeout', 'MediaelementFactory', function($timeout, me){
        return {
            restrict: 'AC',
            link: function(scope, elm, attrs){
                //console.log('scope');
                $timeout(init, 100);

                function init(){
                    var settings = me[attrs.mediaelement];

                    settings.pluginPath = "<%= env_path %>vendor/mediaelement/";
                    settings.success = function(media){
                        media.load();
                        media.play();
                    };

                    var player = new MediaElementPlayer(attrs.mediaelement, me[attrs.mediaelement]);

                    attrs.$observe('src', function() {
                        load();
                    });

                    function load(){
                        elm.mediaelementplayer(me[attrs.mediaelement]);
                        player.play();
                    }
                }
            }
        }
    }]);;angular.module('templateState', ['ui.router'])
    //Tried my own method that failed. Modified to reflect method shown here: https://github.com/angular-ui/ui-router/issues/1014
    .provider('$templateState', ['$stateProvider', function($stateProvider){
        var templates = {};

        this.state = function(name, definition){
            $stateProvider.state(name, definition);
            if (angular.isDefined(definition.extend)){
                angular.forEach(definition.extend, function(val, key){
                   var temp = {};
                   var type;
                   if (angular.isString(val)){
                       angular.copy(templates[val], temp);
                       type = val;
                   }
                   else if (angular.isObject(val)){
                       angular.copy(templates[key], temp);
                       angular.extend(temp, val);
                       type = key;
                   }
                    $stateProvider.state(name+'.'+type, angular.copy(temp));
                });
            }
        };

        this.template = function(name, template) {
            templates[name] = template;
        };

        this.$get = function(){
        };

    }]);;angular.module('acumen.service.search', [
        'restangular'
    ])

    .factory('searchCategories', [function(){
        var categories = {
            'all': {'title': 'All', fq:'', placeHolder: 'Search all collections in Acumen'},
            'audio': {'title':'Audio', 'fq': '{!lucene}asset_type:audio', placeHolder: 'Search for audio recordings'},
            'books': {'title': 'Books', 'fq': '{!lucene}repo_loc:?0002*', placeHolder: 'Search for books'},
            'findingaids': {'title': 'Finding Aids', 'fq': '{!lucene}repo_loc:?0003* +type:Archived', placeHolder: 'Search finding aids'},
            'images': {'title': 'Images', 'fq': '{!lucene}(repo_loc:(?0001* OR ?0011*) OR (genre:photographs OR genre:"picture postcards")) AND type:image', placeHolder: 'Search for images'},
            'manuscripts': {'title': 'Manuscript Materials', 'fq': '{!lucene}repo_loc:?0003* -type:Archived', placeHolder: 'Search manuscripts'},
            'maps': {'title': 'Maps', 'fq': 'map AND asset_type:image -type:music', placeHolder: 'Search for maps'},
            'research': {'title': 'Research', 'fq': '{!lucene}repo_loc:?0015*', placeHolder: 'Search research and dissertation materials'},
            'sheetmusic': {'title': 'Sheet Music', 'fq': '{!lucene}repo_loc:?0004*', placeHolder: 'Search for sheet music'},
            'universityarchives': {'title': 'University Archives', 'fq': '{!lucene}repo_loc:?0006*', placeHolder: 'Search archived university materials'}
        };

        return {
            fq: function(cat){
                return categories[cat].fq;
            },
            all: function(){
                return categories;
            }
        };
    }])

    .factory('solrURI', ['searchCategories', function(categories){
        return {
            build: function(params){
                var uri = '';

                if (params.category && !params.fq){
                    params.fq = categories.fq(params.category);
                }

                angular.forEach(params, function(val, param){
                    if (val !== null && param != 'category'){
                        uri += '/'+ param +'/'+ val;
                    }
                });
                return uri;
            }
        };
    }])

    .factory('solr', ['Restangular', 'searchCategories', function(Restangular, categories){
        return {
            search: function(params){
                var search = Restangular.one('search', params.q).one('page', params.page).one('limit', params.limit);

                if (params.category) {
                    search = search.one('fq', categories.fq(params.category));
                }

                return search.getList();
            }
        };
    }]);;angular.module('acumen.search', [
        'acumen.service.search',
        'ui.router'
    ])

    .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                    .state('search', {
                        url: '/search/{category:all|audio|books|findingaids|images|manuscripts|maps|research|sheetmusic|universityarchives}/{q}?page&limit',
                        params: {
                            category: {value: 'all'},
                            q: {value: '*:*'},
                            page: {value: "1"},
                            limit: {value: "20"}
                        },
                        resolve: {
                            solr: ['$stateParams', 'solr', function($stateParams, solr){
                                //$stateParams.q = encodeURIComponent($stateParams.q);
                                return solr.search($stateParams);
                            }]
                        },
                        onEnter: ['$rootScope', '$window', '$cookieStore', '$stateParams', '$location', function($rootScope, $window, $cookieStore, $stateParams, $location){
                            if (angular.isUndefined($location.search().noHistory)){
                                $cookieStore.put('prevSearchParams'+$rootScope.token, $stateParams);
                            }

                            $rootScope.acumen.query = $stateParams.q;
                            $rootScope.acumen.cat = $stateParams.category;


                            $window.scrollTo(0,0);
                        }],
                        templateUrl: 'search/search.tpl.html',
                        controller: ['$scope', '$rootScope', '$state', '$stateParams', '$window', 'solr', '$location', '$cookieStore', 'hotkeys',  function ($scope, $rootScope, $state, $stateParams, $window, solr, $location, $cookieStore, hotkeys) {

                            $scope.results = solr;
                            $scope.numFound = solr.metadata.numFound;
                            $scope.queryTime = solr.metadata.queryTime;
                            $scope.page = $stateParams.page;
                            $scope.limit = $stateParams.limit;

                            $scope.pageChanged = function(){
                                $location.search('page', $scope.page);
                            };

                            $rootScope.$on('$stateChangeSuccess', function(){
                                if ($state.includes('collection.**') && $cookieStore.get('prevSearchParams'+$rootScope.token)){
                                    //console.log('state change to search');
                                    $rootScope.acumen.prevSearchParams = $cookieStore.get('prevSearchParams'+$rootScope.token);
                                    $rootScope.acumen.prevSearch = true;
                                }
                                else {
                                    $rootScope.acumen.prevSearch = false;
                                }
                            })

                            if ($scope.numFound) document.getElementById('q').blur();

                            if ($scope.numFound > $scope.limit){
                                hotkeys.add({
                                    combo: 'ctrl+right',
                                    description: 'Next page in search results',
                                    callback: function(){
                                        if ($scope.page < $scope.numPages){
                                            $scope.page++;
                                            $scope.pageChanged();
                                        }
                                    }
                                });

                                hotkeys.add({
                                    combo: 'ctrl+left',
                                    description: 'Previous page in search results',
                                    callback: function(){
                                        if ($scope.page > 1){
                                            $scope.page--;
                                            $scope.pageChanged();
                                        }
                                    }
                                });
                            }

                            $scope.$on('$destroy', function(){
                                hotkeys.del('ctrl+right');
                                hotkeys.del('ctrl+left');
                            });
                        }]
                    });
    }]);;angular.module('acumen.searchBox', [
        'acumen.service.search'
    ])

.directive('searchBox', ['$state', '$stateParams', '$cookieStore', 'searchCategories', '$rootScope', '$window' ,'hotkeys', function($state, $stateParams, $cookieStore, categories, $rootScope, $window, hotkeys){
        return {
            restrict: 'AC',
            replace: true,
            scope: {},
            templateUrl: 'search_box/search-box.tpl.html',
            controller: ['$scope', '$element', function($scope, $element){
                $scope.acumen = $rootScope.acumen;
                $scope.categories = categories.all();
               // var prevSearch = $cookieStore.get('prevSearchParams'+$rootScope.token);
                //$scope.query = angular.isDefined(prevSearch) ? prevSearch.q : '';


                var initBox = $rootScope.$on('$stateChangeSuccess', function(){
                    //console.log($stateParams.category);
                    $rootScope.acumen.cat = $stateParams.category || 'all';
                    $scope.selected = $scope.categories[$rootScope.acumen.cat];
                    initBox();
                })

                $scope.select = function(cat, $event){
                    $rootScope.acumen.cat = cat;
                    $scope.selected = $scope.categories[cat];
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.status.isopen = false;
                    $element.find('input')[0].focus();
                };

                $scope.search = function(){
                    //$cookieStore.put('category', $scope.cat);
                    //$cookieStore.put('q', $rootScope.acumen.query);
                    $state.go('search', {q: $rootScope.acumen.query, category: $rootScope.acumen.cat}, {inherit: false});
                };

                /*$scope.backToSearch = function($event){
                    $event.preventDefault();
                    $window.location.href = $cookieStore.get('prevSearch');
                }*/

                hotkeys.add({
                    combo: 's',
                    description: 'Focus on search box',
                    callback: function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        $element.find('input')[0].focus();
                    }
                });

                $element.find('input').bind('focus', bindHotKeys);
                $element.find('input').bind('blur', unBindHotKeys);


                $scope.$on('$destroy', function(){
                    hotkeys.del('s');
                });


                function bindHotKeys($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    hotkeys.add({
                        combo: 'alt+0',
                        description: 'Set search to \'All\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'all';
                            $scope.selected = $scope.categories['all'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+1',
                        description: 'Search \'Audio\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'audio';
                            $scope.selected = $scope.categories['audio'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+2',
                        description: 'Search \'Books\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'books';
                            $scope.selected = $scope.categories['books'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+3',
                        description: 'Search \'Findind Aids\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'findingaids';
                            $scope.selected = $scope.categories['findingaids'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+4',
                        description: 'Search \'Images\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'images';
                            $scope.selected = $scope.categories['images'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+5',
                        description: 'Search \'Manuscript Materials\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'manuscripts';
                            $scope.selected = $scope.categories['manuscripts'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+6',
                        description: 'Search \'Maps\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'maps';
                            $scope.selected = $scope.categories['maps'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+7',
                        description: 'Search \'research\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'research';
                            $scope.selected = $scope.categories['research'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+8',
                        description: 'Search \'Sheet Music\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'sheetmusic';
                            $scope.selected = $scope.categories['sheetmusic'];
                        }
                    });
                    hotkeys.add({
                        combo: 'alt+9',
                        description: 'Search \'University Archives\'',
                        allowIn: ['INPUT'],
                        callback: function(){
                            $scope.cat = 'universityarchives';
                            $scope.selected = $scope.categories['universityarchives'];
                        }
                    });
                }

                function unBindHotKeys(){
                    hotkeys.del('alt+0');
                    hotkeys.del('alt+1');
                    hotkeys.del('alt+2');
                    hotkeys.del('alt+3');
                    hotkeys.del('alt+4');
                    hotkeys.del('alt+5');
                    hotkeys.del('alt+6');
                    hotkeys.del('alt+7');
                    hotkeys.del('alt+8');
                    hotkeys.del('alt+9');
                }

            }]
        }
    }])

    .directive('backToSearch', ['$rootScope', 'hotkeys', function($rootScope, hotkeys){
        return {
            restrict: 'AC',
            link: function(scope){
                hotkeys.add({
                    combo: 'shift+left',
                    description: 'Back to search results',
                    callback: function(){
                        $rootScope.$state.go('search', $rootScope.acumen.prevSearchParams);
                    }
                });

                scope.$on('$destroy', function(){
                    hotkeys.del('shift+left');
                });
            }
        }
    }]);