import { defineStore } from "pinia";
import { async } from "postcss-js";
import { callWithErrorHandling, readonly, ref } from "vue";
import { callAPI } from "../api";

export const StudyMode = Object.freeze({
  Explorative: "Explorative",
  Empirical: "Empirical",
  Debug: "Debug",
  None: "None",
});

export const Scenario = Object.freeze({
  Init: "InitiateStudy",
  Tutorial: "Tutorial",
  ScenarioA: "ScenarioA",
  ScenarioB: "ScenarioB",
  TestEnviroment: "TestEnviroment",
});

export const AD = Object.freeze({
  Object: "Object",
  Texture: "Texture",
  Illumination: "Illumination",
  Contrast: "Contrast",
});

const allScenarioOrders = Object.freeze([
  [
    Scenario.Tutorial,
    Scenario.ScenarioA, // appears two times to allow configuration of booth AD Pairs
    Scenario.ScenarioA,
    Scenario.ScenarioB,
    Scenario.ScenarioB,
  ],
  [
    Scenario.Tutorial,
    Scenario.ScenarioB, // appears two times to allow configuration of booth AD Pairs
    Scenario.ScenarioB,
    Scenario.ScenarioA,
    Scenario.ScenarioA,
  ],
]);

export const useStudyStore = defineStore("study", () => {
  const studyMode = ref(StudyMode.None);

  function setStudyMode(newMode) {
    studyMode.value = newMode;
  }

  /**
   * function that returns the next scenario. The counter gets incremented in the changeScenario function.
   */
  function getNextScenario() {
    // there is no next Scenario
    if (scenarioOrder.value.length == scenarioCounter.value) {
      return Scenario.Init;
    }

    const nextScenario = scenarioOrder.value[scenarioCounter.value];
    return nextScenario;
  }

  const currentLevel = ref(Scenario.Init);

  const ADDegreeValue = ref({
    Object: 0,
    Texture: 0,
    Illumination: 0,
    Contrast: 0,
  });

  function getSubjectID() {
    return subjectID.value;
  }

  function getADDegreeSteps(AD) {
    return ADDegreeSteps.value[AD];
  }

  function getADDegreeValueFromStore(AD) {
    return ADDegreeValue.value[AD];
  }

  const subjectID = ref(-1);

  const scenarioOrder = ref([]);
  const scenarioCounter = ref(0);

  const configFirstADPair = ref([]);
  const configSecondADPair = ref([]);

  /**
   * Sets first, second AD Pair and the scenario order for the explorative Study mode. Gets called in the initiation process
   * @param {*} subjectID
   */
  function generateExplorativeADandScenarioOrder(subjectID) {
    scenarioCounter.value = 0;

    switch (subjectID % 8) {
      case 0:
        configFirstADPair.value = [AD.Object, AD.Texture];
        configSecondADPair.value = [AD.Illumination, AD.Contrast];
        scenarioOrder.value = allScenarioOrders[0];
        break;
      case 1:
        configFirstADPair.value = [AD.Texture, AD.Object];
        configSecondADPair.value = [AD.Contrast, AD.Illumination];
        scenarioOrder.value = allScenarioOrders[0];
        break;
      case 2:
        configFirstADPair.value = [AD.Illumination, AD.Contrast];
        configSecondADPair.value = [AD.Object, AD.Texture];
        scenarioOrder.value = allScenarioOrders[0];
        break;
      case 3:
        configFirstADPair.value = [AD.Contrast, AD.Illumination];
        configSecondADPair.value = [AD.Texture, AD.Object];
        scenarioOrder.value = allScenarioOrders[0];
        break;
      case 4:
        configFirstADPair.value = [AD.Object, AD.Texture];
        configSecondADPair.value = [AD.Illumination, AD.Contrast];
        scenarioOrder.value = allScenarioOrders[1];
        break;
      case 5:
        configFirstADPair.value = [AD.Texture, AD.Object];
        configSecondADPair.value = [AD.Contrast, AD.Illumination];
        scenarioOrder.value = allScenarioOrders[1];
        break;
      case 6:
        configFirstADPair.value = [AD.Illumination, AD.Contrast];
        configSecondADPair.value = [AD.Object, AD.Texture];
        scenarioOrder.value = allScenarioOrders[1];
        break;
      case 7:
        configFirstADPair.value = [AD.Contrast, AD.Illumination];
        configSecondADPair.value = [AD.Texture, AD.Object];
        scenarioOrder.value = allScenarioOrders[1];
        break;
    }

    console.log("ID: " + subjectID);
    console.log(configFirstADPair.value);
    console.log(configSecondADPair.value);
    console.log(scenarioOrder.value);
  }

  /**
   * determines the to be configured AD Pair. Values from 0 - 3
   * - Scenario order gets determined with allScenarioOrder[]
   */
  const configCounter = ref(0);

  function incConfigCounter() {
    if (configCounter.value < 3) {
      configCounter.value++;
    }
  }

  /**
   *
   * @returns the current AD Pair according to the configCounter
   */
  function getCurrentADPair() {
    if (configCounter.value == 0 || configCounter.value == 2) {
      return configFirstADPair.value;
    } else if (configCounter.value == 1 || configCounter.value == 3) {
      return configSecondADPair.value;
    }
  }

  /**
   * TUTORIAL
   */
  const bTutorialIsEnabled = ref(true);

  function setBTutorialIsEnabled(bool) {
    bTutorialIsEnabled.value = bool;
  }

  function getBTutorialIsEnabled() {
    return bTutorialIsEnabled.value;
  }

  async function setTutorialColor(num) {
    console.log("selected: " + num);
    return generateAPICall({
      functionName: "changeColor",
      parameters: { newHue: num },
    });
  }

  /**
   * TASK
   */

  const bTaskIsEnabled = ref(true);

  function setBTaskIsEnabled(bool) {
    bTaskIsEnabled.value = bool;
  }

  function getBTaskIsEnabled() {
    return bTaskIsEnabled.value;
  }

  async function setInitialADDegrees() {
    setADDegree({ AD: AD.Object, Degree: 16 });
    setADDegree({ AD: AD.Texture, Degree: 15 });
    setADDegree({ AD: AD.Illumination, Degree: 7 });
    setADDegree({ AD: AD.Contrast, Degree: 8 });
  }

  /*
   * API CALLS
   */
  async function generateAPICall({ functionName, parameters }) {
    return callAPI({
      functionName: functionName,
      parameters: parameters,
      LevelPath: currentLevel.value,
    });
  }

  async function setCanTeleport(bool) {
    console.log("teleport-set");
    return generateAPICall({
      functionName: "setCanTeleport",
      parameters: { bCanTeleport: bool },
    });
  }

  async function setADDegree({ AD, Degree }) {
    ADDegreeValue.value[AD] = Degree;
    return generateAPICall({
      functionName: "setADDegree",
      parameters: { AD, Degree },
    });
  }

  async function commitADDegree(AD) {
    return generateAPICall({
      functionName: "commitAD",
      parameters: { AD },
    });
  }

  const ADDegreeSteps = ref({});

  async function getADDegreeStepsFromEngine() {
    ADDegreeSteps.value = await generateAPICall({
      functionName: "getADDegreeSteps",
    });
  }

  async function changeScenario({ newScenario: _newScenario, increment: inc }) {
    let _statusCounter;

    // select status counter to send
    switch (studyMode.value) {
      case StudyMode.Explorative:
        _statusCounter = configCounter.value;
        break;
      case StudyMode.Empirical:
        // Todo Emperical Counter
        _statusCounter = 0;
        break;
      default:
        _statusCounter = 0;
    }

    console.log("config Counter: " + _statusCounter);

    const res = await generateAPICall({
      functionName: "changeScenario",
      parameters: { newScenario: _newScenario, statusCounter: _statusCounter },
    });
    //used for scenario selection in emperical and explorative studies
    currentLevel.value = _newScenario;
    if (inc) {
      scenarioCounter.value++;
    }
    console.log(res);
  }

  async function initiateStudy({ SubjectID, StudyMode, ADPreset }) {
    subjectID.value = SubjectID;
    configCounter.value = 0;
    scenarioCounter.value = 0;
    let res = await generateAPICall({
      functionName: "initiateStudy",
      parameters: { SubjectID, StudyMode, ADPreset },
    });

    return res.IDAlreadyInUse;
  }

  async function startTask() {
    // check for current AD
    console.log("current AD Pair: ");
    console.log(getCurrentADPair());
    let bIsICADPair =
      getCurrentADPair()[0] == AD.Illumination ||
      getCurrentADPair()[0] == AD.Contrast;
    console.log("CurrentADPair[0]: " + bIsICADPair);

    return generateAPICall({
      functionName: "startTask",
      parameters: { isICADPair: bIsICADPair },
    });
  }

  async function endTask() {
    return generateAPICall({
      functionName: "endTask",
    });
  }

  async function getAllTaskObjectInfo() {
    let res = await generateAPICall({
      functionName: "getAllTaskObjectInfo",
    });
    //remapping object keys
    const data = res.TaskObjectInfoList.map((TaskObject) => {
      return {
        key: TaskObject.key_9_114BA5B54578303E7D5CB697E5B69BEF,
        isManual: TaskObject.isManual_1_2D83D5A945581EBF2232AE886BBC856C,
        ManualCompletion:
          TaskObject.ManualCompletion_4_B4C1609A411004A8E12B1D9874DE2387,
        isComplete: TaskObject.isComplete_12_5A0578374130044EC496ADBDFCEF541C,
      };
    });
    return data;
  }

  async function getAllTaskObjectCompletion() {
    return generateAPICall({
      functionName: "getAllTaskObjectCompletion",
    });
  }

  async function completeTaskObject(TaskIndex) {
    return generateAPICall({
      functionName: "completeTaskObject",
      parameters: { TaskIndex },
    });
  }

  async function sendStudyNotes(note) {
    return generateAPICall({
      functionName: "commitNote",
      parameters: { note },
    });
  }

  async function exportResults() {
    return generateAPICall({
      functionName: "exportResults",
    });
  }

  return {
    studyMode: readonly(studyMode),
    setStudyMode,
    scenarioOrder: readonly(scenarioOrder),
    getNextScenario,
    ADDegreeValue,
    Scenario,
    currentLevel,
    setADDegree,
    commitADDegree,
    exportResults,
    getADDegreeStepsFromEngine,
    getADDegreeSteps,
    ADDegreeSteps,
    initiateStudy,
    generateExplorativeADandScenarioOrder,
    changeScenario,
    getADDegreeValueFromStore,
    configFirstADPair: readonly(configFirstADPair),
    configSecondADPair: readonly(configSecondADPair),
    configCounter: readonly(configCounter),
    incConfigCounter,
    getCurrentADPair,
    startTask,
    endTask,
    getAllTaskObjectInfo,
    getAllTaskObjectCompletion,
    completeTaskObject,
    getSubjectID,
    sendStudyNotes,
    getBTaskIsEnabled: getBTaskIsEnabled,
    setBTaskIsEnabled,
    setInitialADDegrees,
    incTmpStudyCounter: incConfigCounter,
    getBTutorialIsEnabled,
    setBTutorialIsEnabled,
    setTutorialColor,
    setCanTeleport,
  };
});
