<template>
    <div @mouseenter="pause"
         @mouseleave="resume"
         @touchend="onTouchEnd"
         @touchmove="onTouchMove"
         @touchstart="onTouchStart"
         class="g-slides"
    >
        <div class="g-slides-window">
            <div class="g-slides-wrapper">
                <slot></slot>
            </div>
        </div>
        <div class="g-slides-dots">
            <span @click="select(selectedIndex - 1)">
                <g-icon name="left"></g-icon>
            </span>
            <span :class="{ active: selectedIndex === n - 1 }"
                  @click="select(n - 1)"
                  :key="n"
                  :data-index="n-1"
                  v-for="n in childrenLength">
                {{ n - 1 }}
            </span>
            <span @click="select(selectedIndex + 1)">
                <g-icon name="right"></g-icon>
            </span>
        </div>
    </div>
</template>

<script>
  import GIcon from '../icon'

  export default {
    name: "g-slides",
    components: {GIcon},
    props: {
      selected: {
        type: String
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      delay:{
        type: Number,
        default: 3000
      }
    },
    data() {
      return {
        lastSelectedIndex: undefined,
        childrenLength: 0,
        timerId: undefined,
        startTouch: undefined
      };
    },
    computed: {
      selectedIndex() {
        if (!this.selected) return 0;
        return this.names.indexOf(this.selected) || 0;
      },
      names() {
        return this.items.map(vm => vm.name);
      },
      items() {
        return this.$children.filter(vm => vm.$options.name === 'SlidesItem')
      }
    },
    mounted() {
      this.updateChildren();
      this.playAutomatically();
      this.childrenLength = this.items.length;
    },
    updated() {
      this.updateChildren();
    },
    methods: {
      onTouchStart(e) {
        if (e.touches.length > 1) return;
        this.touchstart = e.touches[0];
      },
      onTouchMove(e) {
        this.pause();
        console.log(1);
      },
      onTouchEnd(e) {
        const endTouch = e.changedTouches[0];
        const {clientX: x1, clientY: y1} = this.touchstart
        const {clientX: x2, clientY: y2} = endTouch
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const deltaY = Math.abs(y2 - y1);
        const rate = distance / deltaY;
        if (rate > 2) {
          if (x2 > x1) {
            this.select(this.selectedIndex - 1)
          } else {
            this.select(this.selectedIndex + 1)
          }
        }
        this.$nextTick(() => {
          this.playAutomatically();
        })
        console.log(2);
      },
      select(index) {
        if (index === -1) index = this.names.length - 1;
        if (index === this.names.length) index = 0;
        this.lastSelectedIndex = this.selectedIndex;
        this.$emit("update:selected", this.names[index]);
      },
      playAutomatically() {
        if (!this.autoPlay) return;
        if (this.timerId) return;
        const run = () => {
          let index = this.names.indexOf(this.getSelected());
          let newIndex = index + 1;
          this.select(newIndex);
          this.timerId = setTimeout(run, this.delay);
        };
        this.timerId = setTimeout(run, this.delay);
      },
      pause() {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      },
      resume() {
        this.playAutomatically();
      },
      getSelected() {
        return this.selected || this.$children[0].name;
      },
      updateChildren() {
        this.$children.forEach(vm => {
          let reverse = this.selectedIndex <= this.lastSelectedIndex;
          if (
            this.lastSelectedIndex === this.childrenLength - 1 &&
            this.timerId &&
            (this.selectedIndex === 0 || this.lastSelectedIndex === 0)
          ) {
            reverse = false;
          }
          vm.reverse = reverse;
          this.$nextTick(() => {
            vm.selected = this.getSelected();
          });
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
    .g-slides {
        &-window {
            overflow: hidden;
        }

        &-wrapper {
            position: relative;
        }

        &-dots {
            padding: 8px 0;
            display: flex;
            align-items: center;
            justify-content: center;

            > span {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                margin: 0 8px;
                background: #ddd;
                font-size: 12px;

                &:hover {
                    cursor: pointer;
                }

                &.active {
                    background: black;
                    color: #fff;

                    &:hover {
                        cursor: default;
                    }
                }
            }

        }
    }
</style>
