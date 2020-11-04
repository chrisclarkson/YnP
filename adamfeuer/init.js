
$('document').ready(function(){
    $(document).foundation();
    //style="width:780px; height:580px"
    // document.body.style.width = '300px';
    // document.body.style.height = '100px';
    $(document).on('opened', '[data-reveal]', function () {
        var element = $(".inputName:visible").first();
        element.focus(function(){
            this.selectionStart = this.selectionEnd = this.value.length;
        });
        element.focus();
    });
    $('#RenameNodeForm').submit(function(e){
            rename_node();
            return false;
    });
    $('#CreateNodeForm').submit(function(e){
            create_node();
            return false;
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

    function make_tree(data,idToNodeMap,root){
      console.log('making tree');
      console.log(root);
      console.log(idToNodeMap);
      console.log(data);
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
                console.log(parentNode);
                parentNode.children.push(datum);
            }
        }
        console.log(root)
        return root
    }

    var tree_in_store=JSON.parse(localStorage.getItem('tree_in_store'));
    if(tree_in_store=="undefined" || tree_in_store=="null"|| tree_in_store==null || tree_in_store==undefined){
        console.log('tree not yet set');
        var counter=localStorage.getItem('counter');
        if(counter=="undefined" || counter=="null"|| counter==null || counter==undefined){
          localStorage.setItem('counter', 1);
        }
        var d = [{
                  "_id": "p1",
                  "text": "Parent-1",
                  "name": "Parent-1",
                  "status":"blue"
                }];
        var filters2 = JSON.stringify(d);
        localStorage.setItem('tree_in_store', filters2);
        var idToNodeMap = {};
        var root = null;
        var tree=make_tree(d,idToNodeMap,root);
        draw_tree(null,tree);
    }else{
      console.log('stored');
      var idToNodeMap = {};
      var root = null;
      for(var j = 0; j < tree_in_store.length; j++){
        if(tree_in_store[j]['id']){
          delete tree_in_store[j]['id']
        }
        if(tree_in_store[j]['parent']){
          delete tree_in_store[j]['parent']
        }
      }
      var tree=make_tree(tree_in_store,idToNodeMap,root);
      
      console.log('here')
      console.log(tree_in_store)
      draw_tree(null,tree)
    };

    $('#upload').click(function() {
        console.log('d');
        var treeJSON = d3.json("file://"+$('#path').val(), draw_tree);
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
                localStorage.setItem('tree_in_store', JSON.stringify(treenew));
            }
        }
    }
    rawFile.send(null);
  }
  console.log($('#path').val());
  console.log(readTextFile("file://"+String($('#path').val())));
                //change_counter();
    });
    $('#clear').click(function() {
      localStorage.clear();
      console.log('clearing');
      localStorage.setItem('counter', 1);
      var d =  [{
              "_id": "p1",
              "text": "Parent-1",
              "name": "Parent-1",
              "status":"blue"
            }
            ];
      var filters2 = JSON.stringify(d);
      localStorage.setItem('tree_in_store', filters2);
      var tree=make_tree(d,idToNodeMap,root);
      draw_tree(null,tree);
      //update(tree,'reload');
    });


function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}
function download_json(){
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
  
  
}

$('#download').click(function(){
  download_json();
});

});
                
