$(document).ready(function(){

var idToNodeMap = {};
var root = null;

var tree_in_store=JSON.parse(localStorage.getItem('tree_in_store'))
console.log('starting list')
console.log(tree_in_store)
var width=localStorage.getItem('width')
var height=localStorage.getItem('height')
if(width=="undefined" || width=="null"|| width==null || width==undefined){
  $('width').val(1060)
  localStorage.setItem('width',1060)
}else{
  $('width').val(Number(width))
}
if(height=="undefined" || height=="null"|| height==null || height==undefined){
  $('height').val(500)
  localStorage.setItem('height',500)
}else{
  $('height').val(Number(height))
}

if(tree_in_store=="undefined" || tree_in_store=="null"|| tree_in_store==null || tree_in_store==undefined){
console.log('tree not yet set')
var counter=localStorage.getItem('counter')
if(counter=="undefined" || counter=="null"|| counter==null || counter==undefined){
  localStorage.setItem('counter', 1);
}
var d = [{
          "_id": "p1",
          "text": "Parent-1",
          "name": "Parent-1",
          "status":"blue"
        }];
        var filters2 = JSON.stringify(d)
        localStorage.setItem('tree_in_store', filters2);
        var tree=make_tree(d,idToNodeMap,root)
        var width=localStorage.getItem('width')
        var height=localStorage.getItem('height')
        update(tree,'just_loaded',width,height)
        var svgs=document.getElementsByTagName('svg')
        if(svgs.length>1){
          svgs[1].remove()
        }
        }else{
          console.log('stored');
          var tree=make_tree(tree_in_store,idToNodeMap,root);
          console.log('tree made');
          console.log(tree);
          var width=localStorage.getItem('width');
          var height=localStorage.getItem('height');
          update(tree,'just_loaded',width,height);
          //update(tree,'just_loaded')
          var svgs=document.getElementsByTagName('svg');
        if(svgs.length>1){
          svgs[1].remove();
        }
        };




function get_rid_of_duplicate_text_areas(){
  console.log('remove duplicate')
    var textareas=document.getElementsByClassName('tooltip0')
    var l=textareas.length
    if(textareas){
      if(l>1){
        var to = l-1
        for(var i = 0; i < to; i++) {
          if(textareas[i].getElementsByTagName('textarea').length!==0){
            textareas[i].remove();
          }
        }
      }
    }
    var textareas=document.getElementsByClassName('tooltip')
    var l=textareas.length
    console.log('length');
    console.log(l)
    if(textareas){
      if(l>1){
        var to = l-1;
        for(var i = 0; i < to; i++) {
        if(textareas[i].getElementsByTagName('textarea').length!==0){
          textareas[i].remove();
        }
      }
    }
  }
}



function make_tree(data,idToNodeMap,root){
  console.log('making tree')
  console.log(root)
  console.log(idToNodeMap)
  console.log(data)
    for(var i = 0; i < data.length; i++) {
        var datum = data[i];
        console.log(i)
        console.log(datum)
        datum.children = [];
        idToNodeMap[datum._id] = datum;
        if(typeof datum.parentAreaRef === "undefined") {
            root = datum;
        } else {
            parentNode = idToNodeMap[datum.parentAreaRef.id];
            parentNode.children.push(datum);
        }
    }
    return root
}


$('#clear').click(function() {
  localStorage.clear();
  console.log('clearing');
  localStorage.setItem('counter', 1);
  var d =  [{
          "_id": "p1",
          "text": "Parent-1",
          "name": "Parent-1",
          "status":"blue"
        }];
  var filters2 = JSON.stringify(d);
  localStorage.setItem('tree_in_store', filters2);
  var tree=make_tree(d,idToNodeMap,root);
  var width=localStorage.getItem('width');
  var height=localStorage.getItem('height');
  update(tree,'reload',width,height);
  //update(tree,'reload');
});

function init(done_yet){
  if(done_yet==='already_done'){
      localStorage.setItem('done_yet','not_done');
    }else{
    console.log('is this executing');
    screenshot.initEvents();
    console.log(' executing');
    localStorage.setItem('done_yet','already_done');
  }
}

var screenshot = {
    content : document.createElement("canvas"),
    data : '',
    saveScreenshot : function() {
    var image = new Image();
    image.onload = function() {
        var canvas = screenshot.content;
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        // save the image
        var link = document.createElement('a');
        var pos=localStorage.getItem('branch_in_store');
        var tree=JSON.parse(localStorage.getItem('tree_in_store'));
        var name=tree[0].name
        link.download = pos+"_"+name+"_"+".YnP.png";
        link.href = screenshot.content.toDataURL();
        link.click();
        screenshot.data = '';
    };
    image.src = screenshot.data;
    },
    initEvents : function() {
      console.log('now this should go');
      console.log('does this stop here');
        chrome.tabs.captureVisibleTab(null, {
            format : "png",
            quality : 100
        }, function(data) {
          console.log('what about this executing?');
            screenshot.data = data;
            // send an alert message to webpage
            chrome.tabs.query({
                active : true,
                currentWindow : true
            }, function(tabs) {
              console.log('ok but is this executing?');
                chrome.tabs.sendMessage(tabs[0].id, {ready : "ready"},
            function(response) {
                        screenshot.saveScreenshot();
                                        });
            });
          });
      }
    };

$('#pic').click(function(){
  console.log('pic');
  console.log('shouldhaveworked');
  var pos=localStorage.getItem('branch_in_store');
  var tree=JSON.parse(localStorage.getItem('tree_in_store'));
  for(var i = 0; i < tree.length; i++){
    console.log(i)
    if(tree[i]['_id']==pos){
      var name=tree[0].name;
      tree[i]['pic']="/Users/Deirdreclarkson/js/json_files/"+pos+"_"+name+"_"+".YnP.png";
      console.log('set');
    }
  }
  localStorage.setItem('tree_in_store',JSON.stringify(tree));
  var done_yet=localStorage.getItem('done_yet');
  init(done_yet);
// var imgs = svg.select("#sup_img").data([0]);
//     imgs.enter()
//         .append("img")
//         .attr("xlink:href", "@Url.Content("~/Content/images/icons/refresh.png")")
//         .attr("x", "60")
//         .attr("y", "60")
//         .attr("width", "20")
//         .attr("height", "20");
})


remove_node=function(){
  var pos=localStorage.getItem('branch_in_store');
    console.log(pos);
    var tree = JSON.parse(localStorage.getItem('tree_in_store'));
    for(var i = 0; i < tree.length; i++) {
        var datum = tree[i];
        if(datum._id==pos){
          console.log(datum);
          tree.splice(i, 1);
        }
      }

    localStorage.setItem('tree_in_store',JSON.stringify(tree));
    var treenew=make_tree(tree,idToNodeMap,root);
    console.log('updated');
    console.log(treenew);
    var width=localStorage.getItem('width');
    var height=localStorage.getItem('height');
    update(treenew,'reload',width,height);
    //update(treenew,'reload')
    get_rid_of_duplicate_text_areas();
}

$('#remove').click(function(){
  remove_node();
});

function plotHistogram(element, input) {
      var keys = Object.keys(input);
      var values = Object.values(input);
      var w = 700;
      var h = 400;
      var margin = 40;
      var dataset = [];

      for(var i = 0; i < keys.length; i++) {
        dataset.push({key:keys[i],value:values[i]});
      }
      console.log('data should be here');
      console.log(dataset);
      var key = function(d) {
        return d.key;
      };

      var value = function(d) {
        return d.value;
      };

      var svg = d3.select(element)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

      var xScale = d3.scale.ordinal()
              .domain(d3.range(1,dataset.length+1))
              .rangeRoundBands([40, w], 0.05);

      var yScale = d3.scale.linear()
                           .domain([0, d3.max(values)])
                           .range([h-margin, 0]);

      var x_axis = d3.svg.axis().scale(xScale);
      var y_axis = d3.svg.axis().scale(yScale).orient("left");

      d3.select(element).select("svg")
        .append("g")
          .attr("class","x axis")
          .attr("transform","translate(0,"+(h-margin)+")")
        .call(x_axis);

      d3.select(element).select("svg")
        .append("g")
          .attr("class","y axis")
          .attr("transform","translate("+margin+",0)")
        .call(y_axis);

      //Create bars
      svg.selectAll("rect")
         .data(dataset, key)
         .enter()
         .append("rect")
         .attr("x", function(d, i) {
          return xScale(keys[i]);
         })
         .attr("y", function(d) {
          return yScale(d.value);
         })
         .attr("width", xScale.rangeBand())
         .attr("height", function(d) {
          return (yScale(0) - yScale(d.value));
         })
         .attr("fill", function(d) {
          return "rgb(96, 0, " + (d.value * 10) + ")";
         });

      //Create labels
      svg.selectAll("text")
         .data(dataset, key)
         .enter()
         .append("text")
         .text(function(d) {
          return d.value;
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
         })
         .attr("y", function(d) {
          return yScale(d.value) + 14;
         })
         .attr("font-family", "sans-serif") 
         .attr("font-size", "11px")
         .attr("fill", "white");

}


function get_rid_of_duplicate_histogram(){
    console.log('remove duplicate')
    var textareas=document.getElementById('scores_plot').getElementsByTagName('svg');
    console.log(textareas)
    var l=textareas.length
    console.log('length');
    console.log(l)
    if(textareas){
      if(l>1){
        var to = l-1;
        for(var i = 0; i < to; i++) {
          console.log(i)
          if(textareas[i].length!==0){
            textareas[i].remove();
          }
      }
    }
  }
}

function add_score(done_yet){
  if(done_yet==='already_done'){
    localStorage.setItem('done_yet','not_done');
  }else{
    var tree=JSON.parse(localStorage.getItem('tree_in_store'));
    var link=localStorage.getItem('link_in_store');
    for(var i = 0; i < tree.length; i++) {
        var datum = tree[i];
        console.log(datum._id);
        console.log(link);
        if(Number(datum._id)===Number(link)){
          console.log(datum);
          score=$('#score').val();
          console.log('score supposed to enter here');
          console.log(score);
          if(score){
          if(datum.scores=="undefined" || datum.scores=="null"|| datum.scores==null || datum.scores==undefined){
            tree[i].scores={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0};
            tree[i].scores[score]+=1
            var scores=tree[i].scores
          }else{
            tree[i].scores[score]+=1
            var scores=tree[i].scores
          }
        }
      }
    }
    localStorage.setItem('tree_in_store',JSON.stringify(tree));
    localStorage.setItem('done_yet','already_done');
    if($('#plot_scores').is(":checked")){
      console.log('score supposed to be here');
      console.log(scores);
      plotHistogram("#scores_plot", scores);
      get_rid_of_duplicate_histogram();
    }
  }
}

getit=function(){
    var msg={
      action:'gettext'
    }
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
          if(response){
          console.log(response)
            //console.log(response.response);//You have to choose which part of the response you want to display ie. response.response
            if(response.response!=""){
            var sentence = response.response;
          }
            var linkback = response.linkback;
            var linker = response.linker;
            var number=response.number;
            var cat=response.cat;
          }
            if(sentence=="undefined" || sentence=="null"|| sentence==null || sentence==undefined){
              console.log('no input')
            }else{
              var sentences=sentence.match(/.{1,100}/g);
              var sentence=sentences.join('\n')
            }
            newData=JSON.parse(localStorage.getItem('tree_in_store'));
            //newData=newData.pop();
            //var pos=JSON.parse(localStorage.getItem('branch_in_store'))._id
            var pos=localStorage.getItem('branch_in_store')
            console.log('position')
            console.log(pos)
            if ($('#check_id').is(":checked")){var colour='red'}else{var colour='blue'}
            console.log(colour)
          if(sentence){
            newData.push({"_id": Number(localStorage.getItem('counter'))+1,
                                "parentAreaRef": {"id":pos},
                                "text": sentence,
                                "name": sentence.substr(0,9),
                                "status":colour,
                                "linker":linker,
                                "linkback":linkback,
                                "number":number,
                                "cat":cat,
                                'scores':{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
                              })
          }else{
            newData.push({"_id": Number(localStorage.getItem('counter'))+1,
                                "parentAreaRef": {"id":pos},
                                "text": "empty",
                                "name": "empty",
                                "status":colour,
                                'scores':{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
                              })
          }
            var last_element = newData[newData.length - 1];
            last_element._id=Number(last_element._id)-1
            console.log('why isnt this changing')
            console.log(last_element._id)
            var second_last = newData[newData.length - 2];
            console.log('checking for duplicate')
            console.log(last_element)
            console.log(second_last)
            if((last_element._id-1)===second_last._id){
              newData.pop();
              console.log('duplicate')
          }else{
            console.log('not duplicate')
          }
            console.log('newdata')
            console.log(newData)
            localStorage.setItem('tree_in_store',JSON.stringify(newData))
            console.log('add node')
            var v=make_tree(newData,idToNodeMap,root)
            console.log(v)
            var width=localStorage.getItem('width')
            var height=localStorage.getItem('height')
            update(v,'reload',width,height)
            //update(v,'reload')
            localStorage.setItem('counter', Number(localStorage.getItem('counter'))+1)
            });
          });
          get_rid_of_duplicate_text_areas()
}



$('#btnCreate').click(function() {
            getit()
        });

function connect() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(msg);
    // port.onMessage.addListener((response) => {
    //   html = response.html;
    //   title = response.title;
    //   description = response.description;
    // });
  });
}



function gothere(done_yet) {
  if(done_yet==='already_done'){
    localStorage.setItem('done_yet','not_done')
  }else{
  var linkback=localStorage.getItem('linkback');
  var linker=localStorage.getItem('linker');
  var number=localStorage.getItem('number');
  var cat =localStorage.getItem('cat')
  //chrome.tabs.create({ url: linker, active: true});
      var msg={
        action:'scrollto',
        linker:linker,
        linkback:linkback,
        number:number,
        cat:cat
      }
    // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, msg);
    //   });
    // chrome.tabs.create({ url: linker }, function(tab) {
    //     //chrome.tabs.sendMessage(tab.id, msg);
    //     connect(msg);
    // });
    chrome.tabs.create({ url: linker }, function(tab) {
    // Why do you query, when tab is already given?
    chrome.tabs.executeScript(tab.id, {file:"jquery-3.1.0.min.js"}, function() {
      // This executes only after jQuery has been injected and executed
      chrome.tabs.executeScript(tab.id, {file:"content.js"}, function() {
        // This executes only after your content script executes
        chrome.tabs.sendMessage(tab.id, msg);
      });
    });
  });
  localStorage.setItem('done_yet','already_done')
  }
}


$('#gototext').click(function() {
  var done_yet=localStorage.getItem('done_yet');
  gothere(done_yet)
});


function flatten(items, result = []) {
  if (items.length) {
    var item = items.shift();
  if(item.parentAreaRef){
    result.push({
      _id: item._id,
    name:item.name,
    status:item.status,
    text:item.text,
    parentAreaRef:item.parentAreaRef,
    linkback:item.linkback,
    linker:item.linker,
    pic:item.pic
    });
  }else{
    result.push({
      _id: item._id,
    name:item.name,
    text:item.text,
    status:item.status,
    linker:item.linker,
    linkback:item.linkback,
    pic:item.pic
    }); 
}
    if (item.children && item.children.length) {
      result = flatten(item.children, result);
    }
    return flatten(items, result);
  } else {
    return result;
  }
}

function change_counter(){
  var tree=JSON.parse(localStorage.getItem('tree_in_store'));
  list=[]
  for(var i = 0; i < tree.length; i++){
    list.push(Number(tree[i]['_id']))
  }
  localStorage.setItem('counter',d3.max(list)+1)
}


$('#upload').click(function() {
  console.log('up')
  function readTextFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
              try{
                var allText = rawFile.responseText;
                var tree=JSON.parse(allText);
              }catch(err){
                console.log(err.message)
                var message=err.message;
                var regex = /\d+/g;
                var matches = message.match(regex)
                console.log(matches)
                var allText = rawFile.responseText;
                alert('Unrecognised character(s) at this part of the file: "'+allText.slice(Number(matches[0]),Number(matches[0])+100)+'"')
              }
                var treenew=flatten([tree]);
                console.log(treenew);
                var width=localStorage.getItem('width');
                var height=localStorage.getItem('height');
                update(tree,'reload',width,height);
                //update(tree,'reload');
                localStorage.setItem('tree_in_store', JSON.stringify(treenew));
                change_counter();
            }
        }
    }
    rawFile.send(null);
  }
  console.log(readTextFile("file://"+$('#path').val()))
})

$('#upload_branch').click(function() {
  console.log('up')
  function readTextFile(file,done_yet){
    if(done_yet==='already_done'){
      localStorage.setItem('done_yet','not_done');
    }else{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                console.log(allText.slice(23700,23800));
                console.log(allText.slice(8090,8110));
                var tree=JSON.parse(allText);
                var treenew=flatten([tree]);
                treeold=JSON.parse(localStorage.getItem('tree_in_store'));
                list=[]
                for(var i = 0; i < treeold.length; i++){
                  list.push(Number(treeold[i]['_id']));
                }
                var branch_in_store=localStorage.getItem('branch_in_store');
                var max_id=d3.max(list)+1;
                for(var i = 0; i < treenew.length; i++){
                  if(treenew[i]['_id']==="p1"){
                    console.log('point')
                    treenew[i]['_id']=max_id;
                    treenew[i]['parentAreaRef']={id:Number(branch_in_store)}
                    console.log(treenew[i])
                  }else{
                    console.log('adding');
                    console.log(Number(treenew[i]['_id']));
                    console.log(Number(treenew[i]['_id'])+max_id);
                    console.log(treenew[i]['parentAreaRef']['id']+max_id);
                    treenew[i]['_id']=Number(treenew[i]['_id'])+max_id;
                    if(treenew[i]['parentAreaRef']['id']==="p1"){
                      console.log('parent children');
                      treenew[i]['parentAreaRef']['id']=max_id;
                      console.log(treenew[i]);
                    }else{
                      treenew[i]['parentAreaRef']['id']=Number(treenew[i]['parentAreaRef']['id'])+max_id;
                    }
                  }
                  treeold.push(treenew[i]);
                }
                var idToNodeMap = {};
                var root = null;
                var tree=make_tree(treeold,idToNodeMap,root);
                console.log(treeold);
                var width=localStorage.getItem('width');
                var height=localStorage.getItem('height');
                update(tree,'reload',width,height);
                //update(tree,'reload');
                localStorage.setItem('tree_in_store', JSON.stringify(flatten([tree])));
                change_counter();
            }
        }
    }
    rawFile.send(null);
    localStorage.setItem('done_yet','already_done');
  }
  }
  var done_yet=localStorage.getItem('done_yet');
  console.log(readTextFile("file://"+$('#path').val(),done_yet));
})

function list_to_tree(list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
        map[list[i]._id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        console.log(node)
        console.log(node.parentAreaRef)
        if (node.parentAreaRef.id !== "0") {
            node._id=Number(node._id)
            node.parentAreaRef.id=Number(node.parentAreaRef.id)
            console.log(list[map[node.parentAreaRef]])
            list[map[node.parentAreaRef.id]].children.push(node);
            console.log(roots)
        } else {
            roots.push(node);
        }
    }
    return roots;
}

$('#upload_scraped').click(function() {
  console.log('up')
  function readTextFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                var tree=JSON.parse(allText);
                console.log(tree)
                //var treenew=flatten([tree]);
                localStorage.setItem('tree_in_store', JSON.stringify(tree));
                change_counter();
                var treenew=list_to_tree(tree)
                var width=localStorage.getItem('width');
                var height=localStorage.getItem('height');
                update(tree,'reload',width,height);
            }
        }
    }
    rawFile.send(null);
  }
  console.log(readTextFile("file:///Users/Deirdreclarkson/js/json_files/test.json"))
//   d3.csv("file:///Users/Deirdreclarkson/js/ynp/links.csv", function(data) {
//     console.log(data)
//   dataset = data.map(function(d) { console.log(d); });
// });
})


$('#add_score').click(function() {
  add_score(localStorage.getItem('done_yet'));
})

$('#resize').click(function(){
  //setTimeout(function(){console.log('WAITNG');}, 300);
  var tree=JSON.parse(localStorage.getItem('tree_in_store'));
  var treenew=make_tree(tree,idToNodeMap,root);
  var width=$('#width').val()
  if(width){
    console.log(width)
    localStorage.setItem('width',width)
  }else{
    var width=localStorage.getItem('width')
    localStorage.setItem('width',width)
  }
  console.log('width')
  console.log(width)
  var height=$('#height').val()
   if(height){
    console.log(height)
    localStorage.setItem('height',height)
  }else{
    var height=localStorage.getItem('height')
    localStorage.setItem('height',height)
  }
  
  update(treenew,'reload',width,height)
})


function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}


function download_json(done_yet){
  if(done_yet==='already_done'){
    localStorage.setItem('done_yet','not_done');
  }else{
    var tree_in_store=JSON.parse(localStorage.getItem('tree_in_store'));
    var v=make_tree(tree_in_store,idToNodeMap,root);
    var data = encode(JSON.stringify(v, null, 4));
    var blob = new Blob([data], {type: 'application/octet-stream'});
    var url = URL.createObjectURL(blob);
    console.log(tree_in_store[0].name.split(' ').join('_')+'.YnP.json');
    chrome.downloads.download({
      url: url, // The object URL can be used as download URL
      filename: String(tree_in_store[0].name.split(' ').join('_')+'.YnP.json')
  });
    localStorage.setItem('done_yet','already_done')
  }
}

$('#download').click(function(){

    // var tree_in_store=JSON.parse(localStorage.getItem('tree_in_store'));
    // var v=make_tree(tree_in_store,idToNodeMap,root);
    // var data = encode(JSON.stringify(v, null, 4));
    // var blob = new Blob( [ data ], {
    //     type: 'application/octet-stream'
    // });
    // url = URL.createObjectURL( blob );
    // var link = document.createElement( 'a' );
    // link.setAttribute( 'href', url );
    // link.setAttribute( 'download', 'example.json' );
    // var event = document.createEvent( 'MouseEvents' );
    // event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    // link.dispatchEvent( event );
//     var saveData = (function () {
//     var a = document.createElement("a");
//     document.body.appendChild(a);
//     a.style = "display: none";
//     return function (data, fileName) {
//         var json = JSON.stringify(data),
//         blob = new Blob([json], {type: "octet/stream"}),
//         url = window.URL.createObjectURL(blob);
//         a.href = url;
//         a.download = fileName;
//         a.click();
//         window.URL.revokeObjectURL(url);
//     };
// }());
//     fileName = "/Users/Deirdreclarkson/js/json_files/my-download.json";
//     saveData(data, fileName);

var done_yet=localStorage.getItem('done_yet');
download_json(done_yet)

});

$('#save').click(function(){
    var newNamediv=document.getElementsByClassName('tooltip0')
    for(var take = 0; take < newNamediv.length; take++) {
      if(newNamediv[take].getElementsByTagName('textarea').length>0){
        var newName=newNamediv[take].getElementsByTagName('textarea')[0].value
      }
    }
    var newTextdiv=document.getElementsByClassName('tooltip')
    for(var take = 0; take < newTextdiv.length; take++) {
      if(newTextdiv[take].getElementsByTagName('textarea').length>0){
        var newText=newTextdiv[take].getElementsByTagName('textarea')[0].value
      }
    }
    console.log('newText')
    console.log(newText)
    var pos=localStorage.getItem('branch_in_store')
    console.log(pos)
    var tree = JSON.parse(localStorage.getItem('tree_in_store'))
    if(newText){
    for(var i = 0; i < tree.length; i++) {
        var datum = tree[i];
        if(datum._id==pos){
          console.log(datum)
          tree[i].text=newText
          tree[i].name=newName
        }
      }
    }
    localStorage.setItem('tree_in_store',JSON.stringify(tree));
    var treenew=make_tree(tree,idToNodeMap,root);
    console.log('updated');
    console.log(treenew);
    var width=localStorage.getItem('width');
    var height=localStorage.getItem('height');
    update(treenew,'reload',width,height);
    //update(treenew,'reload')
    get_rid_of_duplicate_text_areas();
});


function findObjectById(root, id) {
    if (root.children) {
        for (var k in root.children) {
            if (root.children[k].id == id) {
                return root.children[k];
            }
            else if (root.children.length) {
                return findObjectById(root.children[k], id);
            }
        }
    }
};

function centerNode(source) {
  var zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
  t = d3.zoomTransform(d3.select("#container").node());
  x = -source.y0;
  y = -source.x0;
  x = x * t.k + viewerWidth / 2;
  y = y * t.k + viewerHeight / 2;
  console.log(x)
  console.log(y)
  d3.select('svg').transition().duration(duration).call( zoomListener.transform, d3.zoomIdentity.translate(x,y).scale(t.k) );
}

function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// function centerNode(source) {

//   var width_update=localStorage.getItem('width');
//   var height_update=localStorage.getItem('height');
//   var margin = {top: 20, right: 120, bottom: 20, left: 120},
//             width = Number(width_update) - margin.right - margin.left,
//             height = Number(height_update) - margin.top - margin.bottom;
//     var zoomListener = d3.behavior.zoom().scaleExtent([width, height]).on("zoom", zoom);
//     scale = zoomListener.scale();
//     x = -source.x;
//     y = -source.y;
//     console.log('look here')
//     console.log(x)
//     x = x * scale + width/2;
//     y = y * scale + height/2;
//     d3.select("#container").transition()
//         .duration(750)
//         .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
//     zoomListener.scale(scale);
//     zoomListener.translate([x, y]);
// }


function searchTree(element, matchingTitle){
    console.log('is this working?')
    console.log(element.name)
     if(element.name === matchingTitle){
          console.log(element.name)
          return element;
     }else if (element.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.children.length; i++){
               result = searchTree(element.children[i], matchingTitle);
          }
          return result;
     }
}

$("#search").click(function() {
    var tree=JSON.parse(localStorage.getItem('tree_in_store'))
    var obj=make_tree(tree,idToNodeMap,root);
    var matchingTitle=$('#path').val()
    console.log(matchingTitle)
    var paths = searchTree(obj,matchingTitle);
    console.log(paths.x0);
    centerNode(paths);
    // if(typeof(paths) !== "undefined"){
    //   openPaths(paths);
    // }
    // else{
    //   alert(e.object.text+" not found!");
    // }
  })





// function searchTree(obj,search,path){
//   var tree=JSON.parse(localStorage.getItem('tree_in_store'))
//   var obj=make_tree(tree,idToNodeMap,root);
//     if(obj.name === search){ //if search is found return, add the object to the path and return it
//       path.push(obj);
//       return path;
//     }
//     else if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
//       var children = (obj.children) ? obj.children : obj._children;
//       for(var i=0;i<children.length;i++){
//         path.push(obj);// we assume this path is the right one
//         var found = searchTree(children[i],search,path);
//         if(found){// we were right, this should return the bubbled-up path from the first if statement
//           return found;
//         }
//         else{//we were wrong, remove this parent from the path and continue iterating
//           path.pop();
//         }
//       }
//     }
//     else{//not the right object, return false so it will continue to iterate in the loop
//       return false;
//     }
// }

// function searchTree(element, matchingTitle){
//      if(element.id == matchingTitle){
//           return element;
//      }else if (element.children != null){
//           var i;
//           var result = null;
//           for(i=0; result == null && i < element.children.length; i++){
//                result = searchTree(element.children[i], matchingTitle);
//           }
//           return result;
//      }
//      return null;
// }

function getNodeById(id, node){
    var reduce = [].reduce;
    function runner(result, node){
        if(result || !node) return result;
        return node.id === id && node || //is this the proper node?
            runner(null, node.children) || //process this nodes children
            reduce.call(Object(node), runner, result);  //maybe this is some ArrayLike Structure
    }
    return runner(null, node);
}

var getParent = function (rootNode, rootId) {
  if (rootNode.id === rootId)
      return rootNode;
  //for (var i = 0; i < rootNode.children.length; i++) -- original code line not working first time 
  for (var i = 0; i < rootNode.length; i++) {
      var child = rootNode[i];
      if (child.id === rootId)
          return child;
      if (typeof child.children !== 'undefined')
          var childResult = getParent(child, rootId);
      if (childResult != null) return childResult;
  }
  return null;
};



function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        lineHeight = 1.1, // ems
        tspan = text.text(null).append("tspan").attr("x", function(d) { return d.children || d._children ? -10 : 10; }).attr("y", y).attr("dy", dy + "em");     
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            var textWidth = tspan.node().getComputedTextLength();
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                ++lineNumber;
                tspan = text.append("tspan").attr("x", function(d) { return d.children || d._children ? -10 : 10; }).attr("y", 0).attr("dy", lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}


var toggleColor = (function(){
   var currentColor = "white";
    
    return function(){
        currentColor = currentColor == "white" ? "magenta" : "white";
        d3.select(this).style("fill", currentColor);
    }
})();



function textshow(element) {
  var div0 = d3.select("#text").append("div")
    .attr("class", "tooltip0")
    .style("opacity", 0);
  var div = d3.select("#text").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
      div0.transition()
        .duration(200)
        .style("opacity", .9);
      
        // .style("left", (d3.event.pageX) + "px")
        // .style("top", (d3.event.pageY - 28) + "px");
      div.transition()
        .duration(200)
        .style("opacity", .9);
        var img_container=document.getElementById('sup_img')
        var im =img_container.firstElementChild
        if(im==="undefined" || im=="null"|| im==null || im==undefined){
          console.log('here')
          document.getElementById('sup_img').className="col-lg-12"
          document.getElementById('text').className="col-lg-12"
          div0.html("<textarea style='width:200px;height:30px' >"+element.name+"</textarea>")
          div.html("<textarea style='width:600px;height:100px' >"+element.text
          +"</textarea>"
          )
        }else{
          console.log('there')
          document.getElementById('sup_img').className="col-xs-5"
          document.getElementById('text').className="col-sm-4"
          div0.html("<textarea style='width:100px;height:30px' >"+element.name+"</textarea>")
        div.html("<textarea style='width:300px;height:100px' >"+element.text
          +"</textarea>")
          // .style("left", (d3.event.pageX) + "px")
          // .style("top", (d3.event.pageY - 28) + "px");
        }
          get_rid_of_duplicate_text_areas()
          //$('.valid:nth-child(n+2)').remove();

    }

  // var imgs = d3.select("#sup_img");
  // if(element.pic){
  // var pic = element.pic;
  // console.log(pic);
  // imgs.append("img")
  //     .attr("xlink:href", "/Users/Deirdreclarkson/js/41.png")
  //     .attr("x", "60")
  //     .attr("y", "60")
  //     .attr("width", "20")
  //     .attr("height", "20");
  //   }

function showpic(element){
  if(element.pic){
    var textareas = document.getElementById('sup_img');
    //var textareas = preview.querySelector('img');
    console.log('remove duplicate');
    //var textareas=document.getElementById('scores_plot').getElementsByTagName('svg');
    console.log(textareas);
    var im=textareas.querySelector('img');
    console.log('length');
    console.log(im);
    if(im=="undefined" || im=="null"|| im==null || im==undefined){
      console.log('help')
          textareas.innerHTML='<img src="file://localhost'+element.pic+'" height="200" alt="Image preview...">';
      }else{
        console.log('help3');
        im.remove();
        textareas.innerHTML='<img src="file://localhost'+element.pic+'" height="200" alt="Image preview...">';
      }
  }else{
    document.getElementById('sup_img').querySelector('img').remove();
  }
}


function update(treeData,just_loaded,width_update,height_update) {
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = Number(width_update) - margin.right - margin.left,
            height = Number(height_update) - margin.top - margin.bottom;
  var i = 0,
    duration = 750,
    root;

  var tree = d3.layout.tree()
    .size([height, width]);
  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
  var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("xmlns", "chrome-extension://omgabkdfhmnjnifpeobfghhlfijegomi/popup.html");
  if(just_loaded==='just_loaded'){
      console.log('just_loaded');
      //svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }else{
    d3.select("svg").remove();
    d3.selectAll("g > *").remove();
  }
  root = treeData;
  root.x0 = height / 2;
  root.y0 = 0;
  var source=root;
  console.log('updating');
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);
  nodes.forEach(function(d) { d.y = d.depth * 180; });
  // Update the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); })

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .style("fill", function(d) { return d.status; })
    .on('click', function(element){
      //clickHandler(element);
      //centerNode(element)
      click(element);
      textshow(element);
      showpic(element);
  })

  nodeEnter.append("circle")
    .attr("r", 1e-6);
  nodeEnter.append("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6)

  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
   // .style("fill", function(d) { return d.data.status; });
  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d.status; })
    //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
  nodeUpdate.select("text")
    .style("fill-opacity", 1);
  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();
  nodeExit.select("circle")
    .attr("r", 1e-6);
  nodeExit.select("text")
    .style("fill-opacity", 1e-6);
  // Update the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });
  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
    }).on("click", function(d) { 
      d3.select(this).style("stroke","grey"); 
      console.log(d.source.name);
      localStorage.setItem('link_in_store',d.target._id);

  }).on("mouseout", function() {
    d3.select(this).style("stroke","lightgrey"); 
});
  link.transition()
    .duration(duration)
    .attr("d", diagonal);
  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
    })
    .remove();
  // Stash the old positions for transition.
  nodes.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });
  //nodes.name {cursor : pointer}
}

say=function(){
  if (d3.event.shiftKey){
    console.log(d3.event.keyCode);
  }
}





add_link=function(){
  // var done_yet=localStorage.getItem('done_yet')
  // if(done_yet==='already_done'){
  //   localStorage.setItem('done_yet','not_done')
  // }else{
    var msg={
        action:'geturl'
      }
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
        console.log('the response')
        console.log(response)
          var url=response.url
          console.log('the url')
  console.log(url)
  if(url){
    var person = prompt("Please enter your name", url);
    if (person != undefined) {
      var pos=localStorage.getItem('branch_in_store');
    console.log(pos);
    var tree = JSON.parse(localStorage.getItem('tree_in_store'));
    for(var i = 0; i < tree.length; i++) {
        var datum = tree[i];
        if(datum._id==pos){
          var done_yet=localStorage.getItem('done_yet')
          console.log('person')
          console.log(person)
          tree[i].linker=person
        }
      }
      if(person!="no link"){
        localStorage.setItem('tree_in_store',JSON.stringify(tree));
        var treenew=make_tree(tree,idToNodeMap,root);
        console.log('updated');
        console.log(treenew);
        var width=localStorage.getItem('width');
        var height=localStorage.getItem('height');
        update(treenew,'reload',width,height);
        //update(treenew,'reload')
        get_rid_of_duplicate_text_areas();
    }
    }
  }
  })
  })
  
  // localStorage.setItem('done_yet','already_done')
  // }
}

d3.select("body")
    .on("keydown", function() {
       say()
       if (d3.event.shiftKey & d3.event.ctrlKey){
          if(d3.event.keyCode===187){
            // var done_yet=localStorage.getItem('done_yet')
            // if(done_yet==='already_done'){
            //   localStorage.setItem('done_yet','not_done')
            // }else{
              //getit()
              //localStorage.setItem('done_yet','already_done')
            //}
            var msg={
              action:'gettext'
            }
            console.log('1fklsdjlkdfjl;')
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            console.log('2jfkldsajfl;jldasjl;dafs')
        chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
          console.log('3jkdfl;ajlf;dskaj;')
          if(response){
          console.log(response)
            //console.log(response.response);//You have to choose which part of the response you want to display ie. response.response
            if(response.response!=""){
            var sentence = response.response;
          }
            var linkback = response.linkback;
            var linker = response.linker;
            var number=response.number;
            var cat=response.cat;
          }
            if(sentence=="undefined" || sentence=="null"|| sentence==null || sentence==undefined){
              console.log('no input')
            }else{
              var sentences=sentence.match(/.{1,100}/g);
              var sentence=sentences.join('\n')
            }
            newData=JSON.parse(localStorage.getItem('tree_in_store'));
            console.log('4fjklajfdlslfd;a')
            //newData=newData.pop();
            //var pos=JSON.parse(localStorage.getItem('branch_in_store'))._id
            var pos=localStorage.getItem('branch_in_store')
            console.log('position')
            console.log(pos)
            if ($('#check_id').is(":checked")){var colour='red'}else{var colour='blue'}
            console.log(colour)
          console.log('5fjkdlsjdla')
          if(sentence){
            console.log('6lkasdjl;;;;a')
            newData.push({"_id": Number(localStorage.getItem('counter'))+1,
                                "parentAreaRef": {"id":pos},
                                "text": sentence,
                                "name": sentence.substr(0,9),
                                "status":colour,
                                "linker":linker,
                                "linkback":linkback,
                                "number":number,
                                "cat":cat,
                                'scores':{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
                              })
          }else{
            console.log('6lkasdjl;;;;a')
            newData.push({"_id": Number(localStorage.getItem('counter'))+1,
                                "parentAreaRef": {"id":pos},
                                "text": "empty",
                                "name": "empty",
                                "status":colour,
                                'scores':{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
                              })
          }
          console.log('7fkldasjl;;al')
            var last_element = newData[newData.length - 1];
            last_element._id=Number(last_element._id)-1
            console.log('why isnt this changing')
            console.log(last_element._id)
            var second_last = newData[newData.length - 2];
            console.log('checking for duplicate')
            console.log(last_element)
            console.log(second_last)
          //   if((last_element._id-1)===second_last._id){
          //     newData.pop();
          //     console.log('duplicate')
          // }else{
          //   console.log('not duplicate')
          // }
            // console.log('newdata')
            // console.log(newData)
            console.log('8fkldasjl;;al')
            localStorage.setItem('tree_in_store',JSON.stringify(newData))
            // console.log('add node')
            var v=make_tree(newData,idToNodeMap,root)
            //console.log(v)
            var width=localStorage.getItem('width')
            var height=localStorage.getItem('height')

            console.log('9fkldasjl;;al')
            update(v,'reload',width,height)
            console.log('10fkldasjl;;al')
            //update(v,'reload')
            localStorage.setItem('counter', Number(localStorage.getItem('counter'))+1)
            });
          });
          get_rid_of_duplicate_text_areas()
          }else if(d3.event.keyCode===189){
            remove_node()
          }else if(d3.event.keyCode===76){
            add_link()
          }else if(d3.event.keyCode===71){
              var linkback=localStorage.getItem('linkback');
              var linker=localStorage.getItem('linker');
              var number=localStorage.getItem('number');
              var cat =localStorage.getItem('cat');
              //chrome.tabs.create({ url: linker, active: true});
                  var msg={
                    action:'scrollto',
                    linker:linker,
                    linkback:linkback,
                    number:number,
                    cat:cat
                  }
                // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                //   chrome.tabs.sendMessage(tabs[0].id, msg);
                //   });
                // chrome.tabs.create({ url: linker }, function(tab) {
                //     //chrome.tabs.sendMessage(tab.id, msg);
                //     connect(msg);
                // });
                chrome.tabs.create({ url: linker }, function(tab) {
                // Why do you query, when tab is already given?
                chrome.tabs.executeScript(tab.id, {file:"jquery-3.1.0.min.js"}, function() {
                  // This executes only after jQuery has been injected and executed
                  chrome.tabs.executeScript(tab.id, {file:"content.js"}, function() {
                    // This executes only after your content script executes
                    chrome.tabs.sendMessage(tab.id, msg);
                  });
                });
              });
          }
        }
    });





function click(datum){
  //centerNode(datum);
    console.log(datum); 
       console.log('get rid of parent')
      if(datum.parent!="undefined" || datum.parent!="null"|| datum.parent!=null || datum.parent!=undefined){
        delete datum["parent"]
        console.log(datum._id)
        console.log(datum.name)
    }
      localStorage.setItem('branch_in_store',datum._id)
      localStorage.setItem('linkback',datum.linkback)
      localStorage.setItem('linker',datum.linker)
      localStorage.setItem('number',datum.number)
      localStorage.setItem('cat',datum.cat)
  }

function clickHandler (d,i) {
  // reset all circle to blue
  d3.selectAll('circle') //<-- or slap a class name on your circles and use that
    .style('fill', 'blue');
  // set selected one to yellow
  d3.select(d)
    .style('fill', 'yellow');
}


d3.select('#saveButton').on('click', function(){
  //var svgString = getSVGString(d3.select('#container').select('svg'));
  console.log('dunno')
  d3.select('this')
        .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#container").html()))
        .attr("download", "viz.svg")
});

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )


});


