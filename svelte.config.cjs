const adapter = require('@sveltejs/adapter-static');

module.exports = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		})
	}
};		