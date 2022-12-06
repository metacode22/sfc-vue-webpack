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
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	module: {
		rules: [
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
				test: /\.s?css$/,
				use: ['vue-style-loader', 'css-loader', 'sass-loader'],
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
}
