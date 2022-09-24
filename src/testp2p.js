const dgram = require("dgram")
const udp = dgram.createSocket("udp4");


udp.on("message",(data,remote) => {
    console.log("accept msg",data.toString());
    console.log(remote);
})
udp.on("listening",function() {
    const address = udp.address();
    console.log(address.address + ":" + address.port);
})
udp.bind(8002)


function send(msg,port,host) {
    console.log("send msg",msg,port,host);
    udp.send(Buffer.from(msg),port,host)
}
const post = Number(process.argv[2]);
const host = poocess.argv[3]
if(post&&host) {

}