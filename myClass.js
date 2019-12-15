'use strict'

const MyClass = {
	prop: 'test',
	init() {
		return () => {
			console.log(this.prop);
		}
	}
};

export default MyClass;