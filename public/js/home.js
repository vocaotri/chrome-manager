const socket = io();
function deleteChrome(id) {
    let isDelete = confirm("Are you sure to delete this chrome?");
    if (isDelete) {
        socket.emit("delete", id);
        socket.on("delete-success", (data) => {
            if (data) {
                window.location.href = "/";
            }
        });
    }
}
function controlChrome(id){
    socket.emit("control-chrome", id);
}
socket.on("chrome-start", (data) => {
    let txtStatus = document.querySelector(`[data-id="${data.id}"]`);
    let txtText = document.querySelector(`[data-text-id="${data.id}"]`);
    txtStatus.innerText = "Tắt";
    txtText.innerText = "Hoạt động";
    txtStatus.classList.add("btn-warning");
    txtStatus.classList.remove("btn-success");
});
socket.on("chrome-stop", (data) => {
    let txtStatus = document.querySelector(`[data-id="${data.id}"]`);
    let txtText = document.querySelector(`[data-text-id="${data.id}"]`);
    txtStatus.innerText = "Mở";
    txtText.innerText = "Ngừng";
    txtStatus.classList.add("btn-success");
    txtStatus.classList.remove("btn-warning");
});
socket.on("chrome-error", (data) => {
    alert(data);
});