import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { db } from "../../firebase";

export interface TaskState {
  //taskが何個あるのかを管理する
  idCount: number;
  // storeに保存するtaskの一覧
  tasks: { id: string; title: string; completed: boolean }[];
  // taskのtitleを編集する際にどのtaskが選択されているか
  selectedTask: { id: string; title: string; completed: boolean };
  // modalを開くか閉じるかのフラグ
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 1,
  tasks: [],
  selectedTask: { id: "", title: "", completed: false },
  isModalOpen: false,
};

/* ===============================
          Taskの全件取得
================================ */
export const fetchTasks = createAsyncThunk("task/getAllTasks", async () => {
  // 日付の降順（新しいデータが上に来る）にデータをソートしてtaskのデータを全件取得
  const res = await db.collection("tasks").orderBy("dateTime", "desc").get();

  // レスポンスの整形
  const allTasks = res.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    completed: doc.data().completed,
  }));

  const taskNunber = allTasks.length;
  const passData = { allTasks, taskNunber };
  return passData;
});

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // taskの作成
    createTask: (state, action) => {
      // state.idCount++;
      // const newTask = {
      //   id: state.idCount,
      //   title: action.payload,
      //   completed: false,
      // };
      // state.tasks = [newTask, ...state.tasks];
    },
    // taskの編集
    editTask: (state, action) => {
      // // state.tasksの中から指定したtaskを抜き出す
      // const task = state.tasks.find((t) => t.id === action.payload.id);
      // if (task) {
      //   // 抜き出したtaskのtitleを書き換える
      //   task.title = action.payload.title;
      // }
    },
    // taskの削除
    deleteTask: (state, aciton) => {
      // // 指定したtask以外で新しくstate.tasksの配列を作成し直している
      // state.tasks = state.tasks.filter((t) => t.id !== aciton.payload.id);
    },
    // どのtaskを選択しているか管理
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    // Modalを開くか閉じるかのフラグ管理
    handleModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    // task完了・未完了のチェックを変更
    completeTask: (state, action) => {
      // // state.tasksの中から指定したtaskを抜き出す
      // const task = state.tasks.find((t) => t.id === action.payload.id);
      // if (task) {
      //   // 抜き出したtaskのcompletedを反転させる
      //   task.completed = !task.completed;
      // }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      // action.paylod === return passData
      state.tasks = action.payload.allTasks;
      state.idCount = action.payload.taskNunber
    })
  }
});

export const {
  createTask,
  editTask,
  deleteTask,
  selectTask,
  handleModalOpen,
  completeTask,
} = taskSlice.actions;

export const selectTasks = (state: RootState): TaskState["tasks"] =>
  state.task.tasks;

export const selectIsModalOpen = (state: RootState): TaskState["isModalOpen"] =>
  state.task.isModalOpen;

export const selectselectedTask = (
  state: RootState
): TaskState["selectedTask"] => state.task.selectedTask;

export default taskSlice.reducer;
