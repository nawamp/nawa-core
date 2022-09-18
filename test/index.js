const NawaAbstract = require("nawa").NawaAbstract;
const nawa = new NawaAbstract();

nawa.on("data", (session_id, packet)=>{
    console.log("OUTGOING", session_id, packet);
});

nawa.create_session().then(async function(session_id){
    console.log(`New session: ${session_id}`);
    function recv(data){ nawa.session_receive(session_id, data); }

    recv([1, "somerealm", {}]);

    recv([1, "somerealm", {}]);

});
