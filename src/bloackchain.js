const crypto = require("crypto");
const initBlock = {
    index: 0,
    data: 'Hello ky',
    prevHash: 0,
    timestamp: 1663410091566,
    nonce: 42545,
    hash: '0000f8922602ad29fc317eec1e2c2138d330b98d9f2faf3c4a2afe4fc1e96bc7'
  }//generic block
class Bloackchain {
    constructor() {
        this.blockchain = [initBlock]
        this.data = []
        this.difficulty =4
        // const hash = this.computeHash(0,"0",1663410091566,"hi ky",1)
        // console.log(hash);
    }
    //a676889dc7b27df3293bee14dc7bc52d66567727aa06ad15e49e2b5d052f7f5f
    //1663410091566
    //挖矿
    getLastBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }
    transfer(from,to,amount) {
        // if(from !=="0") {
        //     const blance = this.blance(from)
        //     if(blance < amount) {
        //         console.log("no enough coin");
        //         return;
        //     }
        // }
        //sign
        const transObj = {from,to,amount}
        this.data.push(transObj)
        return transObj;
    }
    blance(address) {
        let blance = 0;
        this.blockchain.forEach(block => {
            if(!Array.isArray(block.data)) {
                return;
            }
            block.data.forEach(trans => {
            if(address==trans.from)  {
                blance -= trans.amount;
            }  
            if(address==trans.to) {
                blance += trans.amount;
            }
            })
        })
        return blance;
    }
    mine(address){
       this.transfer("0",address,100)
       const newBlock = this.generateNewBlock();
       if(this.isValidBlock(newBlock)&&this.isValidChain(this.blockchain)) {
        this.blockchain.push(newBlock)
        this.data =[]
        return newBlock;
       } else {console.log("invalid block")}
    }
    generateNewBlock(){
        let nonce = 0;
        const index = this.blockchain.length
        const data = this.data
        const prevHash = this.getLastBlock().hash
        let timestamp = new Date().getTime();
        let hash = this.computeHash(index,prevHash,timestamp,data,nonce)
        while(hash.slice(0,this.difficulty) !== "0".repeat(this.difficulty)) {
            nonce+=1;
            hash = this.computeHash(index,prevHash,timestamp,data,nonce);
            // console.log(hash,nonce);
        }

        return ({
            index,
            data,
            prevHash,
            timestamp,
            nonce,
            hash
        });
    }

    computeHash(index,prevHash,timestamp,data,nonce) {
        return crypto
                .createHash("sha256")
                .update(index + prevHash + timestamp + data + nonce)
                .digest("hex")
    }
    computeHashForBlock({index,prevHash,timestamp,data,nonce}) {
        return this.computeHash(index,prevHash,timestamp,data,nonce)
    }
    isValidBlock(newBlock,lastBlock = this.getLastBlock()){
        // const lastBlock = this.getLastBlock();
        if(newBlock.index !== lastBlock.index + 1){
            return false;
        }
        else if(newBlock.timestamp < lastBlock.timestamp) {
            return false;
        }
        else if(newBlock.prevHash !== lastBlock.hash) {
            return false;
        }
        else if(newBlock.hash.slice(0,this.difficulty)!=="0".repeat(this.difficulty)) {
            return false
        }
        else if(newBlock.hash !== this.computeHashForBlock(newBlock)) {
            console.log(newBlock.hash,this.computeHashForBlock(newBlock));
            return false;
        }
        return true;
    }

    isValidChain(chain = this.blockchain){
        for(let i =chain.length - 1;i>=1;i--) {
            if(!this.isValidBlock(chain[i],chain[i - 1])) {
                return false
            }
        }
        if(JSON.stringify(chain[0]) !== JSON.stringify(initBlock)) return false;
        return true;
    }
}

// const bc = new Bloackchain()
// bc.mine()
// bc.mine()
// console.log(bc.blockchain);

module.exports = Bloackchain;