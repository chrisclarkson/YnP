if (!require('XML')) install.packages('XML'); library('XML')
if (!require('rentrez')) install.packages('rentrez'); library('rentrez')
args <- commandArgs(trailingOnly=T)

num=args[1]
print(length(args))
if(length(args)>1){
  step=args[2]
}


get_citations=function(num){

    startnode <- as.integer(as.character(num))
    print('starts here')
    print(startnode)
    #startnode <- c(30135510)
    num_of_levels <- 7 #number of article "levels" from the start node 
    startnode_links <- entrez_link(dbfrom='pubmed', id=startnode, db='all')
    startnode_citations <- startnode_links$links$pubmed_pubmed_citedin
    startnode_data <- entrez_summary(db="pubmed", id=startnode)
    # print('start data')
    # result = tryCatch({
    nodes <- data.frame(PubmedID = startnode_data$uid, 
      Title = startnode_data$title, 
      Last_Author = startnode_data$lastauthor, 
      Year =  substr(startnode_data$pubdate, 0, 4))
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
      write.table(df,paste0('links.txt'),sep='\t',na = "NA",col.names=F,row.names=F,append=T)
    }
}



assemble=function(num){
    file.remove(paste0(num,'.json'))
    df=read.table(paste0('links.txt'),stringsAsFactors=F,header=F)
    colnames(df)=c('id','text','author','year','From','To','linker')
    df=unique(df)
    df$name=paste(df$author,df$year)

    # write.table(paste0('[{"_id":',df$id[1],',"text":"',df$text[1],'","name":"',df$name[1],'","children":[]},'),file=paste0(num,'.json'),append=T,col.names=F,row.names=F,quote=F)
    # for(i in 2:nrow(df)){
    #   finish_line='},'
    #   if(i!=nrow(df)){
    #   }else{
    #     finish_line='}]'
    #   }
    #   idx=which(df$id==df$From[i])[1]
    #   print(idx)
    #   if(df$From[i]!='no_link' & !is.na(idx)){
    #     write.table(paste0('{"_id":',df$From[i],',"text":"',df$text[idx],'","name":"',df$name[idx],'","parentAreaRef":{"id":',df$To[i],'},"linker":"',df$linker[idx],'","children":[]}'),file='test.json',append=T,col.names=F,row.names=F,quote=F)
    #     if(i!=nrow(df)){
    #       cat(',',file=paste0(num,'.json'),append=T)
    #     }
    #   }
    # }
    # write.table(paste0(']'),file=paste0(num,'.json'),append=T,col.names=F,row.names=F,quote=F)
    df_new=data.frame()
    for(i in 2:nrow(df)){
        idx=which(df$id==df$From[i])[1]
        print(idx)
        if(df$From[i]!='no_link' & !is.na(idx)){
          df_new=rbind(df_new,
            cbind(paste0('{"_id":','"',df$From[i],'"'),
              paste0('"text":"',df$text[idx],'"'),
              paste0('"name":"',df$name[idx],'"'),
              paste0('"parentAreaRef":{"id":','"',df$To[i],'"}'),
              paste0('"linker":"',df$linker[idx],'"'),
              paste0('"children":[]}'),
              paste0(' ')
            ))
        }
    }
    write.table(paste0('['),file=paste0(num,'.json'),append=T,col.names=F,row.names=F,quote=F)
    write.table(paste0('{"_id":',df$id[1],',"text":"',df$text[1],'","name":"',df$name[1],'","children":[]},'),file=paste0(num,'.json'),append=T,col.names=F,row.names=F,quote=F)
    to=nrow(df_new)-1
    write.table(df_new[1:to,],sep=',',paste0(num,'.json'),append=T,quote=F,col.names=F,row.names=F)
    last_row=df_new[nrow(df_new),-ncol(df_new)]
    write.table(last_row,sep=',',paste0(num,'.json'),append=T,quote=F,col.names=F,row.names=F)
    write.table(paste0(']'),file=paste0(num,'.json'),append=T,col.names=F,row.names=F,quote=F)
}
if(length(args)==1){
    print('step 1 only')
    file.remove(paste0('links.txt'))
    get_citations(c(num))
    assemble(num)
}else if(length(args)>1 && step=='step1'){
  if (step=='step1'){
    print('step 1 only')
    file.remove(paste0('links.txt'))
    get_citations(c(num))
  }
}else if(length(args)>1 && step=='step2'){
  if(step=='step2'){
    print('step 2 only')
    assemble(num)
  }
}else if(length(args)==2 && step=='both'){
  print('both steps')
  file.remove(paste0('links.txt'))
  get_citations(c(num))
  assemble(num)
}
print('end')

