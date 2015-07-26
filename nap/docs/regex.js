
function check(str) {
    var res = str.match(/(help|wiki|check) (.*)/)
    console.log(res)
}


check("wiki help bootstrap")
check("this is ugly")
