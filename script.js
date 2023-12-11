const listContainer = document.getElementById("list-container");

const getList = async () => {
  let url = "http://127.0.0.1:5000/tasks";

  fetch(url, {
    method: "get"
  })
    .then((response) => response.json())
    .then((data) => {
      tasksList = data.tasks;
      listContainer.innerHTML = "";
      data.tasks.forEach((item) =>
        insertList(item.description, item.id, item.done)
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

getList();

const postItem = async (inputBoxValue) => {
  const formData = new FormData();
  formData.append("description", inputBoxValue);

  let url = "http://127.0.0.1:5000/task";
  fetch(url, {
    method: "POST",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

const insertDelButton = (parent) => {
  let icon = document.createElement("i");
  icon.className = "fa-solid fa-trash";
  parent.appendChild(icon);
};

const deleteItem = (taskId) => {
  let url = `http://127.0.0.1:5000/task?id=${taskId}`;
  fetch(url, {
    method: "delete"
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

const cleanList = () => {
  var list = document.getElementById("list-container");
  if (list) {
    var liCount = list.getElementsByTagName("li").length;
    // Remove iniciando pela última
    for (var i = liCount - 1; i >= 0; i--) {
      var liElement = list.getElementsByTagName("li")[i];
      list.removeChild(liElement);
    }
  } else {
    console.error('Element with id "myList" not found.');
  }
};

const newItem = async () => {
  let inputBoxValue = document.getElementById("input-box").value;

  if (inputBoxValue === "") {
    alert("Escreva sua tarefa!");
  } else {
    try {
      await postItem(inputBoxValue);
      cleanList();
      setTimeout(() => {
        getList();
      }, 100); // Atualiza a lista depois de adicionar o novo item

      document.getElementById("input-box").value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const insertList = (taskDescription, taskId, taskStatus) => {
  let item = [taskDescription, taskId, taskStatus];
  let li = document.createElement("li");
  li.setAttribute("id", taskId);
  li.setAttribute("class", taskStatus ? "checked" : "");
  li.innerHTML = item[0];
  insertDelButton(li);
  listContainer.appendChild(li);

  // Add click event listener to each li element
  li.addEventListener("click", (e) => {
    const taskId = e.currentTarget.getAttribute("id");
    if (e.target.tagName === "I") {
      e.target.parentElement.remove();
      deleteItem(taskId);
    } else {
      e.currentTarget.classList.toggle("checked");

      const isChecked = e.currentTarget.classList.contains("checked");
      isChecked ? updateTaskStatus(taskId, 1) : updateTaskStatus(taskId, 0);
    }
  });
};

const updateTaskStatus = (taskId, status) => {
  const formData = new FormData();
  formData.append("id", taskId);
  formData.append("done", status);

  let url = "http://127.0.0.1:5000/task";
  fetch(url, {
    method: "PATCH",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });

  cleanList();
  setTimeout(() => {
    getList();
  }, 50); // Atualiza a lista depois de adicionar o novo item

  document.getElementById("input-box").value = "";
};
