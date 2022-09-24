import { WebSocketServer } from 'ws';
const NawaAbstract = require("nawa").NawaAbstract;
const nawa = new NawaAbstract();
const serializer = require("json-bigint")({ useNativeBigInt: true });


const wss = new WebSocketServer({ port: 10000 });

wss.on('connection', async function connection(ws) {
    var session_id = null;

    async function handle_message(data){
        if(!session_id) session_id = await nawa.create_session();
        console.log("<<<", data.toString());
        data = serializer.parse(data.toString());
//        console.log("<<<", session_id, data);
        nawa.session_receive(session_id, data);
    }
    ws.on('message', handle_message);

    nawa.on("data", (sid, packet)=>{
        if(session_id != sid) return;
        let ret = serializer.stringify(packet);
        console.log(">>>", sid, ret);
        ws.send(ret);
    });

    nawa.on("session_close", (sid)=>{
        if(session_id != sid) return;
        console.log("Closing session:", sid);
        ws.close();
    });
});


