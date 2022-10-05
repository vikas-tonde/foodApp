
var a =new Date()
console.log(a.toUTCString())
a.setHours(a.getHours()+5)
a.setMinutes(a.getMinutes()+30)
a.setDate(a.getDate()+1)
console.log(new Date(a));