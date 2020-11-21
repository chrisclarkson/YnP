
/// adam feueur 2: https://bl.ocks.org/adamfeuer/a8950c5197fe491f13969a03100159d5

function close_modal() {
        $(document).foundation('reveal', 'close');
}

var tree_root;
var create_node_modal_active = false;
var rename_node_modal_active = false;
var create_node_parent = null;
var node_to_rename = null;

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function make_tree(data,idToNodeMap,root){
      console.log('making tree');
      console.log(root);
      console.log(idToNodeMap);
      console.log(data);
        for(var i = 0; i < data.length; i++) {
            var datum = data[i];
            console.log(i);
            console.log(datum);
            datum.children = [];
            idToNodeMap[datum._id] = datum;
            if(typeof datum.parentAreaRef === "undefined") {
                root = datum;
            } else {
                parentNode = idToNodeMap[datum.parentAreaRef.id];
                console.log(parentNode);
                parentNode.children.push(datum);
            }
        }
        console.log(root);
        return root;
    }

function find_max(){
    var tree=JSON.parse(localStorage.getItem('tree_in_store'));
    list=[]
    for(var i = 0; i < tree.length; i++){
    if(tree[i]['_id']==='p1'){
        console.log('parent');
    }else{
        list.push(Number(tree[i]['_id']))
    }
    }
    if(list.length<1){
    var latest=2;
    }else{
    console.log(d3.max(list))
    var latest=d3.max(list)+1
    }
    localStorage.setItem('counter',latest);
    return latest
}


function create_node(){
    console.log('hi');
    if (create_node_parent && create_node_modal_active) {
        if (create_node_parent._children != null)  {
                create_node_parent.children = create_node_parent._children;
                create_node_parent._children = null;
        }
        if (create_node_parent.children == null) {
                create_node_parent.children = [];
        }
        //id = generateUUID();
        var id=find_max();
        // var name=localStorage.getItem('name');
        // console.log(name);
        // var text=localStorage.getItem('text');
        var name = $('#CreateNodeName').val();
        var text = $('#CreateNodeText').val();
        var linker = $('#CreateNodeLink').val();
        var pic = $('#CreateNodePic').val();
        new_node = { 'name': name,
                     'text': text,
                     'id' : id,
                     '_id':id,
                     'linker':linker,
                     'pic':pic,
                     'depth': create_node_parent.depth + 1,
                     'children': [],
                     '_children':null
                   };
        console.log('Create Node name: ' + name);
        create_node_parent.children.push(new_node);
        create_node_modal_active = false;
        $('#CreateNodeName').val('');
    }
    close_modal();
    console.log('get node parent');
    console.log(create_node_parent);
    outer_update(create_node_parent,adding=true,deleting=false,renaming=false);
}

function rename_node() {
        if (node_to_rename && rename_node_modal_active) {
            name = $('#RenameNodeName').val();
            text = $('#RenameNodeText').val();
            link = $('#RenameNodeLink').val();
            pic = $('#CreateNodePic').val();
            console.log('New Node name: ' + name);
            node_to_rename.name = name;
            node_to_rename.text = text;
            node_to_rename.linker = link;
            node_to_rename.pic = pic;
            rename_node_modal_active = false;
            console.log(node_to_rename);
        }
        close_modal();
        outer_update(node_to_rename,adding=false,deleting=true,renaming=false);
}

outer_update = null;

document.getElementById("renamer").addEventListener("click", function(){rename_node()});
document.getElementById("creator").addEventListener("click", function(){create_node()});

function picture(d){
    console.log('hdhhdhhdhhdhhdhhdhdhdhdhh')
    function init(){
        console.log('is this executing');
        screenshot.initEvents();
        console.log(' executing');
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
            link.download = String(d._id)+"_"+d.name+"_"+".YnP.png";
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
    init();
    d.pic="/Users/Deirdreclarkson/js/json_files/"+String(d._id)+"_"+d.name+"_"+".YnP.png";
    outer_update(d,adding=false,deleting=true,renaming=false);
}




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


  function readTextFile(file,d){
    console.log('up');
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
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
                    // console.log('point')
                    // treenew[i]['_id']=max_id;
                    // treenew[i]['parentAreaRef']={id:Number(branch_in_store)}
                    console.log(treenew[i])
                  }else{
                    console.log('adding');
                    console.log(Number(treenew[i]['_id']));
                    console.log(Number(treenew[i]['_id'])+max_id);
                    console.log(treenew[i]['parentAreaRef']['id']+max_id);
                    treenew[i]['_id']=Number(treenew[i]['_id'])+max_id;
                    if(treenew[i]['parentAreaRef']['id']==="p1"){
                      console.log('parent children');
                      treenew[i]['parentAreaRef']['id']="p1";
                      console.log(treenew[i]);
                    }else{
                      treenew[i]['parentAreaRef']['id']=Number(treenew[i]['parentAreaRef']['id'])+max_id;
                    }
                  }
                  treeold.push(treenew[i]);
                }
                var idToNodeMap = {};
                var root = null;
                //console.log(treeold)
                //var tree=make_tree(treeold,idToNodeMap,root);
                //treenew.unshift(d);
                console.log(treenew);
                var tree2=make_tree(treenew,idToNodeMap,root);
                tree2['_id']=max_id;
                tree2['parentAreaRef']={'id':d._id}
                
                for(var i = 0; i < tree2.children.length; i++){
                  if(tree2.children[i]['parentAreaRef']==='p1'){
                    tree2.children[i]['parentAreaRef']=max_id
                  }
                }
                console.log(d)
                if (d.children == null) {
                    d.children = [];
                }
                d.children.push(tree2);
                outer_update(d,adding=false,deleting='yes',renaming=false);
                //update(tree,'reload');
                //localStorage.setItem('tree_in_store', JSON.stringify(flatten([tree])));
                //change_counter();
            }
        }
    }
    rawFile.send(null);
  }
  
function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}
function download_json(branch){
    delete branch['parent'];
    delete branch['parentAreaRef'];
    branch['_id']='p1';
    for(var i = 0; i < branch.children.length; i++){
        branch.children[i]['parentAreaRef']['id']='p1'
    }
    var idToNodeMap = {};
    var root = null;
    tree_in_store=flatten([branch]);
    console.log('dfjdkajflk;djflkjfjjjjjjsssss')
    console.log(tree_in_store);
    var v=make_tree(tree_in_store,idToNodeMap,root);
    var data = encode(JSON.stringify(v, null, 4));
    var blob = new Blob([data], {type: 'application/octet-stream'});
    var url = URL.createObjectURL(blob);
    console.log(branch.name.split(' ').join('_')+'.YnP.json');
    chrome.downloads.download({
      url: url, // The object URL can be used as download URL
      filename: String(branch.name.split(' ').join('_')+'.YnP.json')
  });
  
  
}


//for more advanced implementation see: https://bl.ocks.org/jjzieve/a743242f46321491a950
// function searchTree(obj,pattern){
//     for(var i=0;i<obj.length;i++){
//         console.log(obj[i])
//         if(obj[i].name===pattern){
//             var output=obj[i]
//         }
//     }
//     return output
// }


// function searchTree(obj,search,results){
        
//         if(obj.name === search){ //if search is found return, add the object to the path and return it
//             results.push(obj);
//             console.log(obj)
//             return results;
//         }else if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
//             var children = (obj.children) ? obj.children : obj._children;
//             for(var i=0;i<children.length;i++){
//                 // we assume this path is the right one
//                 searchTree(children[i],search,results);
//                 // else{//we were wrong, remove this parent from the path and continue iterating
//                 //     path.pop();
//                 // }
//             }
//         }
        
//     }
// function searchTree(obj,search,path){
//         if(obj.name.toLowerCase().includes(search.toLowerCase())){ //if search is found return, add the object to the path and return it
//             console.log(obj);
//             path.push(obj);
//             return path;
//         }else if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
//             var children = (obj.children) ? obj.children : obj._children;
//             for(var i=0;i<children.length;i++){
//                 path.push(obj);// we assume this path is the right one
//                 var found = searchTree(children[i],search,path);
//                 if(found){// we were right, this should return the bubbled-up path from the first if statement
//                     return found;
//                 }
//                 else{//we were wrong, remove this parent from the path and continue iterating
//                     path.pop();
//                 }
//             }
//         }
//         else{//not the right object, return false so it will continue to iterate in the loop
//             return false;
//         }
//     }

JaroWrinker  = function (s1, s2) {
        var m = 0;
        // Exit early if either are empty.
        if ( s1.length === 0 || s2.length === 0 ) {
            return 0;
        }
        // Exit early if they're an exact match.
        if ( s1 === s2 ) {
            return 1;
        }
        var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
            s1Matches = new Array(s1.length),
            s2Matches = new Array(s2.length);
        for ( i = 0; i < s1.length; i++ ) {
            var low  = (i >= range) ? i - range : 0,
                high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);
            for ( j = low; j <= high; j++ ) {
            if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
                ++m;
                s1Matches[i] = s2Matches[j] = true;
                break;
            }
            }
        }

        // Exit early if no matches were found.
        if ( m === 0 ) {
            return 0;
        }

        // Count the transpositions.
        var k = n_trans = 0;

        for ( i = 0; i < s1.length; i++ ) {
            if ( s1Matches[i] === true ) {
            for ( j = k; j < s2.length; j++ ) {
                if ( s2Matches[j] === true ) {
                k = j + 1;
                break;
                }
            }

            if ( s1[i] !== s2[j] ) {
                ++n_trans;
            }
            }
        }

        var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
            l      = 0,
            p      = 0.1;

        if ( weight > 0.7 ) {
            while ( s1[l] === s2[l] && l < 4 ) {
            ++l;
            }

            weight = weight + l * p * (1 - weight);
        }

        return weight;
    }
function searchTree(obj,search,finds){
    var similarity=JaroWrinker(search,obj.name)
        if(similarity>0.6){ //if search is found return, add the object to the path and return it
            console.log(obj);
            obj.similarity=similarity
            delete obj.parent
            delete obj.parentAreaRef
            delete obj.children
            finds.push(obj);
        }
        if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
            var children = (obj.children) ? obj.children : obj._children;
            for(var i=0;i<children.length;i++){
                // we assume this path is the right one
                var found = searchTree(children[i],search,finds);
                
        }
    }
    return finds
}


function draw_tree(error,treeData,width_percent=100,height_percent=100) {
    localStorage.setItem('text_removable','not_removable');
    console.log('hhshshsho');
    console.log(treeData);
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;
    width_percent=Number(width_percent)/100;
    height_percent=Number(height_percent)/100;
    var viewerWidth = $(document).width()*width_percent;
    var viewerHeight = $(document).height()*height_percent;
    document.body.style.width=viewerWidth+20 +'px';
    document.body.style.height=viewerHeight+2 +'px';
    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);
    console.log('tree');
    console.log(tree);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });


    var menu = [
            {
                    title: 'Edit node',
                    action: function(elm, d, i) {
                            console.log('Rename node');
                            $("#RenameNodeName").val(d.name);
                            $("#RenameNodeText").val(d.text);
                            $("#RenameNodeLink").val(d.linker);
                            rename_node_modal_active = true;
                            node_to_rename = d
                            $("#RenameNodeName").focus();
                            $('#RenameNodeModal').foundation('reveal', 'open');
                    }
            },
            {
                    title: 'Delete node',
                    action: function(elm, d, i) {
                            console.log('Delete node');
                            delete_node(d);
                    }
            },
            {
                    title: 'Create child node',
                    action: function(elm, d, i) {
                            console.log('Create child node');
                            create_node_parent = d;
                            create_node_modal_active = true;
                            $('#CreateNodeModal').foundation('reveal', 'open');
                            $('#CreateNodeName').focus();
                    }
            },
            {
                    title: 'Go to link',
                    action: function(elm, d, i){
                        console.log(d);
                        console.log(d.linker);
                        chrome.tabs.create({ url: d.linker, active: true});
                    }
            },
            {
                title: 'Attach screenshot',
                    action: function(elm, d, i){
                        console.log(d);
                        console.log(d.linker);
                        picture(d);
                    }
            },
            {
                title: 'Upload branch',
                action: function(elm, d, i){
                    console.log(readTextFile("file://"+$('#path').val(),d));
                    
                }
            },
            {
                title: 'download branch',
                action: function(elm, d, i){
                    download_json(d);
                }
            }
    ]


    // A recursive helper function for performing some setup by walking through all nodes


    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;
        visitFn(parent);
        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    function delete_node(node) {
        console.log('hehe');
        visit(treeData, function(d) {
               if (d.children) {
                       for (var child of d.children) {
                               if (child == node) {
                                       d.children = _.without(d.children, child);
                                       update(root,adding=false,deleting=true,renaming=false);
                                       break;
                               }
                       } 
               }
        },
        function(d) {
           return d.children && d.children.length > 0 ? d.children : null;
       });
    }


    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    //sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 1]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }
        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();
        dragStarted = null;
    }
    // var dispatch = d3.dispatch('unhighlightAll')
    //           .on('unhighlightAll', function() {
    //             var textareas=d3.select('#texter');
    //             if (textareas.length<1) {
    //                 console.log('no need to remove')        
    //             }else{
    //                 textareas.remove()
    //             }
    //           });
    // define the baseSvg, attaching a class for styling and the zoomListener
    var textareas=document.getElementById('tree-container').getElementsByTagName('svg');
    if(textareas.length>0){textareas[0].remove()}
    
    var baseSvg = d3.select("#tree-container").append("svg")
        .on('click', function(d) {
            console.log(d3.select(d3.event.target).classList);
            console.log(this.classList);
            // console.log('clicking svg')
            // console.log(d)
            // var removable=localStorage.getItem('removable')
            // if(d===undefined & removable==='removable'){
            //     console.log('got it');
            // }

            // var removable=localStorage.getItem('text_removable')
            // if (removable==='removable'){
            //     var textareas=d3.select('#texter');
            //     if (textareas.length<1) {
            //         console.log('no need to remove');
            //     }else{
            //         textareas.remove();
            //     }
            // }
            if(d3.select(d3.event.target).classed('nodeCircle')){
                    console.log('this should not happen')
                     //localStorage.setItem('text_removable','removed');
                }else{
                    d3.select('#texter').remove();
                    if(d3.select('#picer')){
                       d3.select('#picer').remove();
                    }
                }
        })
        .attr("width", viewerWidth)
        .attr("height", viewerHeight);
        
    baseSvg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white")
        
    baseSvg.call(zoomListener);


    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            startTime = new Date(); 
            console.log('startdrag')
            console.log(startTime)
            localStorage.setItem('startTime',startTime.toString())
            //setTimeout(function(){console.log('WAITNG');}, 1000); // to wait a second https://stackoverflow.com/questions/42334432/long-click-event-in-d3
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {
                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")scale(" + scale + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            startTime=new Date(localStorage.getItem('startTime'));
            endTime = new Date(); 
            console.log('checking')
            console.log(typeof(startTime))
            console.log(startTime)
            console.log(endTime-startTime)
            if(endTime-startTime<2000){
                console.log('this should stop here');
                console.log(endTime-startTime);
                return;
            }
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                //sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            update(root,adding=false,deleting='no',renaming=false);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

  // color a node properly
  function colorNode(d) {
        result = "#fff";
        if (d.synthetic == true) {
          result = (d._children || d.children) ? "darkgray" : "lightgray";
        }
        else {
          if (d.type == "USDA") {
            result = (d._children || d.children) ? "orangered" : "orange";
          } else if (d.type == "Produce") {
            result = (d._children || d.children) ? "yellowgreen" : "yellow";
          } else if (d.type == "RecipeIngredient") {
            result = (d._children || d.children) ? "skyblue" : "royalblue";
          } else {
            result = "lightsteelblue"
          }
        }
        return result;
    }


    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    function centerNode_text(source) {
        console.log(source)
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        console.log(x);
        console.log(y);
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        console.log(x);
        console.log(y);
        // d3.transition()
        //     .duration(duration)
        //     .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
        return [x, y]
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d,adding=false,deleting=false,renaming=false);
        centerNode(d);
    }

    function update(source,adding=false,deleting=false,renaming=false) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        console.log('is this working');
        console.log(adding);
        var levelWidth = [1];
        var childCount = function(level, n) {
            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);
                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line 
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);
        var link_depth=200*width_percent;
        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * link_depth); //500px per level.
        });

        if(adding){
            console.log('heredsfds');
                var latest_id=Number(localStorage.getItem('counter'));
                console.log(latest_id);
                for(var j = 0; j < nodes.length; j++){
                    console.log(nodes[j]);
                    if(Number(nodes[j]['_id'])===latest_id){
                        console.log('dddd');
                        console.log(nodes[j]);
                        var latest_node=nodes[j];
                    }
                }

                newData=JSON.parse(localStorage.getItem('tree_in_store'));
                //newData=newData.pop();
                //var pos=JSON.parse(localStorage.getItem('branch_in_store'))._id
                var pos=localStorage.getItem('branch_in_store');
                console.log('position');
                console.log(pos);
                if ($('#check_id').is(":checked")){var colour='red'}else{var colour='blue'}
                console.log(latest_node);
                if(latest_node['parent']['_id']){
                    parent_id=latest_node['parent']['_id']
                }else{
                    parent_id=latest_node['parent']['id']
                }
                console.log('parent_id');
                console.log(parent_id);
                newData.push({"_id": latest_node['id'],
                                "parentAreaRef": {'id':parent_id},
                                "children":[],
                                "text": null,
                                "name": latest_node['name'],
                                "status":"blue",
                                "linker":null,
                                "linkback":null,
                                "number":null,
                                "cat":null,
                                'scores':{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
                              })
                for(var j = 0; j < newData.length; j++){
                    if(newData[j]['id']){
                      delete newData[j]['id']
                    }
                    if(newData[j]['parent']){
                      delete newData[j]['parent']
                    }
                  }
                localStorage.setItem('tree_in_store',JSON.stringify(newData));
                }else{console.log('just display1')}
                if(deleting || deleting==='yes'){
                    console.log('hhhdhfddddd');
                    ordered_nodes=nodes.reverse();
                    console.log('ordered_nodes');
                    console.log(ordered_nodes);
                    ordered_nodes_new = ordered_nodes.map(ordered_node => {
                        if(ordered_node['parent']){
                             ordered_node["parentAreaRef"]={'id':ordered_node['parent']['_id']}
                            delete ordered_node['parent'];
                        }
                        if(ordered_node['_id']===undefined){
                            console.log('undefined id');
                            console.log(ordered_nodes);
                            ordered_node["_id"]=ordered_node['id'];
                            delete ordered_node['id'];
                        }
                        return ordered_node
                    });
                    console.log('correctly ordered_nodes');
                    console.log(ordered_nodes_new);
                    for(var j = 0; j < ordered_nodes_new.length; j++){
                        if(ordered_nodes_new[j]['id']){
                          delete ordered_nodes_new[j]['id']
                        }
                        if(ordered_nodes_new[j]['parent']){
                          delete ordered_nodes_new[j]['parent']
                        }
                      }
                    localStorage.setItem('tree_in_store',JSON.stringify(ordered_nodes_new));
                }else{console.log('just display2')}
                if(renaming || renaming==='yes'){
                    for(var j = 0; j < nodes.length; j++){
                        console.log(nodes[j]);
                        if(Number(nodes[j]['_id'])===latest_id){
                            console.log('dddd');
                            console.log(nodes[j]);
                            var latest_node=nodes[j];
                        }
                    }
                    newData=JSON.parse(localStorage.getItem('tree_in_store'));
                }else{console.log('just display3')}


        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // var dispatch = d3.dispatch('unhighlightAll','toggleSingle')
        //       .on('unhighlightAll', function() {
        //         d3.selectAll('.clickable-circle').classed('highlighted', false);
        //       })
        //       .on('toggleSingle', function(el) {
        //         // store state of current element
        //         var highlighted = d3.select(el).classed('highlighted');
        //         // unhighlight all
        //         dispatch.unhighlightAll();
        //         // set opposite of stored state
        //         d3.select(el).classed('highlighted', !highlighted);
        //       });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('dblclick', click)
            .on('click', function(d){
                console.log(d);
                centerNode(d);
                console.log(d3.select(d3.event.target).classed('nodeCircle'));
                // x=centerNode_text(d)[0];
                // y=centerNode_text(d)[1]; 
                var pic_distance=181*width_percent;
                var text_distance_w=100*width_percent;
                var text_distance_h=10*height_percent;
                console.log('ssss');
                console.log(d3.event.pageX);
                if(d3.select(d3.event.target).classed('nodeCircle')){
                    if(d.pic){
                        $('#tree-container').append('<img id="picer" class="picer" src="file://localhost'+d.pic+'" alt="Image preview...">');
                        $(".picer").css({"position": "absolute", "top": (viewerHeight/2)-pic_distance, "left": (viewerWidth/2), "width":"320px"});
                    }
                    $('#tree-container').append('<textarea type="text" id="texter" class="bpmnLabel" >'+d.text+'</textarea>');
                    $(".bpmnLabel").css({"position": "absolute", "top": (viewerHeight/2), "left": (viewerWidth/2), "width":"320px", "height":"60px"});
                    // $('#tree-container').append('<textarea type="text" id="texter" class="bpmnLabel" >'+d.text+'</textarea>');
                    // $(".bpmnLabel").css({"position": "absolute", "top": (viewerHeight/2), "left": (viewerWidth/2), "width":"320px"});
                    //localStorage.setItem('text_removable','removed');
                }else{
                    d3.select('#texter').remove();
                    d3.select('#picer').remove();
                }

                //     d3.select("#texter").classed("hidden", false);
                // }
            });

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", colorNode);

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", colorNode);

        // Add a context menu
        node.on('contextmenu', d3.contextMenu(menu));


        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
        var borderPath = baseSvg.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("height", viewerHeight)
          .attr("width", viewerWidth)
          .style("stroke", 'black')
          .style("fill", "none")
          .style("stroke-width", '4px');
    
    }

    outer_update = update;

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = treeData;
    console.log(root);
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    update(root,deleting=false,adding=false,renaming=false);
    centerNode(root);
    tree_root = root;
    console.log(tree_root);
    $("#search").on("click", function() {
        // console.log('dkd')
        var finds = searchTree(root,$('#path').val(),[]);
            // if(typeof(paths) !== "undefined"){
            //     openPaths(paths);
            // }
            // else{
            //     alert(e.object.text+" not found!");
            // }
        //var node = searchTree(tree_root,$('#path').val(),[]);
        //console.log('found node');
        function dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                /* next line works with strings and numbers, 
                 * and you may want to customize it to your needs
                 */
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        finds.sort(dynamicSort('similarity')).reverse();
        console.log(finds);
        localStorage.setItem('search_results',JSON.stringify(finds));
        localStorage.setItem('search_results_idx','0')
        var node=finds[0];
        centerNode(node);
    })
    $('#next').on('click',function(){
        var finds=JSON.parse(localStorage.getItem('search_results'));
        var idx=Number(localStorage.getItem('search_results_idx'))+1;
        if(idx>=finds.length){idx=idx-1}
        localStorage.setItem('search_results_idx',String(idx));
        var node=finds[idx];
        centerNode(node);
    })
    $('#previous').on('click',function(){
        var finds=JSON.parse(localStorage.getItem('search_results'));
        var idx=Number(localStorage.getItem('search_results_idx'))-1;
        if(idx<=0){idx=0}
        localStorage.setItem('search_results_idx',String(idx));
        var node=finds[idx];
        centerNode(node);
    })
}





