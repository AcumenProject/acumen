<!DOCTYPE html>
<html lang="en" xmlns:ng="http://angularjs.org" id="ng-app" ng-app="app">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>{{docTitle}}</title>

        <link rel="stylesheet" type="text/css" href="/dev/vendor/bootstrap/css/acumen-bootstrap.css">
        <link rel="stylesheet" type="text/css" href="/dev/vendor/mediaelement/mediaelementplayer.css">
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/dev/assets/css/vendor.css">
        <link rel="stylesheet" type="text/css" href="/dev/assets/css/acumen.css">
		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lte IE 9]>
    	    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="<?php print ENV_PATH; ?>/vendor/respondjs/respond.min.js"></script>
        <![endif]-->


	</head>
	<body>
        <div class="page-wrapper">
		<header class="acumen-nav navbar navbar-default navbar-static-top" role="banner">
  		    <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#acumen-nav">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="<?php print $this->config->base_url(); ?>">Acumen <span class="small">Beta</span></a>
                </div>

                <nav class="collapse navbar-collapse" id="acumen-nav">
                    <ul class="nav navbar-nav">
                        <li><a href="http://www.lib.ua.edu/digital/browse" target="_browse_coll">Browse Collections</a></li>
                        <li><a href="http://www.lib.ua.edu/acumen/categorybrowse" target="_browse_cat">Browse Categories</a></li>
                    </ul>

                    <ul class="nav navbar-nav navbar-right">
                        <li><a mail-to="willjones" tooltip="This will be a web form at launch (not an email prompt)" tooltip-placement="bottom" tooltip-delay="300"><i class="fa fa-comments"></i> Give us feedback</a></li>
                        <li><a href="http://lib.ua.edu/acumen/help" target="_help"><i class="fa fa-question-circle"></i> Help</a></li>
                    </ul>
                </nav>
  		    </div>
		</header>

        <div class="loading-wrapper" ng-class="{fixieloader: fixie}"></div>

		<div class="search-box">
		</div>

        <div class="content-wrapper container-fluid">
		    <div ui-view class="row">
			</div>
		</div>
        </div>

        <div class="footer-wrapper container-fluid text-center">
            <div><img src="assets/images/UA_Square_Logo_4c.png" width="434" height="70" alt="University of Alabama" /></div>
            <div><img src="assets/images/ualib-horizon-logo.png" width="257" height="70" alt="University of Alabama Libraries" /></div>
        </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-sanitize.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-animate.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-cookies.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.js"></script>
        <script src="/dev/vendor/mediaelement/mediaelement-and-player.js"></script>
        <script src="/dev/assets/js/templates/acumen.js"></script>
        <script src="/dev/assets/js/templates/vendor.js"></script>
        <script src="/dev/assets/js/vendor.js"></script>
        <script src="/dev/assets/js/acumen.js"></script>

        <?php /** Share some PHP vars with JS **/?>
        <?php if (isset($shared_js_vars)): ?>
            <script type="text/javascript">
                <?php foreach ($shared_js_vars as $var => $shared): ?>
                var <?php print $var; ?> = <?php print is_array($shared) ? json_encode($shared) : "'".$shared."'"; ?>;
                <?php endforeach; ?>
            </script>
        <?php endif; ?>
	</body>
</html>