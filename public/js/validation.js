function fbc(cl) {
    return document.getElementsByClassName(cl)[0]
}
function fbi(id) {
    return document.getElementById(id)
}

function checkempty(elem) {
    return elem.value == ""
}
validator = ()=>{
    fname = document.getElementById("name")
    pass1 = fbi("passcreate")
    pass2 = fbi("passconfirm")
    uname = fbi("username")
    emptyname = fbi("name-e")
    emptyusername = fbi("empty-u")
    emptyp1 = fbi("empty-p")
    emptyp2 = fbi("empty-p2")

    errorp1 = fbi("pass-1")
    errorp2 = fbi("pass-2")
    erroruser = fbi("unique")
    errors = false
    if (checkempty(fname)) {
        emptyname.style = "display:block;"    
        errors = true
    }
    if (checkempty(pass1)) {
        errors = true
        emptyp1.style = "display:block;"
    }
    if (checkempty(uname)) {
        errors = true
        emptyusername.style = "display:block;"
    }
    if (checkempty(pass2)) {
        errors = true
        emptyp2.style = "display:block;"
    }
    if(pass1.value!=pass2.value){
        errors = true
        errorp2.style = "display:block;"
    }
    if(pass1.value.length<6){
        errors = true
        errorp1.style = "display:block;"
    }
    return errors
}
fbc("form").addEventListener('submit', (e) => {
    if(validator()){
        e.preventDefault()
        e.stopPropagation()
    }
})