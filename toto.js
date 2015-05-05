window.toto = (function(){
	var routes = [],
		routeReplacements = [
			{ find: /\(\)/g, replaceWith: '([^/]+)' },
			{ find: /\(GUID\)/g, replaceWith: '([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})'}
		];

	function addRoute(regex, handler, fallThrough) {
		routes.push({ pattern: regex, handler: handler, fallThrough: fallThrough });
	}

	function start() {
		window.addEventListener('hashchange', onHashChange, false);
		onHashChange();
	}

	function onHashChange() {
		var hash = window.location.hash.split('#')[1] || '',
			i = null;
		
		for(i=0; i<routes.length; i++) {
			var matches = routes[i].pattern.exec(hash);

			if (matches !== null) {
				routes[i].handler.apply(undefined, matches.slice(1));
				
				if (!routes[i].fallThrough){
					return;
				}
			}
		}
	}

	function buildRouteRegExp(pattern) {
		for (var i = 0; i < routeReplacements.length; i++) {
			pattern = pattern.replace(routeReplacements[i].find, routeReplacements[i].replaceWith);
		}

		return new RegExp('^' + pattern + '/?$', 'i');
	}

	return {
		addRoute: function(pattern, handler, fallThrough) { return addRoute(buildRouteRegExp(pattern), handler, fallThrough); },
		start: function() { return start(); }
	};
}());
