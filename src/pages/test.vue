<script setup>
import DegreeScale from "../components/DegreeScale.vue";
import { AD, useStudyStore } from "../stores/study";

const store = useStudyStore();
store.setInitialADDegrees();
</script>

<template>
  <div>
    <h1 class="headline">AD Test</h1>
    <div class="flex flex-col justify-between items-center h-full w-full pb-6">
      <div class="AD-card">
        <h2 class="font-bold text-2xl mb-3">Number of Environmental Objects</h2>
        <div class="rating-scale-image-wrapper">
          <img class="AD-icon" src="..\assets\AD-icons\Object-low.png" alt="" />
          <DegreeScale
            class="flex-1"
            :scale="store.ADDegreeSteps.Object"
            :active-degree="store.getADDegreeValueFromStore(AD.Object)"
            @degree-select="
              (inputDegree) =>
                store.setADDegree({ AD: AD.Object, Degree: inputDegree })
            "
          />
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Object-high.png"
            alt=""
          />
        </div>
      </div>
      <div class="AD-card">
        <h2 class="font-bold text-2xl mb-3">Texture Realism</h2>
        <div class="rating-scale-image-wrapper">
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Texture-low.png"
            alt=""
          />
          <DegreeScale
            class="flex-1"
            :scale="store.ADDegreeSteps.Texture"
            :active-degree="store.getADDegreeValueFromStore(AD.Texture)"
            @degree-select="
              (inputDegree) =>
                store.setADDegree({ AD: AD.Texture, Degree: inputDegree })
            "
          />
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Texture-high.png"
            alt=""
          />
        </div>
      </div>
      <div class="AD-card">
        <h2 class="font-bold text-2xl mb-3">Illumination Intensity</h2>
        <div class="rating-scale-image-wrapper">
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Illumination-low.png"
            alt=""
          />
          <DegreeScale
            class="flex-1"
            :scale="store.ADDegreeSteps.Illumination"
            :active-degree="store.getADDegreeValueFromStore(AD.Illumination)"
            @degree-select="
              (inputDegree) =>
                store.setADDegree({ AD: AD.Illumination, Degree: inputDegree })
            "
          />
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Illumination-high.png"
            alt=""
          />
        </div>
      </div>
      <div class="AD-card">
        <h2 class="font-bold text-2xl mb-3">Contrast Ratio</h2>
        <div class="rating-scale-image-wrapper">
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Contrast-low.png"
            alt=""
          />
          <DegreeScale
            class="flex-1"
            :scale="store.ADDegreeSteps.Contrast"
            :active-degree="store.getADDegreeValueFromStore(AD.Contrast)"
            @degree-select="
              (inputDegree) =>
                store.setADDegree({ AD: AD.Contrast, Degree: inputDegree })
            "
          />
          <img
            class="AD-icon"
            src="..\assets\AD-icons\Contrast-high.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.AD-card {
  @apply w-full bg-white text-slate-700 p-6 rounded-md shadow-md;
}

.AD-icon {
  @apply w-16 flex-none;
}

.rating-scale-image-wrapper {
  @apply flex flex-row justify-between py-4;
}
</style>
