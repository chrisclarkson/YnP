if (!require('XML')) install.packages('XML'); library('XML')
if (!require('rentrez')) install.packages('rentrez'); library('rentrez')

file.remove('links.txt')
get_citations=function(num){
    startnode <- as.integer(as.character(num))
    print('starts here')
    print(startnode)
    #startnode <- c(30135510)
    num_of_levels <- 7 #number of article "levels" from the start node 
    startnode_links <- entrez_link(dbfrom='pubmed', id=startnode, db='all')
    startnode_citations <- startnode_links$links$pubmed_pubmed_citedin
    startnode_data <- entrez_summary(db="pubmed", id=startnode)
    print('start data')
    #result = tryCatch({
    nodes <- data.frame(PubmedID = startnode_data$uid, 
      Title = startnode_data$title, 
      Last_Author = startnode_data$lastauthor, 
      Year =  substr(startnode_data$pubdate, 0, 4))
# }, error = function(e) {
#     print(startnode_data$uid)
#     print(startnode_data$title)
#     print(startnode_data$lastauthor)
#     print(substr(startnode_data$pubdate, 0, 4))
#     print(startnode_data$pubtype)
#     print(startnode_data$pmcrefcount)
#     print(startnode_data$publisherlocation)
#     print(startnode_data$pages)
# })
    
    print('nodes')
    print(nodes)
    edges <- data.frame(From = startnode_citations, To = rep(startnode, 
    times = length(startnode_citations)))
    print('edges')
    print(edges)
    if(nrow(edges)>0){

      df=data.frame()
          for(i in 1:nrow(edges)){
            df=rbind(df,cbind(nodes[1,],edges[i,],paste0('https://www.ncbi.nlm.nih.gov/pubmed/?term=',startnode)))
          }

      print('end of loop')
      print(df)
      write.table(df,'links.txt',sep='\t',na = "NA",col.names=F,row.names=F,append=T)
      print('written to file')
      for(j in edges$From){get_citations(c(j))}
    }else{
      print('end of line')
      df=cbind(nodes[1,],paste0('no_link'),paste0(startnode),paste0('https://www.ncbi.nlm.nih.gov/pubmed/?term=',startnode))
      write.table(df,'links.txt',sep='\t',na = "NA",col.names=F,row.names=F,append=T)
    }
}

get_citations(c(28240266))

file.remove('test.json')
df=read.table('links.txt',stringsAsFactors=F,header=F)
colnames(df)=c('id','text','author','year','From','To','linker')
df=unique(df)
df$name=paste(df$author,df$year)

# no_parents_idx=c()
# for(i in 1:nrow(df)){
#   if(sum(df$To==df$From[i])==0){
#     no_parents_idx=c(no_parents_idx,i)
#   }
# }
# df=df[-no_parents_idx,]
#df$From[df$From=='no_link']=df$id[df$From=='no_link']
#df=df[df$From!='no_link',]
write.table(paste0('[{"_id":',df$id[1],',"text":"',df$text[1],'","name":"',df$name[1],'","children":[]},'),file='test.json',append=T,col.names=F,row.names=F,quote=F)
for(i in 2:nrow(df)){
  finish_line='},'
  if(i!=nrow(df)){
    print('yr')
  }else{
    finish_line='}]'
  }
  idx=which(df$id==df$From[i])[1]
  print(idx)
  if(df$From[i]!='no_link'){
    write.table(paste0('{"_id":',df$From[i],',"text":"',df$text[idx],'","name":"',df$name[idx],'","parentAreaRef":{"id":',df$To[i],'},"linker":"',df$linker[idx],'","children":[]}'),file='test.json',append=T,col.names=F,row.names=F,quote=F)
    if(i!=nrow(df)){
      cat(',',file='test.json',append=T)
    }
  }
}
write.table(paste0(']'),file='test.json',append=T,col.names=F,row.names=F,quote=F)








