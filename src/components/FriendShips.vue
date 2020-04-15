<template>
  <div>
    <div v-if="friendGroup" class="m-mask" @touchstart.stop.prevent @touchmove.stop.prevent></div>
    <transition name="fade">
      <div class="m-pop m-pop-lt">
        <header>选择分组</header>
        <section>
          <ul>
            <li @click="setRemark">
              <a href="javascript:;" ontouchstart>设置备注</a>
            </li>
          </ul>
          <ul class="gp-list">
            <li v-for="(group, index) in groups" :key="index">
              <label class="m-checkbox" ontouchstart>
                {{group.name}}
                <input v-model="group.checked" type="checkbox" />
              </label>
            </li>
          </ul>
        </section>
      </div>
    </transition>
  </div>
</template>