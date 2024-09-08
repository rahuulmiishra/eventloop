const TaskType = {
  Synchronous: 0,
  MicroTask: 1,
  AnimationTask: 2,
  RenderTask: 3,
  MacroTask: 4,
};

let eventLoopCycleCount = 0;
let lastTimeUIUpdatedHappened = null;

const UserCode = [
  {
    type: TaskType.MicroTask,
    fn: function () {
      console.log("MicroTask");

      MicroTasks.push({
        type: TaskType.MicroTask,
        fn: function () {
          console.log("MicroTask");
        },
      });
    },
  },

  {
    type: TaskType.Synchronous,
    fn: function () {
      console.log("Synchronous");
    },
  },

  {
    type: TaskType.MacroTask,
    fn: function () {
      console.log("MacroTask");

      RenderTasks.push({
        type: TaskType.RenderTask,
        fn: function () {
          console.log("RenderTask from MicroTasj");
        },
      });
    },
  },

  {
    type: TaskType.RenderTask,
    fn: function () {
      console.log("RenderTask");
    },
  },
  {
    type: TaskType.AnimationTask,
    fn: function () {
      console.log("Animation");
    },
  },
];

// QUEUESE
const MicroTasks = [];
const MacroTasks = [];
let RenderTasks = [];
let AnimationTasks = [];

const CallStack = [];

function jsRuntime() {
  console.log("Process User Code");
  while (UserCode.length) {
    const userCodeInfo = UserCode.pop();

    if (userCodeInfo.type === TaskType.Synchronous) {
      CallStack.push(userCodeInfo);
      processCallStack();
    }

    if (userCodeInfo.type === TaskType.MicroTask) {
      MicroTasks.push(userCodeInfo);
    }

    if (userCodeInfo.type === TaskType.RenderTask) {
      RenderTasks.push(userCodeInfo);
    }

    if (userCodeInfo.type === TaskType.MacroTask) {
      MacroTasks.push(userCodeInfo);
    }

    if (userCodeInfo.type === TaskType.AnimationTask) {
      AnimationTasks.push(userCodeInfo);
    }

    delay();
  }

  startEventLoop();
}

function startEventLoop() {
  // MicroTasks
  console.log("Event Loop Cycle", eventLoopCycleCount++);

  if (MicroTasks.length) {
    console.log("It's MicroTask time");
    while (MicroTasks.length) {
      const task = MicroTasks.pop();
      task.fn();
    }
  }

  delay();

  if (isRightTimeToDoTheUIUpdate()) {
    console.log("this is right time to do the ui work");
    // Animation
    if (AnimationTasks.length) {
      console.log("It's AnimationTasks time");
      const exisitingAnimationTasks = [...AnimationTasks];
      AnimationTasks = [];
      while (exisitingAnimationTasks.length) {
        const task = exisitingAnimationTasks.pop();
        task.fn();
      }
    }
    delay();
    // Rendering
    if (RenderTasks.length) {
      console.log("It's AnimationTasks time");
      const existingRendering = [...RenderTasks];
      RenderTasks = [];
      while (existingRendering.length) {
        const task = existingRendering.pop();
        task.fn();
      }
    }
  } else {
    console.log("Its not time to do the UI Update");
  }
  delay();
  // MacroStack
  if (MacroTasks.length) {
    console.log("It's MacroTasks time");
    const macroTaskCode = MacroTasks.pop();
    macroTaskCode.fn();
  }

  setTimeout(() => {
    startEventLoop();
  }, 3000);
}

function processCallStack() {
  console.log("Process CallStack");
  while (CallStack.length) {
    const task = CallStack.pop();
    task.fn();
  }
  console.log("Processing CallStack Done");
}

jsRuntime();

function isRightTimeToDoTheUIUpdate() {
  if (lastTimeUIUpdatedHappened) {
    const now = new Date();
    // 12 ms
    console.log(now - lastTimeUIUpdatedHappened);
    if (now - lastTimeUIUpdatedHappened >= 5933) {
      lastTimeUIUpdatedHappened = new Date();
      return true;
    } else {
      return false;
    }
  } else {
    lastTimeUIUpdatedHappened = new Date();
    return true;
  }
}

function delay() {
  let i = 0;
  while (i < 100000000) {
    i++;
  }

  i = 0;
  while (i < 100000000) {
    i++;
  }

  i = 0;
  while (i < 100000000) {
    i++;
  }

  i = 0;
  while (i < 100000000) {
    i++;
  }

  i = 0;
  while (i < 100000000) {
    i++;
  }
}
