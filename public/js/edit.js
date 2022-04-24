const socket = io();
const btnEdit = document.getElementById("editChrome");
const txtName = document.getElementById("name");
const txtProxy = document.getElementById("proxy");
const formEdit = document.getElementById("formEdit");
const id = window.location.pathname.split("/").pop();
socket.on("connect", () => {
    btnEdit.addEventListener('click', function () {
        if (formEdit.checkValidity()) {
            let chrome = {
                name: txtName.value,
                proxy: txtProxy.value
            }
            socket.emit("edit", { id: id, chrome: chrome });
        } else
            formEdit.reportValidity();

    })
});
socket.on("edit-success", (data) => {
    if (data) {
        txtName.value = "";
        txtProxy.value = "";
        window.location.href = "/";
    }
});
socket.on("chrome-error", (data) => {
    alert(data);
    window.location.href = "/";
});