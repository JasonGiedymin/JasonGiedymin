ENGINE.avatarIndex = 0;

ENGINE.asUrl = function (fileName) {
	return "url(img/" + fileName + ")";
};

//var index = Math.floor(Math.random() * (ENGINE.Images.length-1 - 0 + 1)) + 0;

var DEF_AVATAR = 'na2.png';

ENGINE.Avatars = [
	['python', 'python-logo.png'],
	['ruby', 'ruby.png'],
	['java', 'java.png'],
	['C++', 'cpp.png'],
	['C', 'c.jpg'],
	['Objective-C', 'obj-c.png'],
	['C#', DEF_AVATAR],
	['scala', DEF_AVATAR],
	['perl', DEF_AVATAR],
	['php', DEF_AVATAR],
	['html5', DEF_AVATAR],
	['css3', DEF_AVATAR],
	['haml', DEF_AVATAR],
	['less', DEF_AVATAR],
	['sass', DEF_AVATAR],
	['javascript', DEF_AVATAR],
	['coffeescript', DEF_AVATAR],
	['sql', DEF_AVATAR],

	['rails', DEF_AVATAR],
	['flask', DEF_AVATAR],
	['express', DEF_AVATAR],
	['pyramid', DEF_AVATAR],
	['rails', DEF_AVATAR],
	['lift', DEF_AVATAR],
	['gae', DEF_AVATAR],
	['play', DEF_AVATAR],
	['struts', DEF_AVATAR],

	['nodejs', DEF_AVATAR],
	['chef', DEF_AVATAR],
	['puppet', DEF_AVATAR],
	['fabric', DEF_AVATAR],

	['hadoop', DEF_AVATAR],
	['mongodb', DEF_AVATAR],
	['cassandra', DEF_AVATAR],

	['ats', DEF_AVATAR],
	['nginx', DEF_AVATAR],

	['android', DEF_AVATAR],
	['ios', DEF_AVATAR],

	['c10k', DEF_AVATAR],
	['open source		', DEF_AVATAR],
]

ENGINE.getNextAvatar = function() {
	// if (ENGINE.avatarIndex === ENGINE.Avatars.length)
	// 	ENGINE.avatarIndex = 0;

	var index = Math.floor(Math.random() * (ENGINE.Avatars.length));

	// return ENGINE.Avatars[ENGINE.avatarIndex++];
	return ENGINE.Avatars[index];
}
