
function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}

function findtag(linkback){
	if(linkback.parentElement.className){
		return [linkback.parentElement.className,'class'];
	}else if(linkback.parentElement.id){
		return [linkback.parentElement.id, 'id'];
	}else{
		findtag(linkback.parentElement)
	}
}

function findNumber(elem,sentence,cat){
	if(cat==='class'){
		elems=document.getElementsByClassName(elem)
		for (var i = 0; i < elems.length; i++) {
			if(elems[i].innerText.indexOf(sentence)>(-1)){
				return i
			}
		}
	}else{
		elems=document.getElementById(elem)
		for (var i = 0; i < elems.length; i++) {
			if(elems[i].innerText.indexOf(sentence)>(-1)){
				return i
			}
		}
	}
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.action==='gettext'){
	var sentence = window.getSelection().toString();
	var linkback = getSelectionParentElement();
	const [elem,cat]=findtag(linkback);
	var number = findNumber(elem,sentence,cat);
	var linker = window.location.href;
	console.log(sentence);
	sendResponse({
        response: sentence,
        linker:linker,
        linkback:elem,
        number:number
    })
	}else if(message.action==='geturl'){
		var url=window.location.href
		console.log('djkl;aj')
		console.log(url)
		sendResponse({
        	url:url
    })
	}else if(message.action==='scrollto'){
		console.log('not ready')
		console.log('ready')
		var win=message.linker
		var elem=message.elem
		var cat= message.cat
		var number=message.number
		console.log('win');
		var cat = message.cat
		if(cat === 'class'){
			destination=document.getElementsByClassName(elem)[number]
		}else{
			destination=document.getElementById(elem)[number]
		}
		var destination=$.parseHTML(message.linkback)
		console.log(destination)
		destination.scrollIntoView()
		window.scrollBy(0, -50)
	}else if (msg.ready === "ready") {
		console.log('recieved')
		console.log(msg.ready)
    if (confirm('Do you want to capture the screen?')) {
        sendResponse({download : "download"});
    }
   }
});

// chrome.extension.onMessage.addListener(function(msg, sender, 
//    sendResponse) {

//    if (msg.ready === "ready") {
//     if (confirm('Do you want to capture the screen?')) {
//         sendResponse({download : "download"});
//     }
//    }

//    }); 

//chrome.runtime.sendMessage({greeting: "hello"}, function(response) {});
// chrome.runtime.onConnect.addListener((port) => {
//   port.onMessage.addListener((message) => {
//     if(message.action==='scrollto'){
// 		$(document).ready(function(){
// 		console.log('not ready'))}
// 		//chrome.tabs.update()
// 			console.log('ready')
// 			var win=message.linker
// 			var elem=message.elem
// 			var cat= message.cat
// 			var number=message.number
// 			console.log('win');
// 			var cat = message.cat
// 			if(cat === 'class'){
// 				destination=document.getElementsByClassName(elem)[number]
// 			}else{
// 				destination=document.getElementById(elem)[number]
// 			}
// 			var destination=$.parseHTML(message.linkback)
// 			console.log(destination)
// 			destination.scrollIntoView()
// 			window.scrollBy(0, -50)
	
// 	}
//   });
// });





function addFilter(){
	$('#filterUL').append('<li class="list-group-item">' + "<button class='btn btn-danger deleteURL btn-xs pull-xs-right' data-title='Delete' data-toggle='modal' data-target='#delete' ><span class='glyphicon glyphicon-trash'></span></button>" + $('#filter_add_key').val()  +'</li>');
	chrome.storage.local.get('urlfilter', function(result) {
		urls = result.urlfilter;
		urls.push($('#filter_add_key').val());
		obj = {}
		obj['urlfilter'] = urls;
		chrome.storage.local.set(obj, function() {
				chrome.extension.sendMessage({ cmd: "initiateUrlCheck" }); //toggle url check on all pages
    		});
    });
}
	// chrome.storage.local.get('urlfilter', function(result) {
	// 	urls = result.urlfilter;
	// 	if(urls == undefined){
	// 		chrome.storage.local.set({'urlfilter': []}, function() {
	// 	  			console.log(" default settings saved");
	// 	        });
	// 	}
	// 	else{
	// 		var arrayLength = urls.length;
	// 		for (var i = 0; i < arrayLength; i++) {
	// 			$('#filterUL').append('<li class="list-group-item">' + "<button class='btn btn-danger deleteURL btn-xs pull-xs-right' data-title='Delete' data-toggle='modal' data-target='#delete' ><span class='glyphicon glyphicon-trash'></span></button>" + urls[i]  +'</li>');
	// 		}
	// 	}
 //    });

function highlightText(text){
	findStatus = highlight(text);
	if(findStatus == -1){
		console.log("unable to save highlight. You possibly selected text over multiple elements")
		return;
	}
	if(new_page){
		pageurl = window.location.href;
		var obj = {};
		obj[pageurl] = [{"text":text, "color":"yellow"}] ;
		chrome.storage.local.set(obj, function() {
          new_page = false;
        });
	}
	else{
		chrome.storage.local.get(window.location.href, function (obj) {
			tempobj = obj[window.location.href];
			tempobj.push({"text":text, "color":"yellow"})
			obj = {}
			obj[window.location.href] = tempobj;
			chrome.storage.local.set(obj, function() {
        		});
       		});
	}
}


function removeHighlight(text){
	temp = getSelectedParent().parentNode.innerHTML;
    chrome.storage.local.get(window.location.href, function(items) {
	    for(i=0;i<items[window.location.href].length;i++){
	    	if(items[window.location.href][i].text.indexOf(text) !== -1){
	    		spantext = "<span class=\"highlight_markit\">"+items[window.location.href][i].text+"</span>";
	    		temp = temp.replace(spantext,items[window.location.href][i].text);
	    		getSelectedParent().parentNode.innerHTML = temp;
	    		items[window.location.href].splice(i,1);
	    		obj = {}
				obj[window.location.href] = items[window.location.href];
				chrome.storage.local.set(obj, function() {
	        		});

	    	}
		}
	});

}


function addManagementEntry(itemname, item){
	console.log(itemname);
	if(itemname == "urlfilter"){return;}
	pageCol = $(".panel").first().clone();
	pageCol.find('a')[0].innerHTML = itemname;
	pageCol.find('a').attr("href", itemname);
	for(entry in item){
		pageLi = pageCol.find('li').first().clone();
		pageLi[0].innerHTML =  "<button class='btn btn-danger deleteEntryButton btn-xs pull-xs-right' data-title='Delete' data-toggle='modal' data-target='#delete' ><span class='glyphicon glyphicon-trash'></span></button>" + item[entry].text;
		pageCol.find('ul').first().append(pageLi)
	}
	pageCol.find('li').first().remove()
	$( ".panel-group" ).append(pageCol);
}

function highlight(text){
    inputText = document.querySelector('body')
    var innerHTML = inputText.innerHTML
    var index = innerHTML.indexOf(text);
    if ( index >= 0 )
    {
        innerHTML = innerHTML.substring(0,index) + "<span class='highlight_markit'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML
    }
    return index
}


function getAllHighlights(){
	chrome.storage.local.get(null, function(items) {
		for(item in items){
			if(item !="deleteKey" && item !="highlightKey" && item != "inputGap"){
				addManagementEntry(item, items[item]);
			}
		}
		if(Object.keys(items).length != 0){
			$(".panel").first().remove()
		}
	});
}

function getSelectedText(){
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

function getSelectedParent() {
	if (window.getSelection) {
	  selection = window.getSelection();
	} else if (document.selection) {
	  selection = document.selection.createRange();
	}
	var parent = selection.anchorNode;
	return parent.parentNode;
}

