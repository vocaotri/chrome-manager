const socket = io();
const btnAdd = document.getElementById("addChrome");
const txtName = document.getElementById("name");
const txtProxy = document.getElementById("proxy");
const formAdd = document.getElementById("formAdd");
socket.on("connect", () => {
    btnAdd.addEventListener('click', function () {
        if (formAdd.checkValidity()) {
            let chrome = {
                name: txtName.value,
                proxy: txtProxy.value
            }
            socket.emit("add", chrome);
        }else
            formAdd.reportValidity();

    })
});
socket.on("add-success", (data) => {
    if(data){
        txtName.value = "";
        txtProxy.value = "";
        window.location.href = "/";
    }
});
socket.on("chrome-error", (data) => {
    alert(data);
});