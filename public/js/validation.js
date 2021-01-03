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
fbi('submit').disabled = true
fbi('passcreate').addEventListener('input', e=>{
    val = e.target.value
    if(val.length>=6){
        fbc('icon-1').innerHTML = '<i class="fas fa-check-circle"></i>'
        fbc('suggest-p1').classList.add('validated')
    } else{
        fbc('icon-1').innerHTML = '<i class="fas fa-circle"></i>'
        fbc('suggest-p1').classList.remove('validated')
    }
    if(/\d/.test(val)){
        fbc('icon-2').innerHTML = '<i class="fas fa-check-circle"></i>'
        fbc('suggest-p2').classList.add('validated')
    } else{
        fbc('icon-2').innerHTML = '<i class="fas fa-circle"></i>'
        fbc('suggest-p2').classList.remove('validated')
    }
    if(/[A-Z]/.test(val) && /[a-z]/.test(val)){
        fbc('icon-3').innerHTML = '<i class="fas fa-check-circle"></i>'
        fbc('suggest-p3').classList.add('validated')
    } else{
        fbc('icon-3').innerHTML = '<i class="fas fa-circle"></i>'
        fbc('suggest-p3').classList.remove('validated')
    }
    if(fbc('suggest-p3').classList.contains('validated')&&fbc('suggest-p2').classList.contains('validated')&&fbc('suggest-p1').classList.contains('validated')){
        fbi('submit').disabled = false
    } else {
        fbi('submit').disabled = true
    }
})
