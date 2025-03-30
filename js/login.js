console.log("login.js cargado");

const usuario = "admin";
const contraseña = "1234";

function validarLogin(){
    let user=document.getElementById("inpuText").value.trim();
    let pass=document.getElementById("contraseña").value.trim();
    let mensaje=document.getElementById("mensaje");

    if(user===usuario && pass===contraseña){
        mensaje.textContent="login exitoso";
        setTimeout(()=>{
            window.location.href="index.html";
        },200);
       
    }else{
        mensaje.textContent="usuario o contraseña incorrecta";

    }
}
