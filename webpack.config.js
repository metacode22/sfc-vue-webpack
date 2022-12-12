const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	// .vue, .js를 가지고 올 때는 확장자명을 생략하도록
	resolve: {
		extensions: ['.vue', '.js'],
		// 루트 디렉토리의 src를 ~라는 별칭으로 사용하겠다는 의미이다.
		// components 폴더를 들어갈 땐 ~/components로 작성할 수 있다.
		alias: {
			'~': path.resolve(__dirname, 'src'),
		},
	},
	// webpack.config.js 파일을 기준
	// 이 파일 기준에는 src가 있어 상대 경로로 찾아도 된다.
	// 허나 다른 것은 webpack.config.js가 아니라 
	// 동작하고 나서 output은 어디로 던져줄까? 즉 webpack.config.js 파일 기준이 아니고
	// 내부 로직의 어딘가에서이기 때문에
	// 완전히 절대 경로를 던져줘야 한다.
	// 그래야 정확히 어디로 던져줄지 알 수 있게 된다.
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				// babel 사용 시 주의할 점이다.
				// node_modules는 변환시키지 않도록 해줘야 한다.
				// 근데 axios는 제외해줘야 한다.
				// ?!은 정규식에서 해당 단어를 제외한다는 것이다.
				// 다른 걸 명시하려면 (?!axios|xxxxx|xxxxx) 이렇게 작성해주면 된다.
				exclude: /node_modules\/(?!axios)/,
				use: 'babel-loader'
			},
			{
				// .은 정규식에서 의미를 가진다. 따라서 이를 탈출하기 위해 역슬래쉬 \를 붙여준다.
				// $은 해당 글자로 끝나는 단어를 의미한다.
				// 정규식에는 test라는 메서드가 있어 이를 통해 맞는지 확인한다.
				// 즉 .vue가 마지막에 들어가는 파일 이름을 test 해서 맞으면 use(vue-loader)가 처리하는 코드이다.
				test: /\.vue$/,
				use: 'vue-loader',
			},
			{
				// s가 있어도 되고 없어도 되고
				// 밑에서부터 차례대로 실행된다. sass가 작동하고 나서 postcss가 작동해야 한다. sass는 전처리기, postcss는 후처리기니까.
				test: /\.s?css$/,
				use: [
					'vue-style-loader', 
					'css-loader',
					'postcss-loader',
					'sass-loader',
					// 다음과 같이 설정 시, 컴포넌트의 style 태그에 additionalData의 코드가 자동으로 삽입된다.
					// use는 다른 것보다 먼저 위치해야 한다.
					// scss 코드들을 변환하는 과정에서만 use로 가져온 모듈이 사용되기에 빌드된 제품의 성능에는 영향을 끼치지 않는다.
					// {
					// 	loader: 'sass-loader',
					// 	options: {
					// 		additionalData: `
					// 			@use "sass:color";
					// 			@use "sass:list";
					// 			@use "sass:map";
					// 			@use "sass:math";
					// 			@use "sass:meta";
					// 			@use "sass:selector";
					// 			@use "sass:string";
					// 			@import "~/scss/_variables";
					// 		`
					// 	}
					// }
				],
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlPlugin({ template: path.resolve(__dirname, 'src/index.html') }),
		new CopyPlugin({
			// 앞서 output에 dist로 되어 있으니 생략해도 된다.
			// static이라는 폴더에서 출발해 dist에 넣는다는 것이다.
			// 여러 개의 pattern을 작성할 수 있다.
			patterns: [{ from: 'static' }],
		}),
	],
	devServer: {
		// 기본 port는 8080
		port: 8079,
		historyApiFallback: true
	}
}
