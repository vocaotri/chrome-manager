const { Chrome } = require("../service/chrome");
const chromeModel = require("../model/chrome");
const path = require("path");
let chromes = [];
exports.home = function (io) {
  io.on("connection", (socket) => {
    socket.on("delete", async (id) => {
      let chrome = chromes.find((chrome) => chrome.id == id);
      if (chrome) {
        socket.emit("chrome-error", "Chrome đã được mở, hãy tắt trước khi xóa");
        return;
      }
      let result = await chromeModel.findByIdAndDelete(id);
      if (result) {
        socket.emit("delete-success", result);
      }
    });
    socket.on("control-chrome", async (id) => {
      let chromeItem = await chromeModel.findById(id);
      if (!chromeItem) {
        socket.emit("chrome-error", "Không tìm thấy chrome");
        return;
      }
      // find chrome from array chromes by id
      let chrome = chromes.find((chrome) => chrome.id == id);
      if (chrome) {
        chrome = chrome.chrome;
        let isClosed = await chrome.closeBrowser();
        if (isClosed) {
          socket.emit("chrome-stop", { id: id, status: true });
        }
        // remove chrome from array chromes
        let index = chromes.findIndex((chrome) => chrome.id == id);
        if (index > -1) {
          chromes.splice(index, 1);
        }
        await chromeModel.findByIdAndUpdate(id, { status: "stop" });
        return;
      }
      chrome = new Chrome(chromeItem);
      const pathsExt = path.resolve(__dirname, "../switchyomega");
      if (await chrome.start(pathsExt, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")) {
        socket.emit("chrome-start", { id: id, status: true });
        chrome.disconnected(async () => {
          socket.emit("chrome-stop", { id: id, status: false });
          let index = chromes.findIndex((chrome) => chrome.id == id);
          if (index > -1) {
            chromes.splice(index, 1);
          }
          await chromeModel.findByIdAndUpdate(id, { status: "stop" });
        });
      }
      chromes.push({ id: chromeItem.id, chrome });
      await chromeModel.findByIdAndUpdate(id, { status: "start" });
    });
  });
  return async function (req, res) {
    let chromes = await chromeModel.find({});
    res.render("home", {
      chromes: chromes
    });
  };
};
exports.add = function (io) {
  io.on("connection", (socket) => {
    socket.on("add", async (data) => {
      let checkProxy = data.proxy.split(":").length > 1 ? true : false;
      if (!checkProxy) {
        socket.emit("chrome-error", "Proxy không hợp lệ. VD: ip:port:username:password");
        return;
      }
      await chromeModel.create(data);
      socket.emit("add-success", true);
    });
  });
  return function (req, res) {
    res.render("add");
  };
}
exports.edit = function (io) {
  io.on("connection", (socket) => {
    socket.on("edit", async (data) => {
      let checkProxy = data.proxy.split(":").length > 1 ? true : false;
      if (!checkProxy) {
        socket.emit("chrome-error", "Proxy không hợp lệ. VD: ip:port:username:password");
        return;
      }
      let chrome = chromes.find((chrome) => chrome.id == data.id);
      if (chrome) {
        socket.emit("chrome-error", "Chrome đã được mở, hãy tắt trước khi sửa");
        return;
      }
      await chromeModel.findByIdAndUpdate(data.id, data.chrome);
      socket.emit("edit-success", true);
    });
  });
  return async function (req, res) {
    const chrome = await chromeModel.findById(req.params.id);
    res.render("edit", { chrome: chrome });
  };
}