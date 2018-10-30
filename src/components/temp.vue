<template>
  <div class="today-body">
    <div class="today-list clearfix">
      <div class="badge-box fl">
        <span class="today-badge green" v-if="option.tradeDesc==='出售' || option.tradeDesc==='租购'">售</span>
        <span class="today-badge red"   v-if="option.tradeDesc==='租售' || option.tradeDesc==='租购' ">租</span>
        <span class="today-badge white"  v-if="option.typeDesc">私</span>
        <span class="today-badge white" v-if="option.levelDesc">{{option.levelDesc}}</span>
        <p class="today-time">{{option.followTime}}</p>
      </div>
      <div class="info-box fl">
        <p class="info-name"><span>1</span><span>·2室</span><span>3厅</span><span>4卫</span><span>82·㎡</span></p>
      </div>
      <div class="price-box fr">
        <p class="info-price">{{option.salePrice}}
          <span>万</span>
        </p>
        <p class="info-rent">{{option.rentPrice}}
          <span>元/月</span>
        </p>
        <header @click="changeTitle">
               <h1>{{title}}</h1>
        </header>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'todayh',
  props: {
    option: {
      type: Object,
      require: true
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      title1: 'vue demo'
    };
  },
  methods: {
    changeTitle: function () {
      this.$emit('titleChanged', '子向父组件传值');
    }
  }
};
</script>

<style lang="scss">

</style>
