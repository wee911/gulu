/**
 * Created by qzy on 2018/7/17.
 * File description:
 */
const expect = chai.expect;
import Vue from 'vue/types'
import Toast from '../../src/toast'
Vue.config.productionTip = false
Vue.config.devtools = false

describe('Toast', () => {
  it('存在.', () => {
    expect(Toast).to.exist
  })

  describe('props', ()=> {
    it('接受 autoCLose', (done)=>{
      const Constructor = Vue.extend(Toast);
      const div = document.createElement('div');
      document.body.appendChild(div);
      const vm = new Constructor({
        propsData: {
          autoClose: 1,
        }
      }).$mount(div)

      vm.$on('close', ()=> {
        expect(document.body.contains(vm.$el)).to.eq(false)
        done()
      })

    })

    it('接受 closeButton', (done)=>{
      const callback = sinon.fake();
      const Constructor = Vue.extend(Toast);
      const div = document.createElement('div');
      document.body.appendChild(div);
      const vm = new Constructor({
        propsData: {
          closeButton: {
            text:'关闭吧',
            callback
          },
        }
      }).$mount(div)
      let closeBtn = vm.$el.querySelector('.close')
      expect(closeBtn.textContent.trim()).to.eq('关闭吧')
      setTimeout(()=>{
        closeBtn.click()
        expect(callback).to.have.been.called
        done()
      },200)
    })

    it('接受 enableHtml', ()=>{
      const Constructor = Vue.extend(Toast);
      const vm = new Constructor({
        propsData: {enableHtml: true}
      })
      vm.$slots.default = ['<strong id="test">hi</strong>']
      vm.$mount()

      let strong = vm.$el.querySelector('#test')
      expect(strong).to.exist
    })

    it('接受 position', ()=>{
      const Constructor = Vue.extend(Toast);
      const vm = new Constructor({
        propsData: {position: 'bottom'}
      }).$mount()

      expect(vm.$el.classList.contains('position-bottom')).to.eq(true)
    })
  })

})
