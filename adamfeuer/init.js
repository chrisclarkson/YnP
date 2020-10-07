
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
            },
            {name: "Theory",
            parentAreaRef: {id: "p1"},
            status: "blue",
            _id: 1},
            {name: "Practice",
            parentAreaRef: {id: "p1"},
            status: "blue",
            _id: 2},
            {name: "the implementation",
            parentAreaRef: {id: 2},
            status: "blue",
            _id: 3},
            {name: "more details",
            parentAreaRef: {id: 2},
            status: "blue",
            _id: 4},
            {name: "details",
            parentAreaRef: {id: 1},
            status: "blue",
            _id: 5}
            ];
      var filters2 = JSON.stringify(d);
      localStorage.setItem('tree_in_store', filters2);
      var tree=make_tree(d,idToNodeMap,root);
      draw_tree(null,tree);
      //update(tree,'reload');
    });


});
                
