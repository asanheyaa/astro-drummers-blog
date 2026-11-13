module.exports = {
	plugins: {
	  "postcss-pxtorem": {
		rootValue: 16,
		unitPrecision: 5,
		propList: ["*"],
		selectorBlackList: [], 
		minPixelValue: 3,
		mediaQuery: false,  
	  },
	},
  };