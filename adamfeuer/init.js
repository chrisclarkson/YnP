
               $('document').ready(function(){
                    $(document).foundation();
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

                    var treeJSON = d3.json("file:///Users/Deirdreclarkson/js/json_files/GWAS_and_AD.YnP.json", draw_tree);
                });
                
