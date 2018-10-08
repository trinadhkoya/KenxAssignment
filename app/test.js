import _ from 'lodash';

let stateData = [{
	index: 4,
	lat: 334,
	long: 345,
	name: "qrpsw",
	time_rec: "2018-10-06T15:11:23.463Z",
	time_trans: "2018-10-06T15:11:23.463Z"
}];

let actionData = [{
	index: 4,
	lat: 334,
	long: 345,
	name: "qrpsw",
	time_rec: "2018-10-06T15:11:23.463Z",
	time_trans: "2018-10-06T15:11:23.463Z"
}, {
	index: 4,
	lat: 334,
	long: 345,
	name: "qrpsw",
	time_rec: "2018-10-06T15:11:23.463Z",
	time_trans: "2018-10-06T15:11:23.463Z"
}];

console.log(_.without(stateData, stateData));
