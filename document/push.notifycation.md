
1. INITIAL

notify.hostInit("https://notifiv2.intern.midvietnam.com");

2. Send notify to User 

const fb = await notify.toUsers(package: IPackage)

interface IPackage {
  userList: string[], // userlist ex: ["mid12","mid13"]
  notifyPacket: {
    image: "", // image url ex: https://mypic.com/pic1
    title: "", // notification title ex: Title
    body: "", // notification body
    dataType: "wChat", // fixed wChat
    type: "info",  // fixed info
    navigation: "", //app, web navigation
  },
}
