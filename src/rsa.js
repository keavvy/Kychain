let fs = require("fs")
const path = require("path")
let EC = require("elliptic").ec
let ec = new EC("secp256k1")
let keypair = ec.genKeyPair();
//私钥 =》 公钥
// const res = {
//     prv:keypair.getPrivate("hex").toString(),
//     pub:keypair.getPublic("hex").toString()
// }
const res = generateKey()
// console.log(res);
function generateKey() {
    const fileName ="./wallet.json";
    try{
        const res = JSON.parse(fs.readFileSync(fileName));
        if(res.pub&&res.prv&&getPub(res.prv) == res.pub) {
            keypair = ec.keyFromPrivate(res.prv);
            return res;
        }
    }catch(err){
        const res = {
            prv:keypair.getPrivate("hex").toString(),
            pub:keypair.getPublic("hex").toString()
        }
        fs.writeFileSync(fileName,JSON.stringify(res))
        return res;
    }
}
function getPub(prv) {
    return ec.keyFromPrivate(prv).getPublic("hex").toString();
}


function sign({from,to,amount})  {
    const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
    let signature = Buffer.from(keypair.sign(bufferMsg).toDER()).toString("hex");
    return signature;
}

function verify({from,to,amount,signature},pub) {
    const keypairTemp = ec.keyFromPublic(pub,"hex")
    const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
    return keypairTemp.verify(bufferMsg,signature)
}

