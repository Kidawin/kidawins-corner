
var html = '<div class="topbar"><a href="index.html">Home</a></div>';

html += '<div class="topbar"><a href="/works.html">My Stuff</a></div>'
var section1 = ['Media','Credits']//write one-word link names in this list
for (i = 0; i<section1.length; i++){
	html += '<div class="topbar"><a href="' + section1[i] + '.html">' + section1[i] + '</a></div>'
}



document.getElementById("topbar").innerHTML = html;