/* eslint-disable import/no-extraneous-dependencies */

module.exports = wallaby => ({
	files: [
		'index.js',
		'event.js'
	],

	tests: [
		'test.js'
	],

	env: {
		type: 'node'
	},

	compilers: {
		'*.js': wallaby.compilers.babel({
			presets: ['es2015'],
			plugins: [
				require('babel-plugin-espower/create')(
					require('babel-core'), {
						embedAst: true,
						patterns: require('ava/lib/enhance-assert').PATTERNS
					})
			]
		})
	},

	testFramework: 'ava',

	debug: true
});
