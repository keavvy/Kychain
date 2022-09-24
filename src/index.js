const vorpal = require("vorpal")()
const Blockchain= require("./bloackchain")
const Table = require("cli-table")
const blockchain = new Blockchain();

function formatLog(data) {
    if(!Array.isArray(data)) {
        data = [data]
    }
    const first = data[0]
    const head = Object.keys(first)
    const res = data.map(v=>{
        return head.map(h=> JSON.stringify(v[h],null,1))
    })
    const table = new Table({
        head,
        colWidths:new Array(head.length).fill(15)
    })
    table.push(...res)
    console.log(table.toString());
}
vorpal
.command("detail<index>","查看区块详情")
.action(function(args,callback){
    const block = blockchain.blockchain[args.index]
    this.log(JSON.stringify(block,null,2))
})



     vorpal
     .command("mine<address>","挖矿")
     .action(function(args,callback){
       const newBlock = blockchain.mine(args.address)
       if(newBlock) formatLog(newBlock);
        // this.log("hello bloackchain")
        callback()
     })
     vorpal
     .command("trans<from><to><amount>","转账")
     .action(function(args,callback){
        let trans = blockchain.transfer(args.from,args.to,args.amount)
        if(trans) formatLog(trans)
        callback()
     })
     vorpal
     .command("chain","查看区块链")
     .action(function(args,callback){
       formatLog(blockchain.blockchain)
        // this.log("hello bloackchain")
        callback()
     })


     vorpal
     .command("blance<address>","查询余额")
     .action(function(args,callback){
       const blance = blockchain.blance(args.address)
       if(blance) {
        formatLog({blance,address:args.address})
       }
       callback()
     })
     console.log("welcome to ky-chain");
     vorpal.exec("help")
     vorpal
           .delimiter("ky-chain =>")
           .show()  



    
