import { Server } from "socket.io";


let connections={}
let messages={}
let timeOnline={}

export const connectTOSocket=(server)=>{
      const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection",(socket)=>{
        console.log("somthing is connected");
        
        socket.on("join-call",(path)=>{
            if(connections[path]=== undefined){
                connections[path]=[]
            }
            connections[path].push(socket.id)

            timeOnline[socket.id]=new Date()

           for(let a=0; a < connections[path].length; a++){
               io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
}
            
             if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }
        })

        socket.on("signal",(toId,message)=>{
             io.to(toId).emit("signal",socket.id,message)
        })

        socket.on("chat-message",(data,sender)=>{
            const [matchingRoom,found]= Object.entries(connections)
            .reduce(([room,isFound],[roomKey,roomValue])=>{
                if( !isFound && roomValue.includes(socket.id)){
                    return[roomKey,true]
                }

                return [room,isFound]
            },[" ",false])

            if(found===true){
                if(messages[matchingRoom]=== undefined){
                    messages[matchingRoom]=[]
                }
                messages[matchingRoom].push({'sender': sender,'data': data,"socket-id-sender":socket.id})

                console.log("message", matchingRoom, ":", sender, data)

                 connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }
            })

socket.on("disconnect", () => {
  const joinedAt = timeOnline[socket.id];
  if (joinedAt) {
    const diffTime = Math.abs(new Date() - joinedAt);
    // you can log or store diffTime if you want
  }

  let roomKey = null;

  for (const [k, v] of Object.entries(connections)) {
    if (v.includes(socket.id)) {
      roomKey = k;
      break;
    }
  }

  if (!roomKey) return;

  // notify others
  connections[roomKey].forEach((id) => {
    io.to(id).emit("user-left", socket.id);
  });

  // remove socket
  connections[roomKey] = connections[roomKey].filter(
    (id) => id !== socket.id
  );

  if (connections[roomKey].length === 0) {
    delete connections[roomKey];
    delete messages[roomKey];
  }

  delete timeOnline[socket.id];
});

    })

    return io
}

