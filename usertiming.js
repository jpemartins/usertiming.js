(function () {
	var navStart = performance.timing.navigationStart
	  , fetchStart = performance.timing.fetchStart;

	/* DOMHighResTimeStamp is the relative time to navigationStart
	 * The precision of the timer is down to a tenth of a milisecond (double value)
     */
	var tick = !!window["DOMHighResTimeStamp"] ? performance.now : (function () {
		return Date.now() - navStart;
	});

	var marks = {}, measures = {};

	var entries = {
		'marks': marks
	  , 'measures': measures
	}

	performance.__proto__.mark = function (name) {
		if (name in performance.timing) {
			throw new Error("mark name not allowed");
		}

		(marks[name] = marks[name] || []).push(tick());
	}

	performance.__proto__.getMarks = function (name) {
		return marks[name] || marks;
	}

	performance.__proto__.clearMarks = function (name) {
		if (!name) {
			return (marks = {});
		}
		
		marks[name] = [];
	}

	performance.__proto__.measure = function (name, startMark, endMark) {
		if (!measures[name]) {
			measures[name] = [];	
		}

		if (!marks[startMark]) {
			measures[name].push(Date.now() - fetchStart);	
			return;
		}

		var startIdx, endIdx, evalue, length;

		startIdx = (marks[startMark] || []).length - 1;
		endIdx = (marks[endMark] || []).length - 1;

		evalue = marks[endMark] !== undefined ? marks[endMark][endIdx] : fetchStart;

		measures[name].push(marks[endMark][endIdx] - marks[startMark][startIdx]);
	}

	performance.__proto__.getMeasures = function (name) {
		return measures[name] || measures;
	}

	performance.__proto__.clearMeasures = function (name) {
		if (!name) {
			return (measures = {});
		}
		
		measures[name] = [];
	}
}());

